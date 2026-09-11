// Existing portfolio projects plus README and SRK source-reviewed additions.
export const PROJECTS_DATA = [
  {
    "id": "clansure",
    "title": "ClanSure",
    "tagline": "One Family. Complete Protection.",
    "category": "Full-Stack & Enterprise AI",
    "badge": "Enterprise Flagship",
    "accentColor": "#38bdf8",
    "overview": "A centralized family insurance management platform bringing existing family policies into one secure, organized hub. Manages Health, Life, Motor, Home, and Travel insurance records with automated renewals, document vaults, claims history, nominee details, and proactive alerts.",
    "challenge": "Indian families frequently miss policy renewals and struggle during claim emergencies due to scattered paper documents, lost policy numbers, and fragmented insurer portals.",
    "solution": "Engineered a centralized family protection portal connecting family members with active policies, secure document vaults, nominee distribution, claims history, and automated 30-day renewal lead tracking.",
    "technologies": [
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
    "highlights": [
      "Architected backend REST APIs, JWT authentication, rate limiting, and Entity Framework Core migrations.",
      "Engineered policy coverage across 5 insurance domains: Health, Life, Motor, Home, and Travel.",
      "Developed secure document vault for policy certificates, insurance e-cards, premium receipts, and ID proofs.",
      "Implemented policy score, document expiry reminders, and renewal comparison engine.",
      "Built AI RAG policy analyzer using FastAPI + LangChain to extract coverage rules and claim clauses.",
      "Automated CI/CD workflows and containerized deployments via Docker and Railway."
    ],
    "metrics": {
      "policiesTracked": "5 Categories",
      "renewalNotice": "30-Day Lead",
      "searchLatency": "< 50ms",
      "deployment": "Docker / Railway"
    },
    "liveUrl": "https://family-portal.up.railway.app/dashboard",
    "githubUrl": null
  },
  {
    "id": "gt-companion",
    "title": "GT Companion",
    "tagline": "Built by the GTs, for the GTs.",
    "category": "Full-Stack & Knowledge Sharing",
    "badge": "Enterprise Learning Hub",
    "accentColor": "#a855f7",
    "overview": "A centralized learning and knowledge-sharing platform created by Graduate Trainees for Graduate Trainees. It preserves training materials, project roadmaps, practical session insights, assignments, quizzes, and organizational learning for upcoming trainee batches.",
    "challenge": "Training curriculum and architectural lessons were scattered across chat channels and local drives, causing repeated onboarding overhead for every new engineer batch.",
    "solution": "Designed an interactive knowledge repository featuring curated tracks, session trackers with Excel export, user role management, assignments, quizzes, and an AI tutor grounded in cohort documentation.",
    "technologies": [
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
    "highlights": [
      "Built GT Dashboard with learning tracks, session roadmap, materials, assignments, and personal notes.",
      "Created Admin Overview with draft/published session management and curriculum control.",
      "Engineered Session Tracker supporting filtering, search, record editing, and one-click Excel export.",
      "Developed User Management module with directory search, role assignment, and credential tracking.",
      "Integrated LangChain RAG pipeline with Gemini 3.6 Flash and pgvector for instant knowledge retrieval from docs."
    ],
    "metrics": {
      "modulesPreserved": "100%",
      "onboardingSpeed": "2.5x Faster",
      "exportSupport": "Excel / CSV",
      "activeTrainees": "Enterprise Wide"
    },
    "liveUrl": "https://gt-companion.up.railway.app/",
    "githubUrl": null
  },
  {
    "id": "sattam-ai",
    "title": "Sattam AI",
    "tagline": "Tamil Nadu legal knowledge, across web and mobile.",
    "category": "Academic Project · AI & Mobile",
    "badge": "Postgraduate Major Project",
    "accentColor": "#c6b8f0",
    "overview": "A full-stack legal knowledge assistant focused on Tamil Nadu acts, rules, and regulations. Built as a postgraduate final-year project at N.G.P. Arts and Science College in 2026, it combines document retrieval with chat interfaces for web and mobile.",
    "challenge": "Make a collection of Tamil Nadu legal PDFs searchable through natural-language questions across web and mobile.",
    "solution": "A FastAPI and LangChain retrieval pipeline processes legal documents into ChromaDB, using sentence-transformer embeddings and Gemini or OpenAI-compatible models. Next.js and Flutter provide the interfaces, with Clerk authentication.",
    "technologies": [
      "Next.js",
      "React",
      "TypeScript",
      "Flutter",
      "Dart",
      "Python",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "Google Gemini",
      "OpenAI",
      "Tailwind CSS",
      "Clerk",
      "Cloudflare"
    ],
    "highlights": [
      "Built web and mobile interfaces with Next.js, React, Tailwind CSS, Flutter, and Dart.",
      "Implemented legal PDF ingestion and retrieval using sentence-transformer embeddings and ChromaDB.",
      "Added document upload, processing, and web-scraping support.",
      "Integrated Clerk authentication and context-aware chat.",
      "Documented a preloaded collection of more than 50 Tamil Nadu acts and rules in the project README.",
      "Supported Gemini and OpenAI-compatible models through Cloudflare AI Gateway."
    ],
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/Major-Project-SATTAM-AI-2026",
    "sourceUrl": "https://github.com/Pavithran26/Pavithran26/blob/main/README.md"
  },
  {
    "id": "srk-erp",
    "title": "SRK ERP",
    "tagline": "From coconut groves to goods receipts.",
    "category": "Business Application · Mobile ERP",
    "badge": "Coconut Business Operations",
    "accentColor": "#a6d8b9",
    "overview": "A mobile-first ERP application designed for coconut farming and trading operations. The interface brings land and lease records, employees, harvest worklogs, vehicles, storage hubs, sales, and goods received notes into one place.",
    "challenge": "Organize field work, harvest quantities, transport details, and trading records in a connected application.",
    "solution": "Built React Native and Expo screens with reusable forms and API integration, backed by Express routes that read Cloud Firestore collections and verify Firebase ID tokens.",
    "technologies": [
      "React Native",
      "TypeScript",
      "Expo",
      "Node.js",
      "Express",
      "Firebase",
      "Cloud Firestore",
      "Axios",
      "Vercel"
    ],
    "highlights": [
      "Created land and lease forms covering owners, villages, acreage, tree counts, lease dates, and amounts.",
      "Built employee and fleet screens for worker details, daily wages, vehicle capacity, and driver information.",
      "Designed harvest worklog forms with land selection, coconut and bag counts, workers, and supervisors.",
      "Created store, sales, and GRN interfaces covering locations, quantities, unit prices, transport costs, and receipt dates.",
      "Integrated Firebase email/password sign-in and bearer-token API requests, with Expo SecureStore on mobile.",
      "Implemented authenticated list APIs for seven Firestore-backed modules."
    ],
    "implementationNote": "The reviewed repository includes the app screens and authenticated read APIs. Save actions and dashboard/report endpoints are not present in the reviewed backend version.",
    "liveUrl": null,
    "githubUrl": "https://github.com/Pavithran26/SRK-ERP-app-Frontend"
  }
];
