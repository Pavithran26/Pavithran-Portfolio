/**
 * ragService.js
 * Client service to query the FastAPI LangChain RAG backend.
 */
export class RAGService {
  static async query(question, topK = 4, { signal } = {}) {
    const request = new AbortController();
    const abort = () => request.abort(signal?.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(() => request.abort(new Error('DAWN request timed out')), 25000);
    try {
      const res = await fetch('/api/v1/rag/query', {
        method: 'POST',
        signal: request.signal,
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
