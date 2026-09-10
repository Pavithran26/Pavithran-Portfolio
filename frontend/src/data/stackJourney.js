/** The story order describes areas of expertise, not a project's request topology. */
export const STACK_CHAPTERS = [
  {
    id: 'frontend', name: 'Frontend', number: '01', accent: '#c2f970',
    heading: ['FRONT', 'END.'], eyebrow: 'The experience layer',
    tagline: 'Where people meet the product.',
    description: 'Responsive interfaces, thoughtful interactions, and the details that make software feel right.',
    groups: [
      { label: 'Languages', items: ['TypeScript', 'JavaScript'] },
      { label: 'Interface & tooling', items: ['React', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'Vite', 'Three.js'] }
    ],
    highlights: [
      { mark: 'R', name: 'React', role: 'Component-driven interfaces', search: 'React 18' },
      { mark: 'TS', name: 'TypeScript', role: 'Types across the experience', search: 'TypeScript' },
      { mark: 'Tw', name: 'Tailwind CSS', role: 'Responsive design systems', search: 'Tailwind' },
      { mark: '3D', name: 'Three.js', role: 'Interactive visual experiences', search: 'Three.js' }
    ],
    application: 'ClanSure & GT Companion interfaces', sceneLabel: 'COMPONENTS / INTERACTION / EXPERIENCE',
    layerIndexes: [0], detail: 'Inspect frontend', next: 'Next: backend & logic'
  },
  {
    id: 'backend', name: 'Backend', number: '02', accent: '#99d8ff',
    heading: ['BACK', 'END.'], eyebrow: 'The application layer',
    tagline: 'Give every interaction its logic.',
    description: 'APIs, authentication, validation, and business rules that turn an interface into a working product.',
    groups: [
      { label: 'Languages', items: ['C#', 'Python', 'JavaScript', 'Java'] },
      { label: 'Frameworks & logic', items: ['ASP.NET Core', 'FastAPI', 'Django', 'Entity Framework Core', 'JWT & RBAC'] }
    ],
    highlights: [
      { mark: 'C#', name: 'ASP.NET Core', role: 'Business services & REST APIs', search: 'ASP.NET' },
      { mark: 'Py', name: 'FastAPI', role: 'Python services & validation', search: 'FastAPI' },
      { mark: 'Dj', name: 'Django', role: 'Enterprise application APIs', search: 'Django' },
      { mark: 'JWT', name: 'Auth & access', role: 'Identity, roles, permissions', search: 'JWT' }
    ],
    application: 'Insurance workflows & enterprise ERP', sceneLabel: 'REQUESTS / VALIDATION / BUSINESS RULES',
    layerIndexes: [1], detail: 'Inspect backend', next: 'Next: databases & storage'
  },
  {
    id: 'databases', name: 'Databases', number: '03', accent: '#7af0cb',
    heading: ['DATA', 'BASES.'], eyebrow: 'The persistence layer',
    tagline: 'Make information work harder.',
    description: 'Structured records, semantic retrieval, and caching — giving every piece of information a useful place.',
    groups: [
      { label: 'Data & storage', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cloud bucket storage'] },
      { label: 'Retrieval & tooling', items: ['pgvector', 'HNSW', 'Redis', 'Supabase'] }
    ],
    highlights: [
      { mark: 'PG', name: 'PostgreSQL', role: 'Relational data & transactions', search: 'PostgreSQL' },
      { mark: '<>', name: 'pgvector', role: 'Similarity & semantic search', search: 'pgvector' },
      { mark: 'R', name: 'Redis', role: 'Caching & quick retrieval', search: 'Redis' },
      { mark: 'S3', name: 'Object storage', role: 'Documents & application assets', search: 'Cloud Bucket' }
    ],
    application: 'Policy records, documents & knowledge stores', sceneLabel: 'RECORDS / VECTORS / PERSISTENCE',
    layerIndexes: [3, 4], detail: 'Inspect databases', next: 'Next: applied AI'
  },
  {
    id: 'ai', name: 'AI', number: '04', accent: '#dbc0ff',
    heading: ['APPLIED', 'AI.'], eyebrow: 'The intelligence layer',
    tagline: 'Turn knowledge into answers.',
    description: 'Retrieval-augmented generation brings documents, context, and language models together to help people find what matters.',
    groups: [
      { label: 'Languages & models', items: ['Python', 'Google Gemini', 'OpenAI'] },
      { label: 'Orchestration & retrieval', items: ['LangChain LCEL', 'Embeddings', 'pgvector', 'HNSW', 'Prompt engineering'] }
    ],
    highlights: [
      { mark: 'LC', name: 'LangChain', role: 'Retrieval & generation pipelines', search: 'LangChain' },
      { mark: 'G', name: 'Gemini', role: 'Language understanding', search: 'Gemini' },
      { mark: 'Vec', name: 'Embeddings', role: 'Meaning-aware retrieval', search: 'Embeddings' },
      { mark: 'RAG', name: 'RAG', role: 'Answers with source context', search: 'AI, RAG' }
    ],
    application: 'DAWN AI, policy analysis & learning assistants', sceneLabel: 'RETRIEVE / CONTEXT / GENERATE',
    layerIndexes: [2], detail: 'Inspect AI', next: 'Next: explore the work'
  }
];

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const smoothstep = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

/** Hold each chapter for reading, then use the last 45% to travel to the next. */
export function positionForProgress(progress, count = STACK_CHAPTERS.length) {
  const raw = clamp(progress) * count;
  const chapter = Math.min(count - 1, Math.floor(raw));
  return Math.min(count - 1, chapter + smoothstep(0.55, 1, raw - chapter));
}

export function progressForChapter(index, count = STACK_CHAPTERS.length) {
  return index === 0 ? 0 : (clamp(index, 0, count - 1) + 0.15) / count;
}
