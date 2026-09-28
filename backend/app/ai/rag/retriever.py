from app.ai.embeddings import embedding_service
from app.ai.rag.vector_store import qdrant_service
from app.core.config import settings


class Retriever:

    async def retrieve(
        self,
        query: str,
        limit: int = settings.RAG_RETRIEVAL_LIMIT,
        workspace_id: str = "default",
    ):
        print("=" * 60)
        print("QUESTION:", query)
        print("WORKSPACE:", workspace_id)

        # Generate embedding
        query_vector = await embedding_service.embed_text(query)

        # Search Qdrant
        results = qdrant_service.similarity_search(
            vector=query_vector,
            limit=limit,
            workspace_id=workspace_id or "default",
        )

        print("RESULT TYPE:", type(results))
        print("RESULT COUNT:", len(results) if results else 0)

        if not results:
            print("No documents retrieved from Qdrant")
            return []

        response = []

        for i, point in enumerate(results):
            print(f"\nResult {i + 1}")
            print("Score:", point.score)
            print("Payload:", point.payload)

            response.append(
                {
                    "text": point.payload.get("text", ""),
                    "score": point.score,
                    "metadata": point.payload,
                }
            )

        return response


# Singleton instance
retriever = Retriever()