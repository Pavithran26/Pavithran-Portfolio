import math
import hashlib
from abc import ABC, abstractmethod
from typing import List
from app.core.config import Settings
from app.core.logger import logger


class BaseEmbeddingProvider(ABC):
    """Abstract interface for generating vector embeddings."""

    @abstractmethod
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of document chunks."""
        pass

    @abstractmethod
    def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single user query."""
        pass


class MockEmbeddingProvider(BaseEmbeddingProvider):
    """
    Deterministic pseudo-embedding provider for offline development,
    testing, and zero-configuration local runs without requiring an API key.
    Generates normalized 384-dimension vectors based on token hashing.
    """

    def __init__(self, dim: int = 384):
        self.dim = dim
        logger.warning(
            "Using MockEmbeddingProvider (offline/test mode). "
            "Configure GEMINI_API_KEY or OPENAI_API_KEY in .env for production vectors."
        )

    def _hash_to_vector(self, text: str) -> List[float]:
        vector = [0.0] * self.dim
        tokens = text.lower().split()
        if not tokens:
            return vector

        for token in tokens:
            h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            idx = h % self.dim
            vector[idx] += 1.0

        # L2 Normalize
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [x / norm for x in vector]
        return vector

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._hash_to_vector(t) for t in texts]

    def embed_query(self, text: str) -> List[float]:
        return self._hash_to_vector(text)


class GeminiEmbeddingProvider(BaseEmbeddingProvider):
    """Google Gemini Embedding service using google-generativeai."""

    def __init__(self, api_key: str, model: str = "models/text-embedding-004"):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self.model = model
        self.client = genai
        self.fallback = MockEmbeddingProvider(dim=384)
        logger.info(f"Initialized GeminiEmbeddingProvider with model: {self.model}")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        try:
            res = self.client.embed_content(
                model=self.model,
                content=texts,
                task_type="retrieval_document"
            )
            emb = res.get("embedding") if isinstance(res, dict) else getattr(res, "embedding", None)
            if isinstance(emb, dict) and "values" in emb:
                return emb["values"]
            if emb:
                return emb
        except Exception as e:
            logger.warning(f"Gemini document embedding failed: {e}. Falling back to mock embeddings.")
        return self.fallback.embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        for candidate in [self.model, "models/embedding-001", "text-embedding-004", "embedding-001"]:
            try:
                res = self.client.embed_content(
                    model=candidate,
                    content=text,
                    task_type="retrieval_query"
                )
                emb = res.get("embedding") if isinstance(res, dict) else getattr(res, "embedding", None)
                if isinstance(emb, dict) and "values" in emb:
                    return emb["values"]
                if emb:
                    return emb
            except Exception as e:
                logger.warning(f"Gemini query embedding with {candidate} failed: {e}")
                continue
        logger.warning("All Gemini embedding models failed. Using deterministic fallback embeddings.")
        return self.fallback.embed_query(text)


class OpenAIEmbeddingProvider(BaseEmbeddingProvider):
    """OpenAI Embedding service using official openai SDK."""

    def __init__(self, api_key: str, model: str = "text-embedding-3-small"):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key)
        self.model = model
        logger.info(f"Initialized OpenAIEmbeddingProvider with model: {self.model}")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        try:
            response = self.client.embeddings.create(input=texts, model=self.model)
            return [item.embedding for item in response.data]
        except Exception as e:
            logger.error(f"OpenAI document embedding failed: {e}")
            raise

    def embed_query(self, text: str) -> List[float]:
        try:
            response = self.client.embeddings.create(input=[text], model=self.model)
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI query embedding failed: {e}")
            raise


def get_embedding_provider(settings: Settings) -> BaseEmbeddingProvider:
    """Factory function to instantiate the active embedding provider based on config."""
    provider = settings.EMBEDDING_PROVIDER.lower()

    gemini_key = getattr(settings, "effective_gemini_api_key", settings.GEMINI_API_KEY)
    if provider == "gemini" and gemini_key:
        return GeminiEmbeddingProvider(api_key=gemini_key, model=settings.GEMINI_EMBEDDING_MODEL)
    elif provider == "openai" and settings.OPENAI_API_KEY:
        return OpenAIEmbeddingProvider(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_EMBEDDING_MODEL)
    else:
        logger.warning(f"No valid API key found for provider '{provider}'. Falling back to MockEmbeddingProvider.")
        return MockEmbeddingProvider()
