from typing import AsyncGenerator

import ollama

from app.core.config import settings


class OllamaService:
   
    def __init__(self):
        print("========== OLLAMA CONFIG ==========")
        print("HOST:", settings.OLLAMA_HOST)
        print("CHAT MODEL:", settings.OLLAMA_CHAT_MODEL)
        print("EMBED MODEL:", settings.OLLAMA_EMBED_MODEL)
        print("===================================")

        self.client = ollama.AsyncClient(
            host=settings.OLLAMA_HOST
        )

    async def health(self) -> bool:
        try:
            await self.client.ps()
            return True
        except Exception:
            return False

    async def generate(
        self,
        prompt: str,
        system: str | None = None,
        temperature: float = 0.2,
    ) -> str:

        messages = []

        if system:
            messages.append(
                {
                    "role": "system",
                    "content": system,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        response = await self.client.chat(
            model=settings.OLLAMA_CHAT_MODEL,
            messages=messages,
            options={
                "temperature": temperature,
                "num_predict": 300,
                "think": False,
            },
        )

        return response["message"]["content"]

    async def stream(
        self,
        prompt: str,
        system: str | None = None,
        temperature: float = 0.2,
    ) -> AsyncGenerator[str, None]:

        messages = []

        if system:
            messages.append(
                {
                    "role": "system",
                    "content": system,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        stream = await self.client.chat(
            model=settings.OLLAMA_CHAT_MODEL,
            messages=messages,
            stream=True,
            options={
                "temperature": temperature,
            },
        )

        async for chunk in stream:
            if chunk.get("message"):
                yield chunk["message"]["content"]