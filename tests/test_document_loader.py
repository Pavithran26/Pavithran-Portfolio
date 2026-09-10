from app.services.document_loader import DocumentProcessor


def test_document_processor_small_text():
    processor = DocumentProcessor(chunk_size=100, chunk_overlap=10)
    text = "FastAPI is a modern, fast web framework for Python."
    chunks = processor.split_text(text)
    assert len(chunks) == 1
    assert chunks[0] == text


def test_document_processor_chunking():
    processor = DocumentProcessor(chunk_size=50, chunk_overlap=10)
    text = (
        "Retrieval-Augmented Generation (RAG) optimizes the output of an LLM. "
        "It references an authoritative knowledge base outside of its training data sources. "
        "This allows organizations to deliver contextually relevant responses."
    )
    chunks = processor.split_text(text)
    assert len(chunks) > 1
    for chunk in chunks:
        assert len(chunk) > 0


def test_document_processor_metadata():
    processor = DocumentProcessor(chunk_size=100, chunk_overlap=10)
    text = "First paragraph.\n\nSecond paragraph."
    doc_chunks = processor.process_document(
        content=text,
        title="Test Doc",
        metadata={"category": "ai"}
    )
    assert len(doc_chunks) >= 1
    assert doc_chunks[0].metadata["title"] == "Test Doc"
    assert doc_chunks[0].metadata["category"] == "ai"
    assert "chunk_index" in doc_chunks[0].metadata
