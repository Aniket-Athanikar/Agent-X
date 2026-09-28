import asyncio
import sys
import types
import unittest
from unittest.mock import patch

# The provider-manager tests do not exercise the Ollama SDK.  Stub it before
# importing the package so these unit tests can run in a minimal CI install.
if "ollama" not in sys.modules:
    ollama_stub = types.ModuleType("ollama")
    class AsyncClient:
        def __init__(self, *_args, **_kwargs):
            pass
    ollama_stub.AsyncClient = AsyncClient
    sys.modules["ollama"] = ollama_stub

if "dotenv" not in sys.modules:
    dotenv_stub = types.ModuleType("dotenv")
    dotenv_stub.load_dotenv = lambda *_args, **_kwargs: None
    sys.modules["dotenv"] = dotenv_stub

from app.ai.llm.provider_manager import AIProviderManager, AIProvidersUnavailableError
from app.core.config import settings


class FakeProvider:
    def __init__(self, result=None, error=None):
        self.result = result
        self.error = error
        self.calls = 0

    async def generate(self, **_kwargs):
        self.calls += 1
        if self.error:
            raise self.error
        return self.result

    async def stream(self, **_kwargs):
        if self.error:
            raise self.error
        yield self.result


class ProviderManagerTests(unittest.TestCase):
    def setUp(self):
        self.settings = patch.multiple(
            settings, AI_PROVIDER="nvidia", AI_FALLBACK_PROVIDER="ollama"
        )
        self.settings.start()

    def tearDown(self):
        self.settings.stop()

    def test_nvidia_is_used_first(self):
        nvidia = FakeProvider(result="nvidia answer")
        ollama = FakeProvider(result="ollama answer")
        result = asyncio.run(AIProviderManager(ollama=ollama, nvidia=nvidia).generate("prompt"))
        self.assertEqual("nvidia answer", result.content)
        self.assertEqual("nvidia", result.provider)
        self.assertEqual(0, ollama.calls)

    def test_ollama_is_used_when_nvidia_fails(self):
        nvidia = FakeProvider(error=RuntimeError("unavailable"))
        ollama = FakeProvider(result="ollama answer")
        result = asyncio.run(AIProviderManager(ollama=ollama, nvidia=nvidia).generate("prompt"))
        self.assertEqual("ollama answer", result.content)
        self.assertTrue(result.used_fallback)

    def test_clean_failure_when_both_providers_fail(self):
        manager = AIProviderManager(
            ollama=FakeProvider(error=ConnectionError("offline")),
            nvidia=FakeProvider(error=RuntimeError("bad key")),
        )
        with self.assertRaises(AIProvidersUnavailableError):
            asyncio.run(manager.generate("prompt"))
