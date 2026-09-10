import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.models.schemas import DocumentChunk
from app.core.logger import logger


class DocumentProcessor:
    """Handles text chunking, normalization, and document metadata extraction."""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        """
        Recursively splits text into chunks respecting semantic boundaries:
        paragraphs -> lines -> sentences -> words.
        """
        # Normalize carriage returns and excessive whitespace
        text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
        if not text:
            return []

        if len(text) <= self.chunk_size:
            return [text]

        separators = ["\n\n", "\n", ". ", " ", ""]
        return self._recursive_split(text, separators)

    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        final_chunks: List[str] = []
        separator = separators[-1]
        new_separators = []

        for i, s in enumerate(separators):
            if s == "":
                separator = s
                break
            if s in text:
                separator = s
                new_separators = separators[i + 1:]
                break

        splits = text.split(separator) if separator else list(text)
        good_splits: List[str] = []

        for s in splits:
            if separator and s:
                good_splits.append(s)
            elif not separator:
                good_splits.append(s)

        current_chunk = ""
        for piece in good_splits:
            candidate = (current_chunk + separator + piece).strip() if current_chunk else piece.strip()
            if len(candidate) <= self.chunk_size:
                current_chunk = candidate
            else:
                if current_chunk:
                    final_chunks.append(current_chunk)
                    # Handle overlap if possible
                    if self.chunk_overlap > 0 and len(current_chunk) > self.chunk_overlap:
                        overlap_part = current_chunk[-self.chunk_overlap:].strip()
                        current_chunk = overlap_part + " " + piece if overlap_part else piece
                    else:
                        current_chunk = piece
                else:
                    # Single piece is larger than chunk_size, split further down hierarchy
                    if new_separators:
                        sub_chunks = self._recursive_split(piece, new_separators)
                        final_chunks.extend(sub_chunks)
                    else:
                        final_chunks.append(piece)
                    current_chunk = ""

        if current_chunk:
            final_chunks.append(current_chunk)

        return [c.strip() for c in final_chunks if c.strip()]

    def process_document(
        self,
        content: str,
        title: str = "Untitled",
        metadata: Dict[str, Any] = None,
        doc_id: str = None
    ) -> List[DocumentChunk]:
        """Splits document content and wraps into structured DocumentChunk models."""
        doc_id = doc_id or str(uuid.uuid4())
        metadata = metadata or {}
        raw_chunks = self.split_text(content)
        total_chunks = len(raw_chunks)
        now_iso = datetime.now(timezone.utc).isoformat()

        chunks: List[DocumentChunk] = []
        for idx, chunk_text in enumerate(raw_chunks):
            chunk_metadata = {
                **metadata,
                "doc_id": doc_id,
                "title": title,
                "chunk_index": idx,
                "total_chunks": total_chunks,
                "created_at": now_iso,
            }
            chunk_id = f"{doc_id}_{idx}"
            chunks.append(
                DocumentChunk(
                    chunk_id=chunk_id,
                    content=chunk_text,
                    metadata=chunk_metadata,
                )
            )

        logger.info(f"Processed document '{title}' ({doc_id}) into {len(chunks)} chunks.")
        return chunks
