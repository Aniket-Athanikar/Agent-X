import asyncio
import sys
import types
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

# Importing the LLM package initializes its retained Ollama fallback.  Stub the
# optional package because these NVIDIA unit tests never invoke that fallback.
if "ollama" not in sys.modules:
    ollama_stub = types.ModuleType("ollama")

    class AsyncClient:
        def __init__(self, *_args, **_kwargs):
            pass

    ollama_stub.AsyncClient = AsyncClient
    sys.modules["ollama"] = ollama_stub

from app.ai.llm.nvidia import NVIDIAService


class AsyncChunks:
    def __init__(self, chunks):
        self._chunks = chunks

    def __aiter__(self):
        self._iterator = iter(self._chunks)
        return self

    async def __anext__(self):
        try:
            return next(self._iterator)
        except StopIteration as error:
            raise StopAsyncIteration from error


class NVIDIAServiceTests(unittest.TestCase):
    def test_generate_collects_only_user_facing_stream_content(self):
        chunks = AsyncChunks([
            SimpleNamespace(choices=[]),
            SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(reasoning_content="private", content=None))]),
            SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(reasoning_content="private", content="Visible "))]),
            SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(reasoning_content=None, content="answer"))]),
            SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(reasoning_content=None, content=None))]),
        ])
        client = SimpleNamespace(
            chat=SimpleNamespace(completions=SimpleNamespace(create=AsyncMock(return_value=chunks)))
        )

        with patch.object(NVIDIAService, "_client", return_value=client):
            answer = asyncio.run(NVIDIAService().generate("Explain this file."))

        self.assertEqual("Visible answer", answer)
        request = client.chat.completions.create.call_args.kwargs
        self.assertTrue(request["stream"])
        self.assertEqual({"chat_template_kwargs": {"enable_thinking": False}}, request["extra_body"])

    def test_generate_rejects_reasoning_only_stream(self):
        chunks = AsyncChunks([
            SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(reasoning_content="private", content=None))]),
        ])
        client = SimpleNamespace(
            chat=SimpleNamespace(completions=SimpleNamespace(create=AsyncMock(return_value=chunks)))
        )

        with patch.object(NVIDIAService, "_client", return_value=client):
            with self.assertRaisesRegex(RuntimeError, "empty or malformed"):
                asyncio.run(NVIDIAService().generate("Explain this file."))


if __name__ == "__main__":
    unittest.main()
