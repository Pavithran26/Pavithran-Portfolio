/**
 * skillsData.js
 * Comprehensive categorised skills directly from Pavithran S.'s background.
 * Augmented with proficiency metrics, domain descriptions, and production tags.
 */

export const PRODUCTION_CORE_STACK = [
  { name: "Python", icon: "🐍", role: "FastAPI / LangChain Core", domain: "AI & Backend" },
  { name: "C# / .NET 8", icon: "🔷", role: "ASP.NET Core Web API", domain: "Enterprise Backend" },
  { name: "React 18 & TS", icon: "⚛️", role: "ClanSure & GT Companion UI", domain: "Frontend" },
  { name: "LangChain", icon: "🦜", role: "LCEL RAG Pipelines", domain: "GenAI" },
  { name: "PostgreSQL pgvector", icon: "📐", role: "Vector DB & Relational Data", domain: "Database" },
  { name: "Docker", icon: "🐳", role: "Containerization & Microservices", domain: "DevOps" },
  { name: "GitHub Actions", icon: "🤖", role: "CI/CD Deployment Pipelines", domain: "Automation" },
  { name: "Railway", icon: "🚀", role: "Production Cloud Hosting", domain: "Cloud" }
];

export const SKILLS_CATEGORIES = [
  {
    id: "languages",
    name: "Programming Languages",
    shortName: "Languages",
    icon: "code",
    emoji: "💻",
    accent: "var(--primary-green)",
    description: "Multi-paradigm languages for enterprise APIs, data pipelines, systems programming, and full-stack web.",
    skills: [
      { name: "Python", level: "Advanced", percentage: 95, bars: 4, icon: "🐍", tag: "Primary API / AI", isCore: true },
      { name: "C# (.NET)", level: "Advanced", percentage: 92, bars: 4, icon: "🔷", tag: "Enterprise Core", isCore: true },
      { name: "TypeScript", level: "Advanced", percentage: 90, bars: 4, icon: "📘", tag: "Type-Safe UI", isCore: true },
      { name: "JavaScript (ES6+)", level: "Advanced", percentage: 92, bars: 4, icon: "⚡", tag: "Web & Node", isCore: true },
      { name: "Java", level: "Proficient", percentage: 80, bars: 3, icon: "☕", tag: "OOP & Services", isCore: false },
      { name: "C / C++", level: "Proficient", percentage: 78, bars: 3, icon: "⚙️", tag: "Algorithms & Low-Level", isCore: false },
      { name: "Kotlin", level: "Familiar", percentage: 68, bars: 2, icon: "📱", tag: "Android / Modern JVM", isCore: false },
      { name: "R", level: "Academic", percentage: 65, bars: 2, icon: "📊", tag: "Data Analysis / Stats", isCore: false }
    ]
  },
  {
    id: "backend",
    name: "Backend & Enterprise APIs",
    shortName: "Backend & APIs",
    icon: "server",
    emoji: "⚙️",
    accent: "var(--green-neon)",
    description: "High-throughput asynchronous REST services, enterprise microservices, secure authentication, and ORMs.",
    skills: [
      { name: "FastAPI", level: "Advanced", percentage: 95, bars: 4, icon: "🚀", tag: "Async Microservices", isCore: true },
      { name: "ASP.NET Core 8", level: "Advanced", percentage: 94, bars: 4, icon: "🛡️", tag: "ClanSure & GT APIs", isCore: true },
      { name: "Django & DRF", level: "Advanced", percentage: 90, bars: 4, icon: "🌐", tag: "Adhoc ERP Systems", isCore: true },
      { name: "Node.js & Express", level: "Proficient", percentage: 82, bars: 3, icon: "🟢", tag: "API Gateways", isCore: false },
      { name: "Flask", level: "Proficient", percentage: 80, bars: 3, icon: "🧪", tag: "Lightweight Services", isCore: false },
      { name: "Spring Boot", level: "Familiar", percentage: 68, bars: 2, icon: "🍃", tag: "Java Enterprise", isCore: false },
      { name: "Entity Framework Core", level: "Advanced", percentage: 92, bars: 4, icon: "📦", tag: "Migrations & LINQ", isCore: true },
      { name: "JWT Auth & RBAC", level: "Advanced", percentage: 92, bars: 4, icon: "🔑", tag: "Security & Rate Limiting", isCore: true }
    ]
  },
  {
    id: "ai_rag",
    name: "AI, RAG & Vector Systems",
    shortName: "AI & RAG",
    icon: "sparkles",
    emoji: "🧠",
    accent: "var(--green-mint)",
    description: "Generative AI orchestration, contextual retrieval-augmented generation, embeddings, and vector similarity search.",
    skills: [
      { name: "LangChain (LCEL)", level: "Advanced", percentage: 94, bars: 4, icon: "🦜", tag: "RAG Pipelines", isCore: true },
      { name: "PostgreSQL pgvector", level: "Advanced", percentage: 95, bars: 4, icon: "📐", tag: "Semantic Embeddings", isCore: true },
      { name: "Google Gemini 1.5/2.0", level: "Advanced", percentage: 92, bars: 4, icon: "✨", tag: "LLM Reasoning", isCore: true },
      { name: "OpenAI GPT-4o", level: "Advanced", percentage: 90, bars: 4, icon: "🧠", tag: "Multimodal AI", isCore: true },
      { name: "Vector Embeddings & HNSW", level: "Advanced", percentage: 92, bars: 4, icon: "🌌", tag: "High-Dim Vector Search", isCore: true },
      { name: "Prompt Engineering", level: "Advanced", percentage: 92, bars: 4, icon: "🎯", tag: "Grounding & Safety", isCore: true },
      { name: "Hugging Face Transformers", level: "Proficient", percentage: 82, bars: 3, icon: "🤗", tag: "Open Source Models", isCore: false },
      { name: "PyTorch & TensorFlow", level: "Proficient", percentage: 78, bars: 3, icon: "🔥", tag: "Deep Learning", isCore: false },
      { name: "scikit-learn & Pandas", level: "Advanced", percentage: 88, bars: 4, icon: "📈", tag: "Data Wrangling & ML", isCore: true }
    ]
  },
  {
    id: "frontend",
    name: "Frontend & 3D Interactive",
    shortName: "Frontend & 3D",
    icon: "monitor",
    emoji: "🎨",
    accent: "var(--green-light)",
    description: "Modern component-driven web user experiences, 3D WebGL scenes, interactive design systems, and mobile apps.",
    skills: [
      { name: "React 18", level: "Advanced", percentage: 92, bars: 4, icon: "⚛️", tag: "Enterprise SPAs", isCore: true },
      { name: "Three.js & WebGL", level: "Advanced", percentage: 88, bars: 4, icon: "🧊", tag: "3D Architecture Scenes", isCore: true },
      { name: "Next.js 14", level: "Proficient", percentage: 82, bars: 3, icon: "▲", tag: "SSR & Hybrid Apps", isCore: false },
      { name: "Vite", level: "Advanced", percentage: 92, bars: 4, icon: "⚡", tag: "Fast Build Tooling", isCore: true },
      { name: "Tailwind CSS", level: "Advanced", percentage: 94, bars: 4, icon: "🎨", tag: "Utility-First Design", isCore: true },
      { name: "shadcn/ui & Radix", level: "Advanced", percentage: 90, bars: 4, icon: "🧩", tag: "Accessible UI Primitives", isCore: true },
      { name: "Lucide React", level: "Advanced", percentage: 92, bars: 4, icon: "✨", tag: "Modern Iconography", isCore: true },
      { name: "Flutter & Dart", level: "Proficient", percentage: 80, bars: 3, icon: "📱", tag: "Cross-Platform Mobile", isCore: false }
    ]
  },
  {
    id: "databases",
    name: "Databases & Data Storage",
    shortName: "Databases",
    icon: "database",
    emoji: "🗄️",
    accent: "var(--green-jade)",
    description: "ACID-compliant relational engines, distributed caches, document databases, and scalable object storage.",
    skills: [
      { name: "PostgreSQL", level: "Advanced", percentage: 95, bars: 4, icon: "🐘", tag: "Primary Relational DB", isCore: true },
      { name: "Redis Caching", level: "Advanced", percentage: 90, bars: 4, icon: "🔴", tag: "Session & Query Cache", isCore: true },
      { name: "MongoDB", level: "Proficient", percentage: 82, bars: 3, icon: "🍃", tag: "Document Stores", isCore: false },
      { name: "MySQL", level: "Proficient", percentage: 80, bars: 3, icon: "🐬", tag: "Relational Queries", isCore: false },
      { name: "Supabase", level: "Proficient", percentage: 82, bars: 3, icon: "⚡", tag: "Postgres BaaS & Realtime", isCore: false },
      { name: "Cloud Bucket Storage", level: "Proficient", percentage: 84, bars: 3, icon: "☁️", tag: "Documents & Assets", isCore: true }
    ]
  },
  {
    id: "devops",
    name: "DevOps & Cloud Deployment",
    shortName: "DevOps & Cloud",
    icon: "cloud",
    emoji: "🚀",
    accent: "var(--primary-green)",
    description: "Automated container pipelines, declarative deployments, environment provisioning, and automated testing.",
    skills: [
      { name: "Docker & Compose", level: "Advanced", percentage: 92, bars: 4, icon: "🐳", tag: "Containerized Stacks", isCore: true },
      { name: "GitHub Actions CI/CD", level: "Advanced", percentage: 90, bars: 4, icon: "🤖", tag: "Automated Builds & Test", isCore: true },
      { name: "Git & GitHub", level: "Advanced", percentage: 95, bars: 4, icon: "🐙", tag: "Trunk-Based / PR Flow", isCore: true },
      { name: "Railway & Vercel", level: "Advanced", percentage: 92, bars: 4, icon: "🚀", tag: "Production Hosting", isCore: true },
      { name: "Postman API Automation", level: "Advanced", percentage: 90, bars: 4, icon: "📬", tag: "E2E Contract Testing", isCore: true },
      { name: "AWS & Azure Exposure", level: "Familiar", percentage: 70, bars: 2, icon: "☁️", tag: "Cloud Infrastructure", isCore: false },
      { name: "Kubernetes (Basics)", level: "Familiar", percentage: 66, bars: 2, icon: "☸️", tag: "Orchestration Concepts", isCore: false },
      { name: "Figma UI Prototyping", level: "Proficient", percentage: 82, bars: 3, icon: "🎨", tag: "Wireframing & Specs", isCore: false }
    ]
  }
];
