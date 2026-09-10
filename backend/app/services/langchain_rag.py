import os
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import Settings, get_settings
from app.core.logger import logger
from app.models.schemas import SourceChunk, QueryResponse, IngestResponse, CollectionStats


def format_docs(docs: List[Document]) -> str:
    """Formats retrieved LangChain documents into clean string context with source markers."""
    formatted = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", doc.metadata.get("title", "Document"))
        formatted.append(f"[Source {i} | {source}]:\n{doc.page_content}")
    return "\n\n---\n\n".join(formatted)


class LangChainRAGService:
    """
    Official LangChain LCEL (LangChain Expression Language) RAG implementation.
    Integrates RecursiveCharacterTextSplitter, VectorStores (Chroma / PGVector),
    Embeddings (Google Generative AI / OpenAI), and Chat Models with Pavithran's Portfolio persona.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.settings.CHUNK_SIZE,
            chunk_overlap=self.settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        self.embeddings = self._init_embeddings()
        self.vector_store = self._init_vector_store()
        self.llm = self._init_llm()
        self.prompt_template = self._build_prompt_template()

    def _init_embeddings(self):
        """Initializes LangChain embeddings based on provider and available API keys."""
        provider = self.settings.EMBEDDING_PROVIDER.lower()
        gemini_key = self.settings.effective_gemini_api_key

        if provider == "gemini" and gemini_key:
            try:
                from langchain_google_genai import GoogleGenerativeAIEmbeddings
                logger.info(f"Initialized LangChain GoogleGenerativeAIEmbeddings with model: {self.settings.GEMINI_EMBEDDING_MODEL}")
                return GoogleGenerativeAIEmbeddings(
                    model=self.settings.GEMINI_EMBEDDING_MODEL,
                    google_api_key=gemini_key
                )
            except Exception as e:
                logger.warning(f"Error initializing LangChain Gemini embeddings: {e}")

        if provider == "openai" and self.settings.OPENAI_API_KEY:
            try:
                from langchain_openai import OpenAIEmbeddings
                logger.info("Initialized LangChain OpenAIEmbeddings.")
                return OpenAIEmbeddings(
                    model=self.settings.OPENAI_EMBEDDING_MODEL,
                    openai_api_key=self.settings.OPENAI_API_KEY
                )
            except Exception as e:
                logger.warning(f"Error initializing LangChain OpenAI embeddings: {e}")

        # Fallback offline embedding generator
        from langchain_community.embeddings import FakeEmbeddings
        logger.warning("Using LangChain FakeEmbeddings (offline mode). Set GEMINI_API_KEY in .env for production.")
        return FakeEmbeddings(size=384)

    def _init_vector_store(self):
        """Initializes LangChain VectorStore using PostgreSQL PGVector."""
        try:
            from langchain_community.vectorstores.pgvector import PGVector
            logger.info("Initializing LangChain PGVector store...")
            store = PGVector(
                connection_string=self.settings.postgres_connection_string,
                embedding_function=self.embeddings,
                collection_name=self.settings.PGVECTOR_TABLE_NAME,
                use_jsonb=True
            )
            return store
        except Exception as e:
            logger.warning(
                f"Could not connect LangChain PGVector ({e}). "
                "Using LangChain InMemoryVectorStore fallback until PostgreSQL password is configured in .env."
            )
            from langchain_core.vectorstores import InMemoryVectorStore
            return InMemoryVectorStore(embedding=self.embeddings)

    def _init_llm(self):
        """Initializes LangChain ChatModel (ChatGoogleGenerativeAI or ChatOpenAI)."""
        provider = self.settings.LLM_PROVIDER.lower()
        gemini_key = self.settings.effective_gemini_api_key

        if provider == "gemini" and gemini_key:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                logger.info(f"Initialized LangChain ChatGoogleGenerativeAI with model: {self.settings.GEMINI_MODEL}")
                return ChatGoogleGenerativeAI(
                    model=self.settings.GEMINI_MODEL,
                    google_api_key=gemini_key,
                    temperature=0.2
                )
            except Exception as e:
                logger.warning(f"Error initializing LangChain Gemini LLM: {e}")

        if provider == "openai" and self.settings.OPENAI_API_KEY:
            try:
                from langchain_openai import ChatOpenAI
                logger.info("Initialized LangChain ChatOpenAI.")
                return ChatOpenAI(
                    model=self.settings.OPENAI_MODEL,
                    openai_api_key=self.settings.OPENAI_API_KEY,
                    temperature=0.2
                )
            except Exception as e:
                logger.warning(f"Error initializing LangChain OpenAI LLM: {e}")

        # Fallback offline fake LLM
        from langchain_community.chat_models import FakeListChatModel
        logger.warning("Using LangChain FakeListChatModel (offline mode).")
        responses = [
            "[LangChain Offline Mode]\nRetrieved matching portfolio context for Pavithran S. "
            "(Configure GEMINI_API_KEY in .env to activate generative answers)."
        ]
        return FakeListChatModel(responses=responses)

    def _build_prompt_template(self) -> ChatPromptTemplate:
        """Constructs LangChain ChatPromptTemplate with Pavithran's portfolio persona and rules."""
        system_instruction = (
            "You are the official AI Portfolio Assistant for Pavithran S., built using LangChain.\n"
            "Your goal is to answer questions about Pavithran's background, skills, experience, projects, and contact info based strictly on the retrieved context.\n\n"
            "Guidelines & Persona:\n"
            "1. Tone: Professional, confident, friendly, slightly playful, and interactive.\n"
            "2. For technical/project questions, follow: problem -> solution -> Pavithran's contribution -> technology -> outcome.\n"
            "3. Grounding: Rely strictly on the retrieved context. Do not invent unverified facts, metrics, or certifications.\n"
            "4. Confidentiality Rules:\n"
            "   - Never disclose Adhoc Softwares' customer/client name (state it is confidential and explain the ERP domain).\n"
            "   - Do not disclose private family details.\n\n"
            "Context:\n{context}"
        )
        return ChatPromptTemplate.from_messages([
            ("system", system_instruction),
            ("human", "{question}")
        ])

    def ingest_text(
        self,
        text: str,
        title: str = "Document",
        metadata: Optional[Dict[str, Any]] = None,
        doc_id: Optional[str] = None
    ) -> IngestResponse:
        """Splits text using LangChain RecursiveCharacterTextSplitter and stores in vector store."""
        import uuid
        doc_id = doc_id or str(uuid.uuid4())
        meta = metadata or {}
        meta["doc_id"] = doc_id
        meta["title"] = title

        doc = Document(page_content=text, metadata=meta)
        chunks = self.text_splitter.split_documents([doc])

        # Assign unique IDs and chunk index
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_index"] = i
            chunk.metadata["total_chunks"] = len(chunks)

        self.vector_store.add_documents(chunks)
        logger.info(f"LangChain indexed {len(chunks)} chunks for document '{title}'.")

        return IngestResponse(
            message="Document successfully chunked and indexed via LangChain",
            document_id=doc_id,
            chunks_indexed=len(chunks),
            title=title
        )

    def retrieve_context(self, query: str, top_k: int = 4) -> List[SourceChunk]:
        """Retrieves top-k matching LangChain Documents and converts to SourceChunk schemas."""
        docs = self.vector_store.similarity_search(query, k=top_k)
        sources = []
        for doc in docs:
            sources.append(
                SourceChunk(
                    content=doc.page_content,
                    metadata=doc.metadata,
                    distance=None
                )
            )
        return sources

    def answer_query(self, query: str, top_k: int = 4) -> QueryResponse:
        """Executes LCEL (LangChain Expression Language) RAG Chain."""
        retriever = self.vector_store.as_retriever(search_kwargs={"k": top_k})

        # Build LCEL chain
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | self.prompt_template
            | self.llm
            | StrOutputParser()
        )

        # Retrieve documents for citations
        docs = retriever.invoke(query)
        sources = [
            SourceChunk(
                content=d.page_content,
                metadata=d.metadata,
                distance=None
            )
            for d in docs
        ]

        # Generate answer through LCEL chain
        answer = rag_chain.invoke(query)

        model_name = getattr(self.llm, "model_name", getattr(self.llm, "model", "langchain-llm"))

        return QueryResponse(
            query=query,
            answer=str(answer).strip(),
            sources=sources,
            model_used=f"langchain:{model_name}",
            total_sources_found=len(sources)
        )

    def get_stats(self) -> CollectionStats:
        """Returns statistics for the vector store."""
        try:
            from app.services.vector_store import PGVectorStore
            pg_store = PGVectorStore(settings=self.settings)
            return pg_store.get_stats()
        except Exception:
            return CollectionStats(
                collection_name=self.settings.PGVECTOR_TABLE_NAME,
                total_chunks=0,
                persist_directory=f"postgresql://{self.settings.POSTGRES_HOST}:{self.settings.POSTGRES_PORT}/{self.settings.POSTGRES_DB}"
            )
