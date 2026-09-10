import pytest
from app.core.config import Settings
from app.services.embeddings import MockEmbeddingProvider
from app.services.vector_store import InMemoryVectorStore
from app.services.llm import MockLLMProvider
from app.services.rag_service import RAGService


def test_mock_embeddings_similarity():
    provider = MockEmbeddingProvider(dim=64)
    emb1 = provider.embed_query("machine learning with python")
    emb2 = provider.embed_query("python programming for artificial intelligence")
    emb3 = provider.embed_query("cooking pasta with tomato sauce")

    assert len(emb1) == 64
    assert len(emb2) == 64
    assert len(emb3) == 64


def test_rag_service_full_flow():
    settings = Settings(
        CHUNK_SIZE=200,
        CHUNK_OVERLAP=20,
    )
    vector_store = InMemoryVectorStore(name="test_collection")
    embeddings = MockEmbeddingProvider(dim=64)
    llm = MockLLMProvider()

    service = RAGService(
        settings=settings,
        embeddings=embeddings,
        vector_store=vector_store,
        llm=llm
    )

    # 1. Ingest text
    sample_text = (
        "FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ "
        "based on standard Python type hints. The key features are fast to code, high performance, "
        "and robust production readiness."
    )
    ingest_res = service.ingest_text(
        text=sample_text,
        title="FastAPI Overview",
        metadata={"author": "FastAPI Team"}
    )
    assert ingest_res.chunks_indexed > 0

    # 2. Check stats
    stats = service.get_stats()
    assert stats.total_chunks >= 1

    # 3. Retrieve context
    sources = service.retrieve_context("What are the key features of FastAPI?", top_k=2)
    assert len(sources) > 0
    assert any("features" in s.content.lower() or "fastapi" in s.content.lower() for s in sources)

    # 4. Answer query
    rag_response = service.answer_query("Tell me about FastAPI performance", top_k=2)
    assert rag_response.query == "Tell me about FastAPI performance"
    assert len(rag_response.sources) > 0
    assert len(rag_response.answer) > 0
