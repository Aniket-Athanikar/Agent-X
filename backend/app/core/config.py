import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    # -------------------------
    # Mail
    # -------------------------

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")

    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_FROM = os.getenv("MAIL_FROM")

    MAIL_PORT = int(
        os.getenv("MAIL_PORT", 587)
    )

    MAIL_SERVER = os.getenv(
        "MAIL_SERVER",
        "smtp.gmail.com"
    )

    # -------------------------
    # Application
    # -------------------------

    DEBUG = os.getenv(
        "DEBUG",
        "False"
    )

    # -------------------------
    # Ollama
    # -------------------------

    OLLAMA_HOST = os.getenv(
        "OLLAMA_HOST",
        "http://localhost:11434"
    )

    OLLAMA_CHAT_MODEL = os.getenv(
        "OLLAMA_MODEL",
        os.getenv("OLLAMA_CHAT_MODEL", "qwen3:4b")
    )

    OLLAMA_EMBED_MODEL = os.getenv(
        "OLLAMA_EMBED_MODEL",
        "nomic-embed-text"
    )

    OLLAMA_TIMEOUT = int(
        os.getenv(
            "OLLAMA_TIMEOUT",
            120
        )
    )
    # -------------------------
    # Qdrant
    # -------------------------

    QDRANT_HOST = os.getenv(
        "QDRANT_HOST",
        "localhost"
    )

    QDRANT_PORT = int(
        os.getenv(
            "QDRANT_PORT",
            6333
        )
    )

    QDRANT_COLLECTION = os.getenv(
        "QDRANT_COLLECTION",
        "agentforge_documents"
    )

    # Generation providers.  Embeddings intentionally remain local Ollama
    # embeddings so changing the chat provider does not require re-indexing.
    AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama").strip().lower()
    AI_FALLBACK_PROVIDER = os.getenv("AI_FALLBACK_PROVIDER", "").strip().lower()
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")

    RAG_EMBED_BATCH_SIZE = int(os.getenv("RAG_EMBED_BATCH_SIZE", 32))
    RAG_RETRIEVAL_LIMIT = int(os.getenv("RAG_RETRIEVAL_LIMIT", 5))
    RAG_CONTEXT_MAX_CHARS = int(os.getenv("RAG_CONTEXT_MAX_CHARS", 6000))

settings = Settings()
