from fastapi import APIRouter
from app.api.v1.endpoints import health, documents, rag

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(documents.router)
api_router.include_router(rag.router)
