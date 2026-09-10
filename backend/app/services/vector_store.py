import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.models.schemas import DocumentChunk, SourceChunk, CollectionStats
from app.core.config import Settings
from app.core.logger import logger


class InMemoryVectorStore:
    """Lightweight in-memory vector store for isolated test suites."""

    def __init__(self, name: str = "in_memory_store"):
        self.name = name
        self.chunks: List[DocumentChunk] = []
        self.embeddings: List[List[float]] = []

    def add_chunks(self, chunks: List[DocumentChunk], embeddings: List[List[float]]) -> int:
        self.chunks.extend(chunks)
        self.embeddings.extend(embeddings)
        return len(chunks)

    def query(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        where_filter: Optional[Dict[str, Any]] = None
    ) -> List[SourceChunk]:
        if not self.chunks or not self.embeddings:
            return []

        # Cosine similarity calculation
        import math
        scored = []
        for chunk, emb in zip(self.chunks, self.embeddings):
            dot = sum(a * b for a, b in zip(query_embedding, emb))
            norm_a = math.sqrt(sum(a * a for a in query_embedding)) or 1.0
            norm_b = math.sqrt(sum(b * b for b in emb)) or 1.0
            cosine_sim = dot / (norm_a * norm_b)
            distance = round(1.0 - cosine_sim, 4)
            scored.append((distance, chunk))

        scored.sort(key=lambda x: x[0])
        results = []
        for dist, chunk in scored[:top_k]:
            results.append(
                SourceChunk(
                    content=chunk.content,
                    metadata=chunk.metadata,
                    distance=dist
                )
            )
        return results

    def get_stats(self) -> CollectionStats:
        return CollectionStats(
            collection_name=self.name,
            total_chunks=len(self.chunks),
            persist_directory="memory://"
        )

    def delete_by_doc_id(self, doc_id: str) -> int:
        initial = len(self.chunks)
        filtered = [
            (c, e) for c, e in zip(self.chunks, self.embeddings)
            if c.metadata.get("doc_id") != doc_id
        ]
        self.chunks = [c for c, _ in filtered]
        self.embeddings = [e for _, e in filtered]
        return initial - len(self.chunks)

    def reset(self):
        self.chunks.clear()
        self.embeddings.clear()


class LocalFileVectorStore(InMemoryVectorStore):
    """
    Production-grade local file vector store.
    Stores embeddings and chunk metadata directly in a local JSON file.
    Requires NO external database (no PostgreSQL, no Docker, no cloud DB).
    """

    def __init__(self, file_path: str = "data/vector_store.json", name: str = "local_file_store"):
        super().__init__(name=name)
        self.file_path = Path(file_path).resolve()
        self._load_from_disk()

    def _load_from_disk(self):
        if not self.file_path.exists():
            logger.info(f"Local vector store file not found at '{self.file_path}'. Will be populated on ingestion.")
            return

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            raw_chunks = data.get("chunks", [])
            self.chunks = [
                DocumentChunk(
                    chunk_id=c.get("chunk_id", c.get("id", str(i))),
                    content=c.get("content", ""),
                    metadata=c.get("metadata", {})
                )
                for i, c in enumerate(raw_chunks)
            ]
            self.embeddings = data.get("embeddings", [])
            logger.info(f"Loaded {len(self.chunks)} chunks from local vector store '{self.file_path}'")
        except Exception as e:
            logger.error(f"Error loading local vector store '{self.file_path}': {e}")

    def _save_to_disk(self):
        try:
            self.file_path.parent.mkdir(parents=True, exist_ok=True)
            payload = {
                "version": "1.0",
                "total_chunks": len(self.chunks),
                "chunks": [
                    {
                        "chunk_id": getattr(c, "chunk_id", getattr(c, "id", str(i))),
                        "content": c.content,
                        "metadata": c.metadata
                    }
                    for i, c in enumerate(self.chunks)
                ],
                "embeddings": self.embeddings
            }
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, ensure_ascii=False, indent=2)
            logger.info(f"Persisted {len(self.chunks)} chunks to local vector store '{self.file_path}'")
        except Exception as e:
            logger.error(f"Error saving to local vector store '{self.file_path}': {e}")

    def add_chunks(self, chunks: List[DocumentChunk], embeddings: List[List[float]]) -> int:
        count = super().add_chunks(chunks, embeddings)
        self._save_to_disk()
        return count

    def get_stats(self) -> CollectionStats:
        return CollectionStats(
            collection_name=self.name,
            total_chunks=len(self.chunks),
            persist_directory=str(self.file_path)
        )

    def delete_by_doc_id(self, doc_id: str) -> int:
        deleted = super().delete_by_doc_id(doc_id)
        if deleted > 0:
            self._save_to_disk()
        return deleted

    def reset(self):
        super().reset()
        self._save_to_disk()



