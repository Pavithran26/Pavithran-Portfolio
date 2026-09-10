from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import Optional
import json
from app.api.deps import get_rag_service
from app.services.rag_service import RAGService
from app.models.schemas import IngestTextRequest, IngestResponse, CollectionStats
from app.core.logger import logger

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/ingest-text", response_model=IngestResponse, status_code=status.HTTP_201_CREATED)
async def ingest_raw_text(
    payload: IngestTextRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Ingests, chunks, computes vector embeddings, and stores raw text into the vector database.
    """
    try:
        response = rag_service.ingest_text(
            text=payload.text,
            title=payload.title,
            metadata=payload.metadata
        )
        return response
    except Exception as e:
        logger.error(f"Error during text ingestion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest document: {str(e)}"
        )


@router.post("/upload", response_model=IngestResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(..., description="Document file to upload (.txt, .md, etc.)"),
    title: Optional[str] = Form(None, description="Optional custom document title"),
    metadata_json: Optional[str] = Form(None, description="Optional JSON string for metadata"),
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Uploads a text or markdown document, extracts its content, chunks it, and indexes it into the vector store.
    """
    try:
        content_bytes = await file.read()
        try:
            content = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            content = content_bytes.decode("latin-1")

        doc_title = title or file.filename or "Uploaded Document"
        meta = {}
        if metadata_json:
            try:
                meta = json.loads(metadata_json)
            except Exception:
                meta = {"raw_metadata": metadata_json}

        meta["filename"] = file.filename
        meta["content_type"] = file.content_type

        response = rag_service.ingest_text(
            text=content,
            title=doc_title,
            metadata=meta
        )
        return response
    except Exception as e:
        logger.error(f"Error during file upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process and index uploaded file: {str(e)}"
        )


@router.get("/stats", response_model=CollectionStats)
async def get_collection_statistics(rag_service: RAGService = Depends(get_rag_service)):
    """Returns total chunks stored and collection configuration."""
    return rag_service.get_stats()


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, rag_service: RAGService = Depends(get_rag_service)):
    """Deletes all chunks associated with the specified document ID."""
    deleted = rag_service.vector_store.delete_by_doc_id(doc_id)
    return {"message": f"Successfully deleted chunks for document '{doc_id}'", "status": "ok"}
