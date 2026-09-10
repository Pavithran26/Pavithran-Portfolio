from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_rag_service
from app.services.rag_service import RAGService
from app.models.schemas import QueryRequest, QueryResponse, SourceChunk
from app.core.logger import logger

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/query", response_model=QueryResponse)
async def query_rag_pipeline(
    payload: QueryRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Full RAG Pipeline Endpoint:
    1. Embeds the user query.
    2. Retrieves top-k matching context chunks from ChromaDB.
    3. Synthesizes an augmented answer using the configured LLM (Gemini/OpenAI/Mock).
    4. Returns grounded answer alongside citation sources.
    """
    try:
        response = rag_service.answer_query(
            query=payload.query,
            top_k=payload.top_k
        )
        return response
    except Exception as e:
        logger.error(f"RAG query execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing RAG query: {str(e)}"
        )


@router.post("/retrieve", response_model=List[SourceChunk])
async def retrieve_context_only(
    payload: QueryRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Retrieves and ranks relevant context chunks from the vector database
    WITHOUT invoking the LLM generation step (useful for inspectability and debug).
    """
    try:
        chunks = rag_service.retrieve_context(
            query=payload.query,
            top_k=payload.top_k
        )
        return chunks
    except Exception as e:
        logger.error(f"Context retrieval failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving context chunks: {str(e)}"
        )
