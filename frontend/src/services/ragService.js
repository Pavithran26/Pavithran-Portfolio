/**
 * ragService.js
 * Client service to query the FastAPI LangChain RAG backend.
 */
export class RAGService {
  static async query(question, topK = 4, { signal } = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 25000);
    try {
      const res = await fetch('/api/v1/rag/query', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: question,
          top_k: topK
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }

  static async checkHealth() {
    try {
      const res = await fetch('/api/v1/health');
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
