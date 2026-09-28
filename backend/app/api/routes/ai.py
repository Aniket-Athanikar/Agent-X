import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional

from app.ai.llm import ollama_service, provider_manager, AIProvidersUnavailableError
from app.ai.embeddings import embedding_service
from app.ai.rag import qdrant_service
from app.ai.rag.loader import document_loader
from app.ai.rag import text_chunker
from app.ai.rag import rag_pipeline
from app.ai.rag import retriever
from app.ai.rag import rag_generator
from app.core.security import get_current_active_user, get_current_user_optional
from app.modules.auth.models import User

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)

logger = logging.getLogger(__name__)


@router.get("/health")
async def health():
    return {
        "ollama": await ollama_service.health(),
        "primary_provider": provider_manager._provider_order()[0] if provider_manager._provider_order() else None,
    }


@router.post("/test")
async def test():

    response = await ollama_service.generate(
        prompt="Introduce yourself in one sentence."
    )

    return {
        "response": response
    }


@router.post("/embedding")
async def embedding():

    vector = await embedding_service.embed_text(
        "Hello Agent-X"
    )

    return {
        "dimension": len(vector),
        "preview": vector[:10]
    }


@router.post("/embeddings")
async def embeddings():

    vectors = await embedding_service.embed_batch(
        [
            "Artificial Intelligence",
            "FastAPI",
            "LangGraph",
            "Qdrant"
        ]
    )

    return {
        "count": len(vectors),
        "dimension": len(vectors[0])
    }

@router.post("/qdrant/init")
async def init_qdrant():

    qdrant_service.create_collection()

    return {
        "message": "Collection created successfully"
    }

@router.post("/qdrant/store")
async def store():

    text = """
    FastAPI is a modern Python web framework used for building APIs.
    """

    vector = await embedding_service.embed_text(text)

    qdrant_service.add_document(
        text=text,
        vector=vector,
        metadata={
            "source": "demo",
            "type": "documentation",
            "workspace_id": "default",
        },
    )

    return {
        "message": "Stored successfully"
    }

@router.post("/qdrant/search")
async def search():

    query = "Python web framework"

    vector = await embedding_service.embed_text(query)

    results = qdrant_service.similarity_search(vector)

    return [
        item.payload
        for item in results
    ]

@router.post("/loader/test")
async def loader_test():

    document = await document_loader.load(
        "uploads/sample.txt"
    )

    return {
        "filename": document.filename,
        "characters": document.metadata["size"],
        "preview": document.text[:300]
    }

@router.post("/chunker/test")
async def chunker_test():

    document = await document_loader.load(
        "uploads/sample.txt"
    )

    chunks = text_chunker.chunk(
        document.text,
        language=document.language,
        metadata=document.metadata,
    )

    return {
        "total_chunks": len(chunks),
        "first_chunk": chunks[0],
    }

@router.post("/pipeline/test")
async def pipeline_test():

    result = await rag_pipeline.index_document(
        "uploads/sample.txt"
    )

    return result

@router.post("/retriever/test")
async def retriever_test():

    results = await retriever.retrieve(
        query="What technologies does Agent-X use?"
    )

    return {
        "matches": len(results),
        "results": results,
    }
class ActiveFileContext(BaseModel):
    """The source file explicitly selected in the workspace UI."""
    file_name: str
    file_path: str
    language: Optional[str] = None
    content: str = Field(default="", max_length=120_000)


class ChatRequest(BaseModel):
    question: str
    workspace_id: Optional[str] = None
    active_file: Optional[ActiveFileContext] = None

@router.post("/chat")
@router.post("/chat/test", include_in_schema=False)
async def chat_test(
    request: ChatRequest,
    current_user: User = Depends(get_current_user_optional)
):
    try:
        return await rag_generator.answer(
            question=request.question,
            workspace_id=request.workspace_id,
            active_file=request.active_file.model_dump() if request.active_file else None,
        )
    except AIProvidersUnavailableError as error:
        logger.exception("AI chat generation failed after all configured providers were tried")
        raise HTTPException(
            status_code=503,
            detail="AI services are currently unavailable. NVIDIA and the local Ollama fallback could not generate a response. Please try again shortly.",
        ) from error
    except Exception as error:
        # Keep response details safe for the browser while retaining a traceback
        # at the provider-to-route boundary for Docker diagnostics.
        logger.exception("Unexpected AI chat response failure")
        raise HTTPException(
            status_code=500,
            detail="AI request failed. Please try again shortly.",
        ) from error


@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user_optional),
):
    return StreamingResponse(
        rag_generator.stream_answer(
            question=request.question,
            workspace_id=request.workspace_id or "default",
            active_file=request.active_file.model_dump() if request.active_file else None,
        ),
        media_type="text/plain; charset=utf-8",
    )
