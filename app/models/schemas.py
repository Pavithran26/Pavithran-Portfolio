from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    app_name: str
    environment: str
    version: str = "0.1.0"


class DocumentChunk(BaseModel):
    chunk_id: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class IngestTextRequest(BaseModel):
    text: str = Field(..., min_length=5, description="Raw text content to be chunked and indexed")
    title: Optional[str] = Field(None, description="Optional title or label for this document")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Custom metadata key-values")


class IngestResponse(BaseModel):
    message: str
    document_id: str
    chunks_indexed: int
    title: Optional[str] = None


class SourceChunk(BaseModel):
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    distance: Optional[float] = Field(None, description="Vector distance (lower is closer in L2/cosine)")


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="User question or search query")
    top_k: Optional[int] = Field(default=4, ge=1, le=20, description="Number of context chunks to retrieve")
    stream: Optional[bool] = Field(default=False, description="Whether to stream response tokens")


class QueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[SourceChunk] = Field(default_factory=list)
    model_used: str
    total_sources_found: int


class CollectionStats(BaseModel):
    collection_name: str
    total_chunks: int
    persist_directory: str
