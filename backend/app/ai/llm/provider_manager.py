import logging
from dataclasses import dataclass
from typing import AsyncGenerator

from app.ai.llm.nvidia import NVIDIAService
from app.ai.llm.ollama import OllamaService
from app.core.config import settings


logger = logging.getLogger(__name__)


class AIProvidersUnavailableError(RuntimeError):
    """Raised only after the configured primary and fallback both fail."""


@dataclass(frozen=True)
class GenerationResult:
    content: str
    provider: str
    used_fallback: bool = False


class AIProviderManager:
    """Try configured generation providers without duplicating RAG/context work."""

    def __init__(self, ollama: OllamaService | None = None, nvidia: NVIDIAService | None = None):
        self._providers = {"ollama": ollama or OllamaService(), "nvidia": nvidia or NVIDIAService()}

    def _provider_order(self) -> list[str]:
        configured = [settings.AI_PROVIDER, settings.AI_FALLBACK_PROVIDER]
        order = []
        for provider in configured:
            if provider and provider not in order:
                if provider not in self._providers:
                    logger.error("Unsupported AI provider configured: %s", provider)
                    continue
                order.append(provider)
        return order

    async def generate(self, prompt: str, system: str | None = None) -> GenerationResult:
        order = self._provider_order()
        errors = []
        for index, name in enumerate(order):
            try:
                logger.info("AI PROVIDER: %s", name.upper())
                logger.info("AI MODEL: %s", settings.NVIDIA_MODEL if name == "nvidia" else settings.OLLAMA_CHAT_MODEL)
                content = await self._providers[name].generate(prompt=prompt, system=system)
                if index:
                    logger.info("AI FALLBACK SUCCESS: %s", name.title())
                return GenerationResult(content=content, provider=name, used_fallback=bool(index))
            except Exception as error:
                errors.append(f"{name}: {type(error).__name__}")
                if index + 1 < len(order):
                    logger.warning("%s request failed, attempting %s fallback", name.upper(), order[index + 1].title())
                else:
                    logger.exception("AI provider request failed: %s", name)
        logger.error("AI PROVIDERS FAILED: %s", " + ".join(name.upper() for name in order) or "none")
        raise AIProvidersUnavailableError("; ".join(errors) or "No supported AI provider is configured")

    async def stream(self, prompt: str, system: str | None = None) -> AsyncGenerator[tuple[str, GenerationResult | None], None]:
        """Yield normalized content; fallback is safe until a provider emits content."""
        order = self._provider_order()
        errors = []
        for index, name in enumerate(order):
            emitted = False
            try:
                logger.info("AI PROVIDER: %s", name.upper())
                async for content in self._providers[name].stream(prompt=prompt, system=system):
                    emitted = True
                    yield content, GenerationResult(content="", provider=name, used_fallback=bool(index))
                if emitted:
                    if index:
                        logger.info("AI FALLBACK SUCCESS: %s", name.title())
                    return
                raise RuntimeError("Provider returned an empty stream")
            except Exception as error:
                errors.append(f"{name}: {type(error).__name__}")
                # Once output is sent, retrying would concatenate two answers.
                if emitted:
                    logger.exception("Streaming provider failed after output: %s", name)
                    raise AIProvidersUnavailableError("Streaming response interrupted") from error
                if index + 1 < len(order):
                    logger.warning("%s request failed, attempting %s fallback", name.upper(), order[index + 1].title())
        logger.error("AI PROVIDERS FAILED: %s", " + ".join(name.upper() for name in order) or "none")
        raise AIProvidersUnavailableError("; ".join(errors) or "No supported AI provider is configured")
