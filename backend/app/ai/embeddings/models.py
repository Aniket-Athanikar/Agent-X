from pydantic import BaseModel


class EmbeddingRequest(BaseModel):
    text: str


class BatchEmbeddingRequest(BaseModel):
    texts: list[str]


class EmbeddingResponse(BaseModel):
    embedding: list[float]


class BatchEmbeddingResponse(BaseModel):
    embeddings: list[list[float]]