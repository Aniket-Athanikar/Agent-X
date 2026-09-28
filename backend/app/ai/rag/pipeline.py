from fnmatch import fnmatch
import hashlib
import logging
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

from app.ai.parsers import is_supported_text_file
from app.ai.rag.loader import document_loader
from app.ai.rag.chunker import text_chunker
from app.ai.embeddings.embedding_service import embedding_service
from app.ai.rag.vector_store import qdrant_service
from app.core.config import settings


logger = logging.getLogger(__name__)


class RAGPipeline:

    def __init__(self):
        # A temporary Qdrant startup delay must not prevent FastAPI from serving
        # chat requests that can still use an explicitly selected active file.
        try:
            qdrant_service.create_collection()
        except Exception as error:
            logger.warning("Qdrant is not ready during application startup: %s", error)

    async def index_document(
        self,
        file_path: str,
        workspace_id: str = "default",
        root_path: str | None = None,
    ):

        source_hash = self._file_hash(file_path)
        document = await document_loader.load(file_path, root_path)

        if qdrant_service.file_is_current(workspace_id, document.path, source_hash):
            logger.info("Skipping unchanged file: %s", document.filename)
            return {"filename": document.filename, "workspace_id": workspace_id, "chunks": 0, "status": "unchanged"}

        # Split into chunks
        chunks = text_chunker.chunk(
            document.text,
            language=document.language,
            metadata=document.metadata,
        )

        if not chunks:
            return {
                "status": "empty_document"
            }

        logger.info("Processing file: %s", document.filename)
        logger.info("Language: %s", document.language or "unknown")

        texts = []
        metadata_list = []
        point_ids = []
        for chunk in chunks:
            chunk_id = str(uuid5(
                NAMESPACE_URL,
                f"{workspace_id}:{document.path}:{chunk['chunk_number']}",
            ))

            texts.append(chunk["text"])
            point_ids.append(chunk_id)
            metadata_list.append({
                    **chunk["metadata"],
                    "workspace_id": workspace_id,
                    "file_name": document.filename,
                    "file_path": document.path,
                    "relative_path": document.path,
                    "language": document.language,
                    "file_type": document.file_type,
                    "chunk_index": chunk["chunk_index"],
                    "chunk_number": chunk["chunk_number"],
                    "chunk_id": chunk_id,
                    "characters": chunk["characters"],
                    "line_start": chunk["metadata"].get("line_start"),
                    "line_end": chunk["metadata"].get("line_end"),
                    "file_hash": source_hash,
                })

        vectors = []
        for start in range(0, len(texts), settings.RAG_EMBED_BATCH_SIZE):
            batch_texts = texts[start:start + settings.RAG_EMBED_BATCH_SIZE]
            vectors.extend(await embedding_service.embed_batch(batch_texts))

        qdrant_service.delete_file(workspace_id, document.path)
        for start in range(0, len(texts), settings.RAG_EMBED_BATCH_SIZE):
            qdrant_service.add_documents(
                texts=texts[start:start + settings.RAG_EMBED_BATCH_SIZE],
                vectors=vectors[start:start + settings.RAG_EMBED_BATCH_SIZE],
                metadata_list=metadata_list[start:start + settings.RAG_EMBED_BATCH_SIZE],
                point_ids=point_ids[start:start + settings.RAG_EMBED_BATCH_SIZE],
            )

        indexed = len(texts)

        average_chunk_size = sum(chunk["characters"] for chunk in chunks) // indexed
        logger.info("Chunks created: %s", indexed)
        logger.info("Average chunk size: %s chars", average_chunk_size)

        return {
            "filename": document.filename,
            "workspace_id": workspace_id,
            "chunks": indexed,
        }

    async def index_path(self, path: str, workspace_id: str = "default"):
        root = Path(path)
        if root.is_file():
            return await self.index_document(str(root), workspace_id)

        if not root.is_dir():
            raise FileNotFoundError(path)

        ignored_directories = {
            ".git", ".svn", ".hg", "node_modules", "__pycache__", ".venv", "venv",
            "dist", "build", "coverage", ".next", ".idea", ".vscode", "target",
        }
        ignore_patterns = self._load_ignore_patterns(root)
        results = []
        for candidate in root.rglob("*"):
            if not candidate.is_file() or any(part in ignored_directories for part in candidate.parts):
                continue
            relative_path = candidate.relative_to(root).as_posix()
            if self._is_ignored(relative_path, ignore_patterns):
                continue
            if not is_supported_text_file(candidate):
                continue
            try:
                result = await self.index_document(str(candidate), workspace_id, str(root))
            except Exception:
                continue
            results.append(result)

        return {
            "workspace_id": workspace_id,
            "files": len(results),
            "chunks": sum(result.get("chunks", 0) for result in results),
        }

    @staticmethod
    def _file_hash(file_path: str) -> str:
        digest = hashlib.sha256()
        with open(file_path, "rb") as source:
            for block in iter(lambda: source.read(1024 * 1024), b""):
                digest.update(block)
        return digest.hexdigest()

    @staticmethod
    def _load_ignore_patterns(root: Path) -> list[str]:
        patterns = []
        for ignore_file in root.rglob(".gitignore"):
            try:
                patterns.extend(
                    line.strip()
                    for line in ignore_file.read_text(encoding="utf-8", errors="ignore").splitlines()
                    if line.strip() and not line.startswith("#")
                )
            except OSError:
                continue
        return patterns

    @staticmethod
    def _is_ignored(relative_path: str, patterns: list[str]) -> bool:
        for pattern in patterns:
            if pattern.startswith("!"):
                continue
            normalized = pattern.lstrip("/").rstrip("/")
            if fnmatch(relative_path, normalized) or fnmatch(Path(relative_path).name, normalized):
                return True
            if pattern.endswith("/") and relative_path.startswith(f"{normalized}/"):
                return True
        return False


rag_pipeline = RAGPipeline()
