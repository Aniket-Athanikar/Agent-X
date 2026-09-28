import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
    Filter,
    FieldCondition,
    FilterSelector,
    MatchValue,
)

from app.core.config import settings


class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT,
        )

        self.collection_name = settings.QDRANT_COLLECTION
        self.vector_size = 768

    def create_collection(self):
        """
        Create the collection if it does not already exist.
        """

        collections = self.client.get_collections().collections
        existing = [c.name for c in collections]

        if self.collection_name in existing:
            return

        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(
                size=self.vector_size,
                distance=Distance.COSINE,
            ),
        )

    def add_document(
        self,
        text: str,
        vector: list[float],
        metadata: dict | None = None,
        point_id: str | None = None,
    ) -> str:
        """
        Store one embedded document chunk.
        """

        point_id = point_id or str(uuid.uuid4())

        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "text": text,
                        **(metadata or {}),
                    },
                )
            ],
        )

        return point_id

    def add_documents(
        self,
        texts: list[str],
        vectors: list[list[float]],
        metadata_list: list[dict] | None = None,
        point_ids: list[str] | None = None,
    ):
        """
        Store multiple chunks at once.
        """

        if not (len(texts) == len(vectors) == len(metadata_list or texts) == len(point_ids or texts)):
            raise ValueError("Texts, vectors, metadata, and point IDs must have matching lengths")

        points = []

        metadata_list = metadata_list or [{} for _ in texts]
        point_ids = point_ids or [str(uuid.uuid4()) for _ in texts]

        for text, vector, metadata, point_id in zip(
            texts,
            vectors,
            metadata_list,
            point_ids,
        ):
            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "text": text,
                        **metadata,
                    },
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=points,
        )

    def similarity_search(
        self,
        vector: list[float],
        limit: int = 5,
        workspace_id: str = "default",
    ):
        """
        Search similar vectors.
        """

        query_filter = Filter(
            must=[
                FieldCondition(
                    key="workspace_id",
                    match=MatchValue(value=workspace_id),
                )
            ]
        )

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=limit,
            with_payload=True,
            query_filter=query_filter,
        )

        if results is None or results.points is None:
            return []

        return results.points

    def file_is_current(
        self,
        workspace_id: str,
        file_path: str,
        file_hash: str,
    ) -> bool:

        result = self.client.count(
            collection_name=self.collection_name,
            count_filter=Filter(
                must=[
                    FieldCondition(
                        key="workspace_id",
                        match=MatchValue(value=workspace_id),
                    ),
                    FieldCondition(
                        key="file_path",
                        match=MatchValue(value=file_path),
                    ),
                    FieldCondition(
                        key="file_hash",
                        match=MatchValue(value=file_hash),
                    ),
                ]
            ),
            exact=False,
        )

        return result.count > 0
     
    def delete_file(self, workspace_id: str, file_path: str) -> None:
        """Remove prior chunks for one file before it is re-indexed."""
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=FilterSelector(
                filter=Filter(
                    must=[
                        FieldCondition(key="workspace_id", match=MatchValue(value=workspace_id)),
                        FieldCondition(key="file_path", match=MatchValue(value=file_path)),
                    ]
                )
            ),
        )

    def delete_collection(self):
        """
        Delete the current collection.
        """

        self.client.delete_collection(
            collection_name=self.collection_name,
        )

    def collection_exists(self) -> bool:
        """
        Check if collection exists.
        """

        collections = self.client.get_collections().collections

        return any(
            c.name == self.collection_name
            for c in collections
        )


# Singleton instance used throughout the project
qdrant_service = QdrantService()
