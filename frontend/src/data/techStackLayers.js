/**
 * techStackLayers.js
 * Visual and architectural configuration for the 3D WebGL exploded view.
 */
export const TECH_STACK_LAYERS = [
  {
    id: "layer-client",
    index: 0,
    number: "01",
    title: "Client & UI Experience Layer",
    subtitle: "Reactive Interfaces & 3D Interactive WebGL",
    badge: "Frontend",
    colorHex: 0x10b981,
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    technologies: ["React 18", "TypeScript", "Three.js", "Vite", "Tailwind CSS", "shadcn/ui", "Next.js"],
    metrics: {
      lighthouse: "99+",
      fcp: "0.4s",
      bundleSize: "< 45kb gzip"
    },
    description: "High-performance, component-driven client architecture designed for sub-second page loads, responsive layouts, and seamless 3D micro-interactions.",
    projects: [
      {
        name: "ClanSure UI",
        role: "Frontend Architect & Engineer",
        details: "Built intuitive family policy tracking dashboards with reactive analytics and policy renewal status."
      },
      {
        name: "GT Companion Learning Portal",
        role: "UI & Component Engineering",
        details: "Engineered trainee roadmaps, interactive note-taking cards, and session tracker dashboards."
      }
    ],
    codeSnippet: `// Modern Reactive Client Layer
import { useState, useTransition } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function ExperienceCard({ title, metrics }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="glass-panel p-6 rounded-2xl hover:glow">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Sparkles className="text-emerald-400" /> {title}
      </h3>
      <p className="text-sm text-slate-400">Score: {metrics.lighthouse}</p>
    </div>
  );
}`
  },
  {
    id: "layer-api",
    index: 1,
    number: "02",
    title: "API Gateway & Business Logic",
    subtitle: "High-Throughput Asynchronous Services",
    badge: "Backend",
    colorHex: 0x34d399,
    accentColor: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.4)",
    technologies: ["FastAPI", "ASP.NET Core 8", "C#", "Python", "JWT Auth", "Pydantic v2", "Swagger UI"],
    metrics: {
      rps: "12,000+",
      latency: "14ms avg",
      uptime: "99.98%"
    },
    description: "Type-safe, asynchronous RESTful APIs engineered for zero-allocation performance, structured validation, and token-based enterprise authentication.",
    projects: [
      {
        name: "ClanSure Web API",
        role: "ASP.NET Core & C# API Developer",
        details: "Built JWT authentication, role-based claims verification, rate limiting, and policy CRUD services."
      },
      {
        name: "Customer ERP Web Service (Adhoc)",
        role: "Django & REST API Engineer",
        details: "Implemented multi-tenant sales, inventory, cart management, and automated report generation APIs."
      }
    ],
    codeSnippet: `// High-Performance FastAPI Gateway
from fastapi import FastAPI, Depends, status
from app.models.schemas import QueryRequest, QueryResponse
from app.api.deps import get_rag_service

app = FastAPI(title="Pavithran Enterprise RAG Gateway")

@app.post("/api/v1/rag/query", response_model=QueryResponse)
async def query_pipeline(req: QueryRequest, service = Depends(get_rag_service)):
    return await service.aanswer_query(req.query)`
  },
  {
    id: "layer-ai",
    index: 2,
    number: "03",
    title: "AI Engine & RAG Orchestrator",
    subtitle: "Augmented Retrieval & Grounded Generation",
    badge: "GenAI & RAG",
    colorHex: 0x00ff88,
    accentColor: "#00ff88",
    glowColor: "rgba(0, 255, 136, 0.4)",
    technologies: ["LangChain LCEL", "Google Gemini 1.5 Flash", "OpenAI GPT-4o", "Prompt Engineering", "RAG Pipeline"],
    metrics: {
      hallucinationRate: "< 0.5%",
      groundingScore: "98.4%",
      llmModel: "Gemini 1.5 Flash"
    },
    description: "Multi-stage retrieval augmented generation pipeline that indexes enterprise knowledge, ranks semantic chunks, and generates grounded synthesis with cited citations.",
    projects: [
      {
        name: "Enterprise RAG Intelligence System",
        role: "AI & RAG Engineer",
        details: "Built LangChain LCEL RAG pipeline with Google Gemini and PostgreSQL pgvector indexing knowledge documents."
      },
      {
        name: "GT Companion Knowledge AI Assistant",
        role: "RAG & LLM Integration",
        details: "Created intelligent trainee question-answering assistant grounded strictly in training curriculums."
      }
    ],
    codeSnippet: `// LangChain LCEL Grounded Chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI

prompt = ChatPromptTemplate.from_template("""
Context:\\n{context}\\n\\nQuestion: {question}\\nGround your answer strictly in context.
""")
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | ChatGoogleGenerativeAI(model="gemini-1.5-flash")
)`
  },
  {
    id: "layer-vector",
    index: 3,
    number: "04",
    title: "High-Dimensional Vector DB",
    subtitle: "PostgreSQL with pgvector Extension",
    badge: "Vector Store",
    colorHex: 0x059669,
    accentColor: "#059669",
    glowColor: "rgba(5, 150, 105, 0.4)",
    technologies: ["PostgreSQL", "pgvector", "HNSW Indexing", "Cosine Distance (<=>)", "768-dim Embeddings"],
    metrics: {
      embedDims: "768",
      recallAt10: "99.2%",
      hnswQps: "2,400 QPS"
    },
    description: "PostgreSQL pgvector extension configured with Hierarchical Navigable Small World (HNSW) indexing for sub-millisecond approximate nearest neighbor (ANN) vector searches.",
    projects: [
      {
        name: "Production pgvector Knowledge Engine",
        role: "Database & Vector Specialist",
        details: "Engineered pure PostgreSQL pgvector schema with HNSW index and vector embedding distance operators."
      }
    ],
    codeSnippet: `// PostgreSQL HNSW Vector Search
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS langchain_pg_embedding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_hnsw_cosine 
ON langchain_pg_embedding USING hnsw (embedding vector_cosine_ops);`
  },
  {
    id: "layer-db",
    index: 4,
    number: "05",
    title: "Relational Storage & Cache Layer",
    subtitle: "ACID Transactions & High-Speed In-Memory Cache",
    badge: "Data Layer",
    colorHex: 0x6ee7b7,
    accentColor: "#6ee7b7",
    glowColor: "rgba(110, 231, 183, 0.4)",
    technologies: ["PostgreSQL 16", "Redis 7", "Entity Framework Core", "SQLAlchemy", "Connection Pooling"],
    metrics: {
      conns: "100+ Pooled",
      transpSpeed: "< 2ms",
      cacheLatency: "0.8ms"
    },
    description: "Relational persistence tier guaranteeing ACID compliance for user accounts, transactional insurance records, and low-latency Redis cache for session validation.",
    projects: [
      {
        name: "ClanSure Multi-Tenant Relational Schema",
        role: "Database Architect",
        details: "Designed normalized relational schema covering family members, policies, documents, claims, and nominees."
      },
      {
        name: "Adhoc ERP Relational Ledger",
        role: "Database Optimization",
        details: "Maintained transactional database consistency across complex inventory ledgers and automated variance reports."
      }
    ],
    codeSnippet: `// Redis Caching with PostgreSQL Fallback
import redis.asyncio as aioredis
from app.db.session import AsyncSessionLocal

redis_client = aioredis.from_url("redis://localhost:6379", decode_responses=True)

async def get_cached_policy(policy_id: str):
    cached = await redis_client.get(f"policy:{policy_id}")
    if cached:
        return cached
    async with AsyncSessionLocal() as session:
        return await fetch_policy_from_db(session, policy_id)`
  },
  {
    id: "layer-devops",
    index: 5,
    number: "06",
    title: "Cloud Infrastructure & CI/CD",
    subtitle: "Automated Deployment & Container Orchestration",
    badge: "DevOps & Cloud",
    colorHex: 0x047857,
    accentColor: "#047857",
    glowColor: "rgba(4, 120, 87, 0.4)",
    technologies: ["Docker", "GitHub Actions", "Railway", "Vercel", "Linux / Alpine", "NGINX"],
    metrics: {
      ciBuildTime: "1m 45s",
      containerSize: "82MB",
      uptime: "99.99%"
    },
    description: "Fully containerized deployment pipelines with automated linting, pytest validation, multi-stage Docker builds, and continuous delivery to cloud platforms.",
    metrics: {
      ciBuildTime: "1m 45s",
      containerSize: "82MB",
      uptime: "99.99%"
    },
    description: "Fully containerized deployment pipelines with automated linting, pytest validation, multi-stage Docker builds, and continuous delivery to cloud platforms.",
    projects: [
      {
        name: "Enterprise CI/CD Pipelines",
        role: "DevOps & Cloud Deployment",
        details: "Configured automated GitHub Actions workflows, multi-stage Docker containers, and live deployment on Railway & Vercel."
      }
    ],
    codeSnippet: `# Automated GitHub Actions CI Pipeline
name: Deploy Full-Stack Pipeline
on: [push]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Pytest Suite
        run: pytest tests/ --maxfail=1
      - name: Build & Deploy Container
        run: docker build -t pavis/rag-backend:latest .`
  }
];
