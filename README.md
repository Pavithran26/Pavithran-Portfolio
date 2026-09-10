# 🚀 Pavithran S. — 3D Interactive Portfolio & Enterprise RAG Engine

A modern full-stack portfolio and enterprise **Retrieval-Augmented Generation (RAG)** platform built with **Three.js (WebGL)**, **FastAPI**, **LangChain**, and **PostgreSQL (pgvector)** powered by **Google Gemini**.

## Scroll through the stack

The opening experience is a four-chapter journey inspired by the immersive feel of [The State of the Gallery](https://mesh3d.gallery/the-state-of-the-gallery) and the cinematic direction of [USAvionix](https://www.usavionix.com/). A near-black canvas, large typography, luminous wireframes, and a field of particles connect **Frontend → Backend & Logic → Databases → Applied AI**.

- Native page scrolling moves the camera through four distinct scenes: component planes, connected services, data stores, and a retrieval network. Each chapter holds still for reading before transitioning forward or backward with the scroll position.
- Every stage displays its languages, frameworks, and tools. Sixteen technology callouts open the existing searchable skill details; chapter inspection shows real project applications and code examples from the portfolio data.
- The chapter dock supports clicking and Left/Right/Home/End keys. Direct anchors (`#stack-frontend`, `#stack-backend`, `#stack-databases`, `#stack-ai`) jump into the journey. Visitors can skip directly to selected work.
- The motion control follows the system preference initially and saves an explicit choice. Motion off, short viewports, and narrow zoomed layouts display all four chapters in normal document flow.
- `StackJourney.js` handles the chapter interface and scroll position. `stackJourney.js` contains the chapter content and scroll mapping. `JourneyScene.js` loads the graphics when the section approaches; `journeyGeometry.js` supplies the shared shapes and camera model. The optional `WebGLJourneyRenderer.js` uses Three.js. Canvas 2D preserves the moving diagrams when WebGL cannot initialize or its context is lost. Rendering stops when the scene or page is hidden.
- The original four projects, full profile, experience, contact links, skill explorer, DAWN AI, and developer terminal remain available. The backtick shortcut opens the terminal outside editable fields.
- `journey.css` extends the base `cinematic.css` with the scrolling layout, chapter colors, and responsive reading mode. The earlier workstation and six-layer scene components remain in the repository but are not the entry point.
- DAWN still calls `POST /api/v1/rag/query`. Closing its dialog cancels the request; requests time out after 25 seconds. Live answers require the existing backend.

The scene geometry is original code. The existing metallic artwork supplies a faint decorative fallback. No code or brand assets from the reference sites are included. The chapter order tells a skills story; it is not a literal request flow for every project.

The frontend retains its existing Vite scripts, lockfile, and API proxy. Run `npm ci` then `npm run build` in `frontend/` for production. Run `node --test tests/stackJourney.test.js` for the chapter order, tool targets, scroll continuity, and fallback geometry checks. The backend setup and legacy component inventory below still apply.

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
