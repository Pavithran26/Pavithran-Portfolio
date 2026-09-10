import os
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

# Set UTF-8 output encoding for Windows terminals
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.core.config import get_settings
from app.core.logger import logger
from app.services.rag_service import RAGService


def extract_text_from_docx(file_path: Path) -> str:
    """Extracts text from a .docx file using standard library zipfile & xml."""
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            # Namespace for WordprocessingML
            namespaces = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
            paragraphs = []
            for p in tree.findall(".//w:p", namespaces):
                texts = [node.text for node in p.findall(".//w:t", namespaces) if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            return "\n\n".join(paragraphs)
    except Exception as e:
        logger.error(f"Error reading docx file {file_path}: {e}")
        return ""


def ingest_knowledge_files():
    settings = get_settings()
    rag_service = RAGService(settings=settings)

    print("\n" + "=" * 60)
    print(">> Ingesting Knowledge Base into DAWN AI Vector Store")
    if settings.VECTOR_STORE_TYPE.lower() == "local":
        print(f"Storage Mode: LOCAL FILE (Zero external database required)")
        print(f"Vector File:  {settings.LOCAL_VECTOR_STORE_PATH}")
    else:
        print(f"Storage Mode: POSTGRESQL pgvector ({settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB})")
    print(f"Embedding Provider: {settings.EMBEDDING_PROVIDER}")
    print("=" * 60 + "\n")

    files_to_index = [
        ROOT_DIR / "Pavithran_S_RAG_Knowledge_Base.md",
        ROOT_DIR / "Pavithran_S_RAG_Knowledge_Base.docx",
    ]

    total_chunks_indexed = 0

    for file_path in files_to_index:
        if not file_path.exists():
            logger.warning(f"File not found: {file_path}")
            continue

        file_ext = file_path.suffix.lower()
        title = file_path.stem.replace("_", " ")

        if file_ext == ".md" or file_ext == ".txt":
            content = file_path.read_text(encoding="utf-8")
        elif file_ext == ".docx":
            content = extract_text_from_docx(file_path)
        else:
            logger.warning(f"Unsupported file format: {file_ext}")
            continue

        if not content.strip():
            logger.warning(f"File {file_path.name} was empty or could not be read.")
            continue

        logger.info(f"Indexing '{file_path.name}' ({len(content)} characters)...")

        metadata = {
            "source_file": file_path.name,
            "type": file_ext.replace(".", ""),
            "author": "Pavithran S."
        }

        # Check if already indexed or index new
        res = rag_service.ingest_text(
            text=content,
            title=title,
            metadata=metadata,
            doc_id=file_path.stem
        )
        total_chunks_indexed += res.chunks_indexed
        print(f"[+] Indexed '{file_path.name}' -> {res.chunks_indexed} chunks created.")

    stats = rag_service.get_stats()
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Ingestion Complete!")
    print(f"Total chunks in vector database: {stats.total_chunks}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    ingest_knowledge_files()
