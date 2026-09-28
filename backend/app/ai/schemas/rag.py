from typing import Any

from pydantic import BaseModel, Field


class ParsedDocument(BaseModel):
    """Normalized parser result consumed by the RAG ingestion pipeline."""

    text: str
    filename: str
    path: str
    language: str | None = None
    file_type: str
    metadata: dict[str, Any] = Field(default_factory=dict)
