from app.ai.rag.vector_store import qdrant_service


class QdrantTool:
    def search(self, vector: list[float], workspace_id: str, limit: int = 5):
        return qdrant_service.similarity_search(vector, limit, workspace_id)


qdrant_tool = QdrantTool()
