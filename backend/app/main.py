from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import get_settings
from app.core.logger import logger
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for application startup and shutdown."""
    logger.info(f"Starting {settings.APP_NAME} in [{settings.APP_ENV}] mode...")
    logger.info(f"Using Engine: {settings.RAG_ENGINE} | LLM: {settings.LLM_PROVIDER} | Embedding: {settings.EMBEDDING_PROVIDER}")
    if settings.VECTOR_STORE_TYPE.lower() == "local":
        logger.info(f"Vector Store: Local File ('{settings.LOCAL_VECTOR_STORE_PATH}') — Zero external database required")
    else:
        logger.info(f"Vector Database: PostgreSQL ({settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}) Table: {settings.PGVECTOR_TABLE_NAME}")

    # Auto-index knowledge base files if vector store is empty
    try:
        from app.api.deps import get_rag_service
        from scripts.ingest_knowledge_base import ingest_knowledge_files
        rag = get_rag_service()
        stats = rag.get_stats()
        if stats.total_chunks == 0:
            logger.info("Vector database is empty. Auto-ingesting knowledge base files...")
            ingest_knowledge_files()
        else:
            logger.info(f"Vector store already contains {stats.total_chunks} chunks.")
    except Exception as e:
        logger.warning(f"Auto-ingest skipped or encountered error: {e}")

    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")


def create_application() -> FastAPI:
    """Application factory for FastAPI."""
    app = FastAPI(
        title=settings.APP_NAME,
        description=(
            "🚀 High-performance, modular RAG (Retrieval-Augmented Generation) API "
            "built with FastAPI, LangChain, PostgreSQL (pgvector), and GenAI models."
        ),
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan
    )

    # CORS Middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routers
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/", tags=["Root"])
    async def root():
        return {
            "name": settings.APP_NAME,
            "version": "0.1.0",
            "documentation": "/docs",
            "health_check": "/api/v1/health",
            "message": "Welcome to the FastAPI RAG Engine! Visit /docs to test endpoints."
        }

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
