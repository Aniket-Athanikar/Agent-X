import asyncio
import ollama


async def main():
    client = ollama.AsyncClient(
        host="http://localhost:11434"
    )

    response = await client.chat(
        model="qwen3:4b",
        messages=[
            {
                "role": "user",
                "content": "Hello, explain RAG in one sentence"
            }
        ]
    )

    print(response["message"]["content"])


asyncio.run(main())