import re
from typing import AsyncGenerator

from app.ai.llm import AIProvidersUnavailableError, provider_manager
from app.ai.agents import coordinator_agent
from app.ai.prompts import rag_prompt_builder
from app.ai.rag import retriever
from time import perf_counter
from app.core.config import settings


NOT_FOUND_MESSAGE = "I couldn't find this information in the uploaded project."


def clean_answer_formatting(answer: str) -> str:
    """Remove decorative emphasis without changing fenced code samples."""
    parts = re.split(r"(```.*?```)", answer, flags=re.DOTALL)
    for index in range(0, len(parts), 2):
        text = parts[index]
        text = re.sub(r"\*\*(?=\S)(.+?)(?<=\S)\*\*", r"\1", text)
        text = re.sub(r"__(?=\S)(.+?)(?<=\S)__", r"\1", text)
        parts[index] = re.sub(r"(?im)(?:^|\n)[ \t]*svg[ \t]*\r?\n?", "", text)
    return "".join(parts).strip()


class RAGGenerator:

    async def answer(
        self,
        question: str,
        limit: int = 3,
        workspace_id: str = "default",
        active_file: dict | None = None,
    ):

        results, prompt = await self._retrieve_prompt(question, limit, workspace_id, active_file)

        llm_start = perf_counter()

        generation = await provider_manager.generate(prompt=prompt)

        print("LLM time:", perf_counter() - llm_start)

        return {
            "answer": clean_answer_formatting(generation.content),
            "sources": results,
            "provider": generation.provider,
            "fallback": generation.used_fallback,
        }

    async def stream_answer(
        self,
        question: str,
        limit: int = 3,
        workspace_id: str = "default",
        active_file: dict | None = None,
    ) -> AsyncGenerator[str, None]:
        results, prompt = await self._retrieve_prompt(question, limit, workspace_id, active_file)
        try:
            async for chunk, _metadata in provider_manager.stream(prompt=prompt):
                yield chunk
        except AIProvidersUnavailableError:
            # Streaming responses have already started, so return the same
            # safe user-facing message instead of a provider traceback.
            yield "AI services are currently unavailable. NVIDIA and the local Ollama fallback could not generate a response. Please try again shortly."

    @staticmethod
    async def _retrieve_prompt(
        question: str,
        limit: int,
        workspace_id: str,
        active_file: dict | None = None,
    ) -> tuple[list[dict], str | None]:
        start = perf_counter()
        try:
            results = await retriever.retrieve(
                query=question,
                limit=limit,
                workspace_id=workspace_id or "default",
            )
        except Exception:
            # The selected file remains useful when indexing is unavailable.
            results = []
        print("Retrieval time:", perf_counter() - start)

        unique_chunks = []
        seen_text = set()
        for item in results:
            text = item["text"].strip()
            if text and text not in seen_text:
                seen_text.add(text)
                unique_chunks.append(text)
        repository_context = coordinator_agent.collect_context(workspace_id or "default", question)
        active_context = ""
        if active_file:
            active_context = (
                "ACTIVE FILE (primary context)\n"
                f"Path: {active_file.get('file_path', '')}\n"
                f"Language: {active_file.get('language') or 'unknown'}\n"
                "```\n"
                f"{active_file.get('content', '')}\n"
                "```"
            )
        context = "\n\n".join([active_context, *unique_chunks, repository_context]).strip()
        # Chat generation must not depend on a running local embedding service.
        # This lets NVIDIA answer when Ollama/Qdrant is offline, while still
        # preferring the same prepared active-file and retrieved context when it exists.
        if not context:
            context = (
                "No indexed repository context is currently available. "
                "Answer from general technical knowledge and state uncertainty where relevant."
            )
        context = context[:settings.RAG_CONTEXT_MAX_CHARS]
        print("Chunks:", len(results))
        print("Context chars:", len(context))
        return results, rag_prompt_builder.build(question=question, context=context)


rag_generator = RAGGenerator()
