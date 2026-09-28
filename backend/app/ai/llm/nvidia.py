import logging
from typing import Any, AsyncGenerator

from app.core.config import settings


logger = logging.getLogger(__name__)


class NVIDIAService:
    """NVIDIA's OpenAI-compatible Nemotron generation client."""

    def _client(self) -> Any:
        if not settings.NVIDIA_API_KEY:
            raise RuntimeError("NVIDIA API key is not configured")
        # Keep NVIDIA optional at process startup.  The package is declared in
        # requirements, but this import is only needed when NVIDIA is selected.
        from openai import AsyncOpenAI
        return AsyncOpenAI(base_url=settings.NVIDIA_BASE_URL, api_key=settings.NVIDIA_API_KEY)

    @staticmethod
    def _messages(prompt: str, system: str | None) -> list[dict[str, str]]:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        return messages

    async def generate(self, prompt: str, system: str | None = None, temperature: float = 0.2) -> str:
        """Return the UI's normal JSON-chat answer from NVIDIA's stream.

        Nemotron emits its internal reasoning separately from the user-facing
        answer.  The normal `/ai/chat` endpoint is intentionally non-streaming,
        so consume the provider stream here and retain only `delta.content`.
        """
        content_parts = []
        async for content in self.stream(prompt=prompt, system=system, temperature=temperature):
            content_parts.append(content)

        response_content = "".join(content_parts).strip()
        if not response_content:
            raise RuntimeError("NVIDIA returned an empty or malformed response")
        return response_content

    async def stream(self, prompt: str, system: str | None = None, temperature: float = 0.2) -> AsyncGenerator[str, None]:
        stream = await self._client().chat.completions.create(
            model=settings.NVIDIA_MODEL,
            messages=self._messages(prompt, system),
            temperature=temperature,
            top_p=0.95,
            max_tokens=4096,
            # Agent-X intentionally never exposes model reasoning. Disable it at
            # the provider so a long hidden trace cannot consume the response
            # budget or delay the user-visible stream indefinitely.
            extra_body={"chat_template_kwargs": {"enable_thinking": False}},
            stream=True,
        )
        async for chunk in stream:
            choices = getattr(chunk, "choices", None)
            if not choices:
                continue
            # reasoning_content is deliberately ignored: it is not user-facing output.
            delta = getattr(choices[0], "delta", None)
            content = getattr(delta, "content", None)
            if content:
                yield content
