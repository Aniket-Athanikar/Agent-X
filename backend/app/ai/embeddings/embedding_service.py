from ollama import AsyncClient

from app.core.config import settings


class EmbeddingService:

    def __init__(self):
        self.client = AsyncClient(
            host=settings.OLLAMA_HOST
        )

        self.model = settings.OLLAMA_EMBED_MODEL

    async def embed_text(
        self,
        text: str,
    ) -> list[float]:
        """
        Generate embedding for a single text.
        """

        response = await self.client.embed(
            model=self.model,
            input=text,
        )

        return response["embeddings"][0]

    async def embed_batch(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        """
        Generate embeddings for multiple texts.
        """

        response = await self.client.embed(
            model=self.model,
            input=texts,
        )

        return response["embeddings"]


# Singleton instance
embedding_service = EmbeddingService()