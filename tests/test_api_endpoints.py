from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_rag_service
from app.services.rag_service import RAGService
from app.services.embeddings import MockEmbeddingProvider
from app.services.vector_store import InMemoryVectorStore
from app.services.llm import MockLLMProvider
from app.core.config import Settings

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "documentation" in data
    assert data["documentation"] == "/docs"


def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app_name" in data


def test_documents_ingest_and_rag_query():
    test_settings = Settings(
        CHUNK_SIZE=300,
        CHUNK_OVERLAP=30
    )
    test_rag_service = RAGService(
        settings=test_settings,
        embeddings=MockEmbeddingProvider(dim=64),
        vector_store=InMemoryVectorStore(name="api_test_col"),
        llm=MockLLMProvider()
    )
    app.dependency_overrides[get_rag_service] = lambda: test_rag_service

    try:
        # Ingest
        ingest_payload = {
            "text": "Retrieval Augmented Generation combines vector search with generative AI to answer domain-specific questions.",
            "title": "RAG Concept",
            "metadata": {"topic": "ai"}
        }
        res = client.post("/api/v1/documents/ingest-text", json=ingest_payload)
        assert res.status_code == 201
        data = res.json()
        assert data["chunks_indexed"] >= 1
        assert data["title"] == "RAG Concept"

        # Query
        query_payload = {
            "query": "How does RAG work?",
            "top_k": 2
        }
        res_query = client.post("/api/v1/rag/query", json=query_payload)
        assert res_query.status_code == 200
        query_data = res_query.json()
        assert query_data["query"] == "How does RAG work?"
        assert len(query_data["sources"]) >= 1
        assert "answer" in query_data

        # Stats
        res_stats = client.get("/api/v1/documents/stats")
        assert res_stats.status_code == 200
        assert res_stats.json()["total_chunks"] >= 1
    finally:
        app.dependency_overrides.clear()
