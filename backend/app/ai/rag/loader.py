from pathlib import Path

from app.ai.parsers import parse_document
from app.ai.schemas.rag import ParsedDocument


class DocumentLoader:

    async def load(
        self,
        file_path: str,
        root_path: str | None = None,
    ) -> ParsedDocument:

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(file_path)

        document = parse_document(file_path, root_path)
        document.metadata["size"] = len(document.text)
        return document


document_loader = DocumentLoader()
