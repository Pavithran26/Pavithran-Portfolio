from functools import lru_cache
from typing import Any
from app.core.config import get_settings, Settings
from app.core.logger import logger


@lru_cache()
def get_rag_service() -> Any:
    """Dependency provider for shared RAG service (LangChain or Native)."""
    settings = get_settings()
    engine = getattr(settings, "RAG_ENGINE", "langchain").lower()

    if engine == "langchain":
        try:
            from app.services.langchain_rag import LangChainRAGService
            logger.info("Injecting LangChainRAGService dependency.")
            return LangChainRAGService(settings=settings)
        except Exception as e:
            logger.warning(f"Failed to load LangChainRAGService: {e}. Falling back to native RAGService.")

    from app.services.rag_service import RAGService
    logger.info("Injecting native RAGService dependency.")
    return RAGService(settings=settings)
