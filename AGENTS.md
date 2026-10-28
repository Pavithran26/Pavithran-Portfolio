# Pavithran-Portfolio — Agent Guidelines & Architecture Rules

## 1. Project Overview & Identity
- **Owner**: Pavithran S. (Pavithran Sivanandham)
- **Role**: Forward Deployed Engineer (FDE) / Software Engineer at OWLSure (ValueMomentum business unit)
- **Primary Domain**: [https://www.pavithran26.net/](https://www.pavithran26.net/)
- **Core Experience**: 3D Interactive WebGL Portfolio & Enterprise RAG Engine (**DAWN AI**).

---

## 2. Strict Content & Profile Invariants
- **Source of Truth**: All biography, work history, education, and links MUST strictly reflect [Pavithran_S_RAG_Knowledge_Base.md](file:///c:/Users/PavithranSivanandham/Projects/Pavithran-Portfolio/Pavithran_S_RAG_Knowledge_Base.md) and [portfolioData.js](file:///c:/Users/PavithranSivanandham/Projects/Pavithran-Portfolio/frontend/src/data/portfolioData.js).
- **No Hallucinations**: NEVER fabricate awards, company names, or personal details not documented in the ground-truth files.
- **Official Production URL**: Always use `https://www.pavithran26.net/` for canonical links, sitemaps, OpenGraph metadata, and structured Schema.org JSON-LD data.

---

## 3. Frontend Architecture (`frontend/`)
- **Framework & Libraries**: Vite 8, React 19, Three.js (0.185), GSAP 3.15, Lenis smooth scrolling, Framer Motion, and Lucide icons.
- **Entry Points**:
  - `frontend/index.html` -> `frontend/src/main.js` (main interactive portfolio journey).
  - `frontend/projects.html` -> `frontend/src/projects.js` (project archive and book reader).
  - `frontend/scene.html` -> `frontend/src/scene-entry.tsx` (3D scene experiments).
- **Styling Architecture**:
  - Keep styling modular under `frontend/src/styles/` (`variables.css`, `base.css`, `cinematic.css`, `sections.css`, `universe.css`, `skeuomorphism.css`).
  - Do NOT introduce TailwindCSS unless explicitly requested.
- **Icons**:
  - All technology marks must use local SVG mappings in `frontend/src/components/TechnologyIcons.js`.
  - Do NOT load external icon CDNs or third-party web font icon kits.
- **Performance & 3D Controls**:
  - Always support reduced-motion preferences (`prefers-reduced-motion`).
  - Provide graceful 2D canvas/CSS fallbacks when WebGL context fails to initialize or is lost.
  - Halt 3D rendering loops when the tab or viewport is hidden.

---

## 4. Backend & RAG Pipeline (`backend/` & `app/`)
- **API Framework**: FastAPI with async lifespan management (`app/main.py` or `backend/main.py`).
- **Retrieval & RAG Engine**:
  - Powered by LangChain LCEL (`app/services/langchain_rag.py`).
  - Default LLM: Google Gemini (`gemini-1.5-flash`).
  - Default Embeddings: `models/text-embedding-004` (768-dim).
  - Support fallback to OpenAI (`gpt-4o-mini`) or Mock providers for offline testing.
- **Vector Storage**:
  - Production: PostgreSQL with `pgvector` extension (HNSW indexing).
  - Local/Offline: `InMemoryVectorStore` or `backend/data/vector_store.json`.
- **API Surface**:
  - `GET /api/v1/health`: Health status.
  - `POST /api/v1/rag/query`: Semantic retrieval and answer synthesis for DAWN AI.
  - `POST /api/v1/documents/ingest-text`: Dynamic text chunk ingestion.

---

## 5. Development & Testing Commands
- **Frontend**:
  ```bash
  cd frontend
  npm run dev      # Starts Vite on port 5173 with proxy to backend
  npm run build    # Production build to frontend/dist/
  ```
- **Backend**:
  ```powershell
  uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
  ```
- **Tests**:
  - Unit/Integration tests: `pytest tests/ -v`
  - Stack tests: `node --test frontend/tests/stackJourney.test.js`
