# 🚀 Pavithran S. — 3D Interactive Portfolio & Enterprise RAG Engine

A modern full-stack portfolio and enterprise **Retrieval-Augmented Generation (RAG)** platform built with **Three.js (WebGL)**, **FastAPI**, **LangChain**, and **PostgreSQL (pgvector)** powered by **Google Gemini**.

---

## 🏗️ System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │   Frontend 3D WebGL Portfolio (Three.js + Vite)         │
       │   - 3D Exploded Slabs (Glassmorphism + Dynamic Glow)   │
       │   - Raycast Hover Tooltips & Orbit Camera Controls     │
       │   - Interactive Layer Inspection & Production Cards    │
       └──────────────────────────┬─────────────────────────────┘
                                  │ (Vite Proxy: /api)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   FastAPI REST API Gateway (Port 8000)                 │
│                   - CORS Middleware & Lifespan Indexing                │
│                   - Pydantic Validation & Swagger OpenAPI Docs         │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼ 1. Vector Search (<=>)          ▼ 2. LCEL Synthesis
   ┌───────────────────────────────┐ ┌───────────────────────────────────┐
   │ PostgreSQL + pgvector (5432)  │ │   LangChain LCEL + Google Gemini  │
   │ - HNSW Vector Indexing        │ │   - gemini-1.5-flash LLM          │
   │ - 768-dim Embeddings          │ │   - text-embedding-004            │
   └───────────────────────────────┘ └───────────────────────────────────┘
```

---

## 📁 Clean Folder Structure

```text
Portfolio/
├── app/                                # FastAPI RAG Backend
│   ├── main.py                         # Application entry point, CORS, and lifespan
│   ├── core/
│   │   ├── config.py                   # Pydantic Settings & environment variables
│   │   └── logger.py                   # Standardized logging
│   ├── models/
│   │   └── schemas.py                  # API request & response schemas
│   ├── services/
│   │   ├── document_loader.py          # Semantic text chunking (.md & .docx)
│   │   ├── embeddings.py               # Vector embeddings provider
│   │   ├── vector_store.py             # PostgreSQL pgvector manager & HNSW index
│   │   ├── llm.py                      # Google Gemini chat client
│   │   ├── langchain_rag.py            # LangChain LCEL RAG pipeline
│   │   └── rag_service.py              # Unified RAG coordinator
│   └── api/
│       ├── deps.py                     # Dependency injection
│       └── v1/
│           ├── router.py               # Master router
│           └── endpoints/
│               ├── health.py           # GET  /api/v1/health
│               ├── documents.py        # POST /api/v1/documents/ingest-text, upload
│               └── rag.py              # POST /api/v1/rag/query, retrieve
├── frontend/                           # 3D Interactive WebGL Client
│   ├── public/
│   │   └── favicon.svg                 # Brand vector icon
│   ├── src/
│   │   ├── components/                 # Modular UI & 3D Components
│   │   │   ├── Navbar.js               # Sticky navigation & RAG trigger
│   │   │   ├── HeroSection.js          # Hero metrics & dynamic headline
│   │   │   ├── ThreeStackViewer.js     # Three.js WebGL 3D architecture engine
│   │   │   ├── LayerDetailsModal.js    # Architectural inspection drawer
│   │   │   ├── ProjectsSection.js      # ClanSure, GT Companion, Adhoc ERP cards
│   │   │   ├── SkillsSection.js        # Categorized skills matrix
│   │   │   ├── ExperienceSection.js    # Work experience & education timeline
│   │   │   ├── RAGChatModal.js         # Interactive AI assistant modal
│   │   │   └── Footer.js               # Verified social & developer links
│   │   ├── data/                       # Ground-truth profile & architecture data
│   │   │   ├── portfolioData.js        # Identity, stats, experience, education
│   │   │   ├── projectsData.js         # In-depth production project records
│   │   │   ├── skillsData.js           # Categorized programming skills
│   │   │   └── techStackLayers.js      # 3D WebGL layer specifications & colors
│   │   ├── services/
│   │   │   └── ragService.js           # Client HTTP service for /api/v1/rag/query
│   │   ├── styles/                     # Clean Modular CSS Architecture
│   │   │   ├── variables.css           # Design tokens, palette, and fonts
│   │   │   ├── base.css                # Resets, typography, cyber matrix grid
│   │   │   ├── 3d-scene.css            # Three.js viewport & HUD controls
│   │   │   ├── components.css          # Navbar, modal sheets, pills, code boxes
│   │   │   ├── sections.css            # Hero, projects, skills, timeline layouts
│   │   │   └── responsive.css          # Mobile & tablet layout optimizations
│   │   ├── utils/
│   │   │   └── helpers.js              # Formatting, escaping, math helpers
│   │   ├── main.js                     # Client orchestrator & bootstrap
│   │   └── style.css                   # Master stylesheet importing modular files
│   ├── index.html                      # Semantic HTML5 shell
│   ├── package.json                    # Three.js, Canvas-Confetti, Vite
│   └── vite.config.js                  # Proxy /api -> http://127.0.0.1:8000
├── scripts/
│   └── ingest_knowledge_base.py        # Ingestion script for .md & .docx files
├── tests/                              # Automated Pytest suite (9/9 passing)
├── .env.example                        # Template environment variables
├── requirements.txt                    # Python dependencies
└── README.md
```

---

## ⚡ Quick Start

### 1. Start the FastAPI Backend
```powershell
# Activate virtual environment
.\.venv\Scripts\activate

# Launch backend
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Endpoint: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 2. Start the 3D Frontend Client
```powershell
cd frontend
npm install
npm run dev
```
- Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

---

## 🧪 Testing
```powershell
pytest tests/ -v
```
All 9 unit and integration tests pass cleanly with test isolation and vector store validation.
