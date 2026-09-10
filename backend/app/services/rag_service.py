import uuid
from typing import Dict, Any, Optional, List
from app.core.config import Settings
from app.models.schemas import (
    DocumentChunk,
    IngestResponse,
    QueryResponse,
    SourceChunk,
    CollectionStats,
)
from app.services.document_loader import DocumentProcessor
from app.services.embeddings import BaseEmbeddingProvider, get_embedding_provider
from app.services.vector_store import PGVectorStore, get_vector_store
from app.services.llm import BaseLLMProvider, get_llm_provider
from app.core.logger import logger


class RAGService:
    """Coordinates Document Ingestion, Embedding Generation, Vector Retrieval, and Answer Synthesis."""

    def __init__(
        self,
        settings: Settings,
        processor: Optional[DocumentProcessor] = None,
        embeddings: Optional[BaseEmbeddingProvider] = None,
        vector_store: Optional[Any] = None,
        llm: Optional[BaseLLMProvider] = None,
    ):
        self.settings = settings
        self.processor = processor or DocumentProcessor(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        self.embeddings = embeddings or get_embedding_provider(settings)
        self.vector_store = vector_store or get_vector_store(settings)
        self.llm = llm or get_llm_provider(settings)

    def ingest_text(
        self,
        text: str,
        title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        doc_id: Optional[str] = None
    ) -> IngestResponse:
        """Chunks, embeds, and stores text in the vector store."""
        doc_id = doc_id or str(uuid.uuid4())
        doc_title = title or f"Doc_{doc_id[:8]}"

        # 1. Chunking
        chunks = self.processor.process_document(
            content=text,
            title=doc_title,
            metadata=metadata or {},
            doc_id=doc_id
        )

        if not chunks:
            return IngestResponse(
                message="No valid content found to index",
                document_id=doc_id,
                chunks_indexed=0,
                title=doc_title
            )

        # 2. Embedding
        chunk_texts = [c.content for c in chunks]
        embeddings = self.embeddings.embed_documents(chunk_texts)

        # 3. Store in Vector DB
        indexed_count = self.vector_store.add_chunks(chunks, embeddings)

        return IngestResponse(
            message="Document successfully chunked, embedded, and indexed",
            document_id=doc_id,
            chunks_indexed=indexed_count,
            title=doc_title
        )

    def retrieve_context(self, query: str, top_k: Optional[int] = None) -> List[SourceChunk]:
        """Performs vector search to retrieve the most relevant context chunks."""
        k = top_k or self.settings.DEFAULT_TOP_K
        query_vector = self.embeddings.embed_query(query)
        sources = self.vector_store.query(query_embedding=query_vector, top_k=k)
        return sources

    def answer_query(self, query: str, top_k: Optional[int] = None) -> QueryResponse:
        """Full RAG Pipeline: Query -> Retrieve Context -> LLM Generation."""
        logger.info(f"Processing RAG query: '{query}'")
        sources = self.retrieve_context(query=query, top_k=top_k)
        answer = self.llm.generate_answer(query=query, context_chunks=sources)

        return QueryResponse(
            query=query,
            answer=answer,
            sources=sources,
            model_used=self.llm.model_name,
            total_sources_found=len(sources)
        )

    def get_stats(self) -> CollectionStats:
        """Returns collection storage statistics."""
        return self.vector_store.get_stats()
