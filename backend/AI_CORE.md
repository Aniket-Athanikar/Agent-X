# Agent-X AI Core

Agent-X uses only local Ollama and Qdrant services. Uploads are stored under
`uploads/<workspace_id>` and indexed with workspace-scoped Qdrant metadata.

## Configuration

- `RAG_EMBED_BATCH_SIZE` controls Ollama embedding batch size (default `32`).
- `RAG_RETRIEVAL_LIMIT` reserves a configurable retrieval limit for callers.
- `RAG_CONTEXT_MAX_CHARS` limits prompt context (default `6000`).

## Chat APIs

- `POST /ai/chat/test` returns a complete answer and source chunks.
- `POST /ai/chat/stream` streams the same local Ollama response as plain text.

If no workspace context matches, Agent-X returns the configured exact fallback.

## Validation

After installing backend dependencies, run the local-only test suite with:

```powershell
python -m unittest discover -s tests -p "test_*.py"
```

The tests mock Qdrant and Ollama-bound indexing services, so they do not require
network access or running local model services.
