import pytest
from app.services.langchain_rag import LangChainRAGService
from app.core.config import Settings


def test_langchain_rag_service():
    settings = Settings(
        CHUNK_SIZE=250,
        CHUNK_OVERLAP=25,
        RAG_ENGINE="langchain"
    )

    rag = LangChainRAGService(settings=settings)

    # Ingest document using LangChain
    text = (
        "Pavithran S. is a multi-stack Software Engineer at OWLSure / ValueMomentum. "
        "He has contributed to projects like ClanSure and GT Companion using Python, FastAPI, LangChain, and pgvector."
    )
    res = rag.ingest_text(text=text, title="Pavithran Profile")
    assert res.chunks_indexed >= 1
    assert res.title == "Pavithran Profile"

    # Context retrieval
    sources = rag.retrieve_context("What projects did Pavithran work on?", top_k=2)
    assert len(sources) >= 1
    assert any("ClanSure" in s.content or "Pavithran" in s.content for s in sources)

    # Answer query
    ans = rag.answer_query("Tell me about Pavithran's stack", top_k=2)
    assert ans.query == "Tell me about Pavithran's stack"
    assert len(ans.sources) >= 1
    assert len(ans.answer) > 0