class PGVectorStore:
    """PostgreSQL Vector Store implementation using pgvector extension."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.conn_str = settings.postgres_connection_string
        self.table_name = settings.PGVECTOR_TABLE_NAME
        self._init_db()

    def _get_connection(self):
        """Creates and returns a connection with pgvector registered."""
        try:
            import psycopg2
            from pgvector.psycopg2 import register_vector
        except ImportError:
            raise RuntimeError("psycopg2-binary or pgvector not installed. Run 'pip install psycopg2-binary pgvector' to use PostgreSQL.")
        conn = psycopg2.connect(self.conn_str)
        register_vector(conn)
        return conn

    def _init_db(self):
        """Ensures vector extension and embedding table exist."""
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    # 1. Enable pgvector extension
                    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

                    # 2. Create embeddings table
                    cur.execute(f"""
                        CREATE TABLE IF NOT EXISTS {self.table_name} (
                            id VARCHAR(255) PRIMARY KEY,
                            doc_id VARCHAR(255),
                            content TEXT NOT NULL,
                            metadata JSONB DEFAULT '{{}}'::jsonb,
                            embedding vector,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                    """)
                    cur.execute(f"""
                        CREATE INDEX IF NOT EXISTS idx_{self.table_name}_doc_id
                        ON {self.table_name} (doc_id);
                    """)
                conn.commit()
            logger.info(f"Initialized PostgreSQL pgvector table '{self.table_name}'")
        except Exception as e:
            logger.error(f"Failed to initialize pgvector database: {e}")
            raise

    def add_chunks(self, chunks: List[DocumentChunk], embeddings: List[List[float]]) -> int:
        """Inserts or updates document chunks and vector embeddings."""
        if not chunks:
            return 0

        try:
            from psycopg2.extras import Json
        except ImportError:
            Json = lambda x: json.dumps(x)

        query = f"""
            INSERT INTO {self.table_name} (id, doc_id, content, metadata, embedding)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                metadata = EXCLUDED.metadata,
                embedding = EXCLUDED.embedding;
        """

        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    for chunk, emb in zip(chunks, embeddings):
                        doc_id = chunk.metadata.get("doc_id", "default_doc")
                        cur.execute(
                            query,
                            (chunk.chunk_id, doc_id, chunk.content, Json(chunk.metadata), emb)
                        )
                conn.commit()
            logger.info(f"Successfully indexed {len(chunks)} chunks in PostgreSQL ({self.table_name}).")
            return len(chunks)
        except Exception as e:
            logger.error(f"Error inserting chunks into pgvector: {e}")
            raise

    def query(
        self,
        query_embedding: List[float],
        top_k: int = 4,
        where_filter: Optional[Dict[str, Any]] = None
    ) -> List[SourceChunk]:
        """Performs cosine similarity search using pgvector '<=>' operator."""
        sql = f"""
            SELECT content, metadata, (embedding <=> %s) AS distance
            FROM {self.table_name}
            WHERE embedding IS NOT NULL
        """
        params: List[Any] = [query_embedding]

        if where_filter and "doc_id" in where_filter:
            sql += " AND doc_id = %s"
            params.append(where_filter["doc_id"])

        sql += " ORDER BY embedding <=> %s ASC LIMIT %s;"
        params.extend([query_embedding, top_k])

        results: List[SourceChunk] = []
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, tuple(params))
                    rows = cur.fetchall()
                    for row in rows:
                        content, meta, dist = row
                        results.append(
                            SourceChunk(
                                content=content,
                                metadata=meta if isinstance(meta, dict) else {},
                                distance=round(float(dist), 4) if dist is not None else None
                            )
                        )
            logger.info(f"Retrieved {len(results)} chunks from PostgreSQL pgvector.")
            return results
        except Exception as e:
            logger.error(f"Error querying pgvector: {e}")
            return []

    def get_stats(self) -> CollectionStats:
        """Returns statistics on total indexed chunks in PostgreSQL."""
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"SELECT COUNT(*) FROM {self.table_name};")
                    count = cur.fetchone()[0]
            return CollectionStats(
                collection_name=self.table_name,
                total_chunks=count,
                persist_directory=f"postgresql://{self.settings.POSTGRES_HOST}:{self.settings.POSTGRES_PORT}/{self.settings.POSTGRES_DB}"
            )
        except Exception as e:
            logger.error(f"Failed to fetch stats from pgvector: {e}")
            return CollectionStats(
                collection_name=self.table_name,
                total_chunks=0,
                persist_directory="postgresql://disconnected"
            )

    def delete_by_doc_id(self, doc_id: str) -> int:
        """Deletes chunks matching doc_id."""
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"DELETE FROM {self.table_name} WHERE doc_id = %s;", (doc_id,))
                    deleted = cur.rowcount
                conn.commit()
            logger.info(f"Deleted {deleted} chunks for doc_id '{doc_id}' from pgvector.")
            return deleted
        except Exception as e:
            logger.error(f"Error deleting doc_id '{doc_id}' from pgvector: {e}")
            return 0

    def reset(self):
        """Clears all records in the table."""
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"TRUNCATE TABLE {self.table_name};")
                conn.commit()
            logger.info(f"Truncated table '{self.table_name}'")
        except Exception as e:
            logger.error(f"Error truncating table '{self.table_name}': {e}")


def get_vector_store(settings: Settings) -> Any:
    """Factory returning LocalFileVectorStore (zero external DB needed) or PGVectorStore."""
    store_type = getattr(settings, "VECTOR_STORE_TYPE", "local").lower()

    if store_type == "local":
        local_path = getattr(settings, "LOCAL_VECTOR_STORE_PATH", "data/vector_store.json")
        logger.info(f"Using LocalFileVectorStore (Zero DB needed) at '{local_path}'")
        return LocalFileVectorStore(file_path=local_path, name="dawn_rag_store")

    try:
        logger.info("Initializing PostgreSQL pgvector store...")
        return PGVectorStore(settings=settings)
    except Exception as e:
        local_path = getattr(settings, "LOCAL_VECTOR_STORE_PATH", "data/vector_store.json")
        logger.warning(
            f"Could not connect to PostgreSQL pgvector ({e}). "
            f"Falling back to LocalFileVectorStore at '{local_path}'."
        )
        return LocalFileVectorStore(file_path=local_path, name="dawn_rag_store")
