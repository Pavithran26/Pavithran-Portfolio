/**
 * projectsData.js
 * In-depth portfolio project records based on real production architectures.
 */
export const PROJECTS_DATA = [
  {
    id: "clansure",
    title: "ClanSure",
    tagline: "One Family. Complete Protection.",
    category: "Full-Stack & Enterprise AI",
    badge: "Enterprise Flagship",
    accentColor: "#38bdf8",
    overview: "A centralized family insurance management platform bringing existing family policies into one secure, organized hub. Manages Health, Life, Motor, Home, and Travel insurance records with automated renewals, document vaults, claims history, nominee details, and proactive alerts.",
    challenge: "Indian families frequently miss policy renewals and struggle during claim emergencies due to scattered paper documents, lost policy numbers, and fragmented insurer portals.",
    solution: "Engineered a centralized family protection portal connecting family members with active policies, secure document vaults, nominee distribution, claims history, and automated 30-day renewal lead tracking.",
    technologies: [
      "ASP.NET Core 8",
      "C#",
      "React",
      "TypeScript",
      "Python FastAPI",
      "LangChain",
      "Google Gemini",
      "PostgreSQL (pgvector)",
      "Redis",
      "Docker",
      "GitHub Actions",
      "Railway"
    ],
    highlights: [
      "Architected backend REST APIs, JWT authentication, rate limiting, and Entity Framework Core migrations.",
      "Engineered policy coverage across 5 insurance domains: Health, Life, Motor, Home, and Travel.",
      "Developed secure document vault for policy certificates, insurance e-cards, premium receipts, and ID proofs.",
      "Implemented policy score, document expiry reminders, and renewal comparison engine.",
      "Built AI RAG policy analyzer using FastAPI + LangChain to extract coverage rules and claim clauses.",
      "Automated CI/CD workflows and containerized deployments via Docker and Railway."
    ],
    metrics: {
      policiesTracked: "5 Categories",
      renewalNotice: "30-Day Lead",
      searchLatency: "< 50ms",
      deployment: "Docker / Railway"
    },
    liveUrl: "https://family-portal.up.railway.app/dashboard",
    githubUrl: null
  },
  {
    id: "gt-companion",
    title: "GT Companion",
    tagline: "Built by the GTs, for the GTs.",
    category: "Full-Stack & Knowledge Sharing",
    badge: "Enterprise Learning Hub",
    accentColor: "#a855f7",
    overview: "A centralized learning and knowledge-sharing platform created by Graduate Trainees for Graduate Trainees. It preserves training materials, project roadmaps, practical session insights, assignments, quizzes, and organizational learning for upcoming trainee batches.",
    challenge: "Training curriculum and architectural lessons were scattered across chat channels and local drives, causing repeated onboarding overhead for every new engineer batch.",
    solution: "Designed an interactive knowledge repository featuring curated tracks, session trackers with Excel export, user role management, assignments, quizzes, and an AI tutor grounded in cohort documentation.",
    technologies: [
      "React",
      "TypeScript",
      "ASP.NET Core",
      "Python FastAPI",
      "LangChain",
      "Gemini 3.6 Flash",
      "PostgreSQL (pgvector)",
      "Redis",
      "Docker",
      "Railway"
    ],
    highlights: [
      "Built GT Dashboard with learning tracks, session roadmap, materials, assignments, and personal notes.",
      "Created Admin Overview with draft/published session management and curriculum control.",
      "Engineered Session Tracker supporting filtering, search, record editing, and one-click Excel export.",
      "Developed User Management module with directory search, role assignment, and credential tracking.",
      "Integrated LangChain RAG pipeline with Gemini 3.6 Flash and pgvector for instant knowledge retrieval from docs."
    ],
    metrics: {
      modulesPreserved: "100%",
      onboardingSpeed: "2.5x Faster",
      exportSupport: "Excel / CSV",
      activeTrainees: "Enterprise Wide"
    },
    liveUrl: "https://gt-companion.up.railway.app/",
    githubUrl: null
  },
  {
    id: "adhoc-erp",
    title: "Enterprise ERP Web Suite",
    tagline: "Centralized Operational Intelligence",
    category: "Backend & Systems Engineering",
    badge: "Adhoc Softwares",
    accentColor: "#10b981",
    overview: "A comprehensive customer-specific ERP web application replacing manual Excel-heavy operational workflows with a centralized web solution spanning 11 mission-critical modules.",
    challenge: "Leadership lacked real-time operational trend visibility, inventory reconciliation was error-prone, and variance calculations took days across disconnected spreadsheets.",
    solution: "Engineered scalable Django REST APIs with PostgreSQL transactional integrity, Redis caching, variance report engines, and mobile-friendly API endpoints.",
    technologies: [
      "Django",
      "Python",
      "PostgreSQL",
      "Redis",
      "REST APIs",
      "React",
      "Next.js",
      "Flutter",
      "Figma",
      "XML Reports"
    ],
    highlights: [
      "Covered 11 core modules: Sales, Inventory, Purchase, Finance, HR, Manufacturing, CRM, Job Card, Cart Management, Variance Reports, and Transport.",
      "Automated variance calculation, replacing manual Excel sheets with real-time operational trend monitoring.",
      "Built multi-currency cart management and executive approval workflows.",
      "Delivered high-performance mobile REST APIs with JWT authentication and role-based permissions."
    ],
    metrics: {
      workflowSpeed: "40% Boost",
      spreadsheetsReplaced: "100%",
      erpModules: "11 Modules",
      apiEndpoints: "60+ Endpoints"
    },
    liveUrl: null,
    githubUrl: null
  },
  {
    id: "3d-rag-platform",
    title: "3D Portfolio & RAG Knowledge Engine",
    tagline: "Interactive 3D WebGL & Grounded Generative AI",
    category: "AI, 3D Web & Systems",
    badge: "Production Interactive",
    accentColor: "#f59e0b",
    overview: "Hardware-accelerated Three.js WebGL systems architecture visualizer paired with an interactive Dev Terminal Console and an enterprise LangChain LCEL RAG pipeline powered by Google Gemini and pgvector.",
    challenge: "Traditional developer portfolios are static resumes that cannot demonstrate real-time 3D graphics rendering, systems architecture, or generative AI RAG grounding.",
    solution: "Created an interactive 3D WebGL exploded layer explorer, real-time developer terminal CLI, and an AI RAG assistant with zero hallucination and strict grounding.",
    technologies: [
      "Three.js",
      "WebGL",
      "FastAPI",
      "LangChain",
      "Google Gemini 1.5",
      "PostgreSQL (pgvector)",
      "Vite",
      "Docker"
    ],
    highlights: [
      "Built 6-layer 3D exploded architecture stack with raycasting hover tooltips and dynamic physics.",
      "Engineered an in-browser Dev Terminal Console supporting commands, matrix rain, and tab completion.",
      "Integrated PostgreSQL pgvector cosine similarity search (`<=>`) with HNSW vector index.",
      "Ground-truth citation system linking responses directly to verified portfolio documents."
    ],
    metrics: {
      fps: "60 FPS WebGL",
      ragGrounding: "98.4%",
      vectorDimensions: "768-dim",
      terminalCommands: "15+ Commands"
    },
    liveUrl: "https://pavis.vercel.app/",
    githubUrl: null
  }
];
