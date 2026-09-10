from abc import ABC, abstractmethod
from typing import List, Optional
from app.core.config import Settings
from app.models.schemas import SourceChunk
from app.core.logger import logger


class BaseLLMProvider(ABC):
    """Abstract interface for LLM synthesis in the RAG pipeline."""

    @abstractmethod
    def generate_answer(self, query: str, context_chunks: List[SourceChunk]) -> str:
        """Synthesizes an answer grounded in the retrieved context chunks."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        pass


class MockLLMProvider(BaseLLMProvider):
    """
    Offline fallback LLM provider that formats retrieved context directly.
    Allows full testing of API and RAG flow without requiring external API keys.
    """

    def __init__(self, model: str = "mock-llm-offline"):
        self._model = model
        logger.warning(
            "Using MockLLMProvider (offline mode). "
            "Configure GEMINI_API_KEY or OPENAI_API_KEY in .env for true GenAI synthesis."
        )

    @property
    def model_name(self) -> str:
        return self._model

    def generate_answer(self, query: str, context_chunks: List[SourceChunk]) -> str:
        if not context_chunks:
            return (
                f"No relevant context found in vector storage to answer: '{query}'. "
                "Please ingest documents first."
            )

        bullet_points = []
        for i, chunk in enumerate(context_chunks, 1):
            title = chunk.metadata.get("title", "Document")
            preview = chunk.content[:200].replace("\n", " ")
            bullet_points.append(f"{i}. [{title}]: {preview}...")

        summary = "\n".join(bullet_points)
        return (
            f"[Offline Mode / Base Demo]\n"
            f"Based on {len(context_chunks)} retrieved context source(s) for query: '{query}':\n\n"
            f"{summary}\n\n"
            f"(Note: Set GEMINI_API_KEY or OPENAI_API_KEY in .env to enable generative AI answers.)"
        )


class GeminiLLMProvider(BaseLLMProvider):
    """Google Gemini LLM synthesis using google-generativeai."""

    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self._model = model
        self.client = genai.GenerativeModel(model_name=self._model)
        logger.info(f"Initialized GeminiLLMProvider with model: {self._model}")

    @property
    def model_name(self) -> str:
        return self._model

    def _build_prompt(self, query: str, context_chunks: List[SourceChunk]) -> str:
        context_str = "\n\n---\n\n".join(
            [f"[Source {i+1} | {c.metadata.get('title', 'Doc')}]:\n{c.content}" for i, c in enumerate(context_chunks)]
        )
        return f"""You are the official AI Portfolio Assistant for Pavithran S.
Your goal is to answer questions about Pavithran's background, skills, experience, projects, and contact info based on the retrieved knowledge base.

Guidelines & Persona:
1. Tone: Professional, confident, friendly, slightly playful, and interactive.
2. For technical/project questions, follow: problem → solution → Pavithran's contribution → technology → outcome.
3. Grounding: Rely strictly on the retrieved context below. Do not invent unverified facts, metrics, or certifications.
4. Confidentiality Rules:
   - Never disclose Adhoc Softwares' customer/client name (if asked, say it is confidential and describe the ERP domain).
   - Do not disclose private family details.

### Retrieved Context:
{context_str}

### User Question:
{query}

### Answer:"""

    def generate_answer(self, query: str, context_chunks: List[SourceChunk]) -> str:
        if not context_chunks:
            return "I don't have enough context in Pavithran's knowledge base to answer this question."

        prompt = self._build_prompt(query, context_chunks)
        try:
            response = self.client.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            raise


class OpenAILLMProvider(BaseLLMProvider):
    """OpenAI LLM synthesis using official openai SDK."""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        from openai import OpenAI
        self.client = OpenAI(api_key=api_key)
        self._model = model
        logger.info(f"Initialized OpenAILLMProvider with model: {self._model}")

    @property
    def model_name(self) -> str:
        return self._model

    def _build_context(self, context_chunks: List[SourceChunk]) -> str:
        return "\n\n---\n\n".join(
            [f"[Source {i+1} | {c.metadata.get('title', 'Doc')}]:\n{c.content}" for i, c in enumerate(context_chunks)]
        )

    def generate_answer(self, query: str, context_chunks: List[SourceChunk]) -> str:
        if not context_chunks:
            return "I don't have enough context in Pavithran's knowledge base to answer this question."

        context_str = self._build_context(context_chunks)
        system_prompt = (
            "You are the official AI Portfolio Assistant for Pavithran S. "
            "Tone: Professional, confident, friendly, and interactive. "
            "Strictly follow: never reveal confidential client names from Adhoc Softwares; "
            "do not disclose private family info; rely strictly on the provided context."
        )
        user_prompt = f"Context:\n{context_str}\n\nQuestion: {query}"

        try:
            response = self.client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise


def get_llm_provider(settings: Settings) -> BaseLLMProvider:
    """Factory function to instantiate the active LLM provider based on config."""
    provider = settings.LLM_PROVIDER.lower()

    gemini_key = getattr(settings, "effective_gemini_api_key", settings.GEMINI_API_KEY)
    if provider == "gemini" and gemini_key:
        return GeminiLLMProvider(api_key=gemini_key, model=settings.GEMINI_MODEL)
    elif provider == "openai" and settings.OPENAI_API_KEY:
        return OpenAILLMProvider(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL)
    else:
        logger.warning(f"No valid API key found for provider '{provider}'. Falling back to MockLLMProvider.")
        return MockLLMProvider()
