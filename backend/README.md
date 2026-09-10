# DAWN AI — FastAPI RAG Service

High-performance, modular **RAG (Retrieval-Augmented Generation)** backend service powering **DAWN AI** for Pavithran S.'s portfolio.

Built with **FastAPI**, **LangChain (LCEL)**, **PostgreSQL (pgvector)**, and **Google Gemini / OpenAI**.

---

## 🏛️ Architecture & Tech Stack

- **Framework**: FastAPI (Async REST APIs)
- **RAG Engine**: LangChain LCEL (Retrieval-Augmented Generation Chains)
- **Vector Database**: PostgreSQL with `pgvector` extension
- **LLM Provider**: Google Gemini (`gemini-1.5-flash`) or OpenAI (`gpt-4o-mini`)
- **Embeddings**: Google `text-embedding-004` (768-dim) or OpenAI `text-embedding-3-small` (1536-dim)
- **Server**: Uvicorn ASGI

---

## 📁 Directory Structure

```text
backend/
├── main.py                          # Application entry point
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment template
├── .env                             # Local environment variables
├── Pavithran_S_RAG_Knowledge_Base.md# Source knowledge document
├── app/
│   ├── api/
│   │   ├── deps.py                  # Dependency injection (RAG service)
│   │   └── v1/
│   │       ├── router.py            # API V1 router aggregation
│   │       └── endpoints/
│   │           ├── health.py        # Health check endpoint (/api/v1/health)
│   │           └── rag.py           # RAG query, stats, & ingest endpoints
│   ├── core/
│   │   ├── config.py                # Pydantic Settings & environment validation
│   │   └── logger.py                # Structured colorized logging
│   ├── models/
│   │   └── rag.py                   # Pydantic request & response schemas
│   └── services/
│       ├── document_loader.py       # Markdown/DOCX parser & recursive chunker
│       ├── embeddings.py            # Google Gemini & OpenAI embedding adapters
│       ├── langchain_rag.py         # LCEL RAG prompt, retriever & QA chain
│       ├── llm.py                   # LLM factory (Gemini, OpenAI, Mock)
│       ├── rag_service.py           # Orchestration service layer
│       └── vector_store.py          # PostgreSQL pgvector vector store manager
└── scripts/
    └── ingest_knowledge_base.py     # CLI script to chunk & embed knowledge base
```

---

## 🚀 Getting Started

### 1. Setup Virtual Environment

```bash
cd backend
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Linux / macOS:
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and add your Gemini API key:

```ini
APP_NAME=DAWN AI RAG Service
APP_ENV=development
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Provider ("gemini" or "openai")
LLM_PROVIDER=gemini
EMBEDDING_PROVIDER=gemini
GEMINI_API_KEY=your_google_gemini_api_key_here

# PostgreSQL / pgvector settings
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
```

### 4. Ingest Knowledge Base

Index `Pavithran_S_RAG_Knowledge_Base.md` into the pgvector database:

```bash
python scripts/ingest_knowledge_base.py
```

### 5. Start the FastAPI Server

```bash
uvicorn main:app --reload --port 8000
```

The server will start on **`http://127.0.0.1:8000`**.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/` | API status & welcome payload |
| **GET** | `/docs` | Interactive Swagger UI API documentation |
| **GET** | `/api/v1/health` | Service health status & vector DB connectivity |
| **POST** | `/api/v1/rag/query` | Ask DAWN AI with semantic vector retrieval |
| **GET** | `/api/v1/rag/stats` | Vector store indexing & chunk counts |
| **POST** | `/api/v1/rag/ingest` | Trigger knowledge base re-indexing |

---

## 🔗 Frontend Integration

The frontend (Vite) proxies `/api` requests directly to `http://127.0.0.1:8000`. When this backend is running, the **DAWN AI** assistant widget in the frontend connects seamlessly in real time!
