export const TECH_STACK_LAYERS = [
  {
    id: "layer-client",
    index: 0,
    number: "01",
    title: "Client & Experience Layer",
    subtitle: "Modern Reactive UI & Micro-interactions",
    badge: "Frontend",
    accentColor: "#38bdf8", // Sky blue
    glowColor: "rgba(56, 189, 248, 0.4)",
    icon: "monitor",
    technologies: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Lucide React", "Next.js"],
    metrics: {
      lighthouse: "99+",
      fcp: "0.4s",
      bundleSize: "< 45kb gzip"
    },
    description: "High-performance, component-driven client architecture designed for sub-second page loads, responsive layouts, and seamless user experiences.",
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
        <Sparkles className="text-cyan-400" /> {title}
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
    accentColor: "#a855f7", // Purple
    glowColor: "rgba(168, 85, 247, 0.4)",
    icon: "server",
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
    accentColor: "#10b981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.4)",
    icon: "sparkles",
    technologies: ["LangChain LCEL", "Google Gemini 1.5 Flash", "OpenAI GPT-4o", "Prompt Engineering", "RAG Pipeline"],
    metrics: {
      hallucinationRate: "< 0.5%",
      groundingScore: "98.4%",
      ragLatency: "480ms"
    },
    description: "Enterprise Retrieval-Augmented Generation pipeline leveraging LangChain Expression Language (LCEL) and Gemini models with strict persona and confidentiality guardrails.",
    projects: [
      {
        name: "Portfolio RAG Assistant",
        role: "RAG Pipeline Architect",
        details: "Indexes Pavithran's full experience, verified hackathons, skills, and projects with zero hallucinations."
      },
      {
        name: "GT Companion Knowledge Bot",
        role: "AI Integration Lead",
        details: "Built generative trainee question-answering over historical cohort docs, quizzes, and code manuals."
      }
    ],
    codeSnippet: `// LangChain LCEL RAG Chain Definition
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt_template
    | chat_gemini_model
    | StrOutputParser()
)`
  },
  {
    id: "layer-vector",
    index: 3,
    number: "04",
    title: "Vector Search & Embeddings",
    subtitle: "High-Dimensional Cosine Similarity Engine",
    badge: "Vector DB",
    accentColor: "#f59e0b", // Amber
    glowColor: "rgba(245, 158, 11, 0.4)",
    icon: "database",
    technologies: ["PostgreSQL (pgvector)", "HNSW Index", "Cosine Distance (<=>)", "text-embedding-004", "Chunking"],
    metrics: {
      dimensions: "768 / 1536",
      annRecall: "99.1%",
      searchLatency: "8ms"
    },
    description: "Sub-10ms semantic similarity search powered by PostgreSQL's native vector extension and HNSW indexing for instant, relevant context retrieval.",
    projects: [
      {
        name: "Enterprise pgvector Deployment",
        role: "Vector Architecture",
        details: "Designed custom schema with JSONB metadata and dynamic vector indexing for hybrid relational + semantic queries."
      }
    ],
    codeSnippet: `-- Native PostgreSQL pgvector Query
CREATE EXTENSION IF NOT EXISTS vector;

SELECT content, metadata, 
       (embedding <=> $1::vector) AS distance
FROM rag_embeddings
WHERE doc_id = $2
ORDER BY embedding <=> $1::vector ASC
LIMIT 4;`
  },
  {
    id: "layer-database",
    index: 4,
    number: "05",
    title: "Relational Persistence & Cache",
    subtitle: "ACID Transactions & In-Memory Speed",
    badge: "Storage",
    accentColor: "#06b6d4", // Cyan
    glowColor: "rgba(6, 182, 212, 0.4)",
    icon: "layers",
    technologies: ["PostgreSQL", "Redis Cache", "Entity Framework Core", "SQLAlchemy", "Database Migrations"],
    metrics: {
      cacheHitRatio: "94.2%",
      p99Query: "6ms",
      dataIntegrity: "100% ACID"
    },
    description: "Robust dual-tier storage combining PostgreSQL relational durability with ultra-low latency Redis caching for session state and rate limits.",
    projects: [
      {
        name: "ClanSure Core Database",
        role: "Database Modeling & EF Core",
        details: "Designed schema for family policy hierarchy, claim audit logs, automated renewal triggers, and Redis caching."
      }
    ],
    codeSnippet: `// Entity Framework Core Dual Cache Pattern
public async Task<PolicyDetailsDto> GetPolicyAsync(Guid id)
{
    var cached = await _redis.GetStringAsync($"policy:{id}");
    if (cached != null) return JsonSerializer.Deserialize<PolicyDetailsDto>(cached);

    var policy = await _dbContext.Policies.Include(p => p.Claims).FirstOrDefaultAsync(p => p.Id == id);
    await _redis.SetStringAsync($"policy:{id}", JsonSerializer.Serialize(policy), TimeSpan.FromMinutes(10));
    return policy;
}`
  },
  {
    id: "layer-infra",
    index: 5,
    number: "06",
    title: "Cloud Infrastructure & DevOps",
    subtitle: "Automated CI/CD & Container Orchestration",
    badge: "DevOps & Cloud",
    accentColor: "#ec4899", // Pink
    glowColor: "rgba(236, 72, 153, 0.4)",
    icon: "cloud",
    technologies: ["Docker", "GitHub Actions", "Railway", "Vercel", "Linux", "Environment Orchestration"],
    metrics: {
      buildTime: "1m 12s",
      deployCadence: "Zero-Downtime",
      containerSize: "82MB alpine"
    },
    description: "End-to-end continuous integration and deployment pipelines automating test suites, multi-stage Docker container builds, and cloud deployments.",
    projects: [
      {
        name: "Railway Full-Stack Deployment",
        role: "DevOps & Deployment Lead",
        details: "Configured multi-service architecture on Railway with persistent PostgreSQL volume, Redis container, and FastAPI worker."
      },
      {
        name: "GitHub Actions CI/CD",
        role: "Automation Pipeline Engineer",
        details: "Automated linting, security vulnerability scans, pytest runs, and automated deployment triggers on git push."
      }
    ],
    codeSnippet: `# Multi-Stage Dockerfile for FastAPI RAG
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
  }
];
