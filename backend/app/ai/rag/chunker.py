import re
from typing import Any


class TextChunker:
    """Fast, dependency-free chunking with language-specific boundaries."""

    def __init__(
        self,
        chunk_size: int = 1_000,
        chunk_overlap: int = 150,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(
        self,
        text: str,
        language: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        text = text.strip()
        if not text:
            return []

        units = self._semantic_units(text, language)
        if units is None:
            chunks = self._fixed_size_chunks(text)
        elif (language or "").lower() == "python":
            # Python's top-level definitions are strong semantic boundaries;
            # do not merge an unrelated helper into a class merely to fill bytes.
            chunks = []
            for unit in units:
                chunks.extend(self._fixed_size_chunks(unit) if len(unit) > self.chunk_size else [unit])
        else:
            chunks = self._merge_units(units)

        chunk_metadata = metadata or {}
        output = []
        search_from = 0
        for index, chunk_text in enumerate(chunks):
            position = text.find(chunk_text, search_from)
            if position < 0:  # Overlap can intentionally repeat an earlier unit.
                position = text.find(chunk_text)
            line_start = text.count("\n", 0, max(position, 0)) + 1
            item_metadata = {**chunk_metadata, "line_start": line_start, "line_end": line_start + chunk_text.count("\n")}
            output.append({"chunk_index": index, "chunk_number": index, "text": chunk_text, "characters": len(chunk_text), "metadata": item_metadata})
            search_from = max(position, 0) + len(chunk_text)
        return output

    def _semantic_units(self, text: str, language: str | None) -> list[str] | None:
        language = (language or "").lower()
        if language == "python":
            return self._split_at_boundaries(text, r"^(?:async\s+def|def|class)\s+")
        if language in {"java", "c", "cpp", "csharp", "go", "rust", "php", "kotlin", "swift"}:
            return self._split_at_boundaries(
                text,
                r"^(?:[ \t]*(?:public|private|protected|internal|static|final|abstract|async|export)[ \t]+)*(?:class|interface|struct|enum|record|fun[ \t]+|func[ \t]+|[\w<>\[\],?*]+[ \t]+\w+[ \t]*\()",
            )
        if language in {"javascript", "typescript"}:
            return self._split_at_boundaries(
                text,
                r"^(?:[ \t]*(?:export[ \t]+default[ \t]+|export[ \t]+)?(?:async[ \t]+)?function[ \t]+|[ \t]*(?:const|let|var)[ \t]+\w+[ \t]*=[ \t]*(?:async[ \t]*)?(?:\([^\n]*\)|\w+)[ \t]*=>|[ \t]*(?:class|interface|type)[ \t]+)",
            )
        if language in {"markdown", "restructuredtext"}:
            return self._split_at_boundaries(text, r"^#{1,6}\s+")
        if language == "html":
            return self._split_at_boundaries(text, r"^\s*<(?:main|section|article|header|footer|nav)\b")
        if language == "json":
            return self._json_units(text)
        if language == "yaml":
            return self._split_at_boundaries(text, r"^[^\s#][^:\n]*:\s*(?:#.*)?$")
        return None

    @staticmethod
    def _split_at_boundaries(text: str, pattern: str) -> list[str]:
        matches = list(re.finditer(pattern, text, re.MULTILINE))
        if not matches:
            return [text]

        starts = [0, *(match.start() for match in matches if match.start() > 0)]
        return [text[start:end].strip() for start, end in zip(starts, [*starts[1:], len(text)]) if text[start:end].strip()]

    @staticmethod
    def _json_units(text: str) -> list[str]:
        if not text.startswith("{") or not text.endswith("}"):
            return [text]

        units = []
        depth = 0
        in_string = False
        escaped = False
        start = 0
        for index, character in enumerate(text):
            if in_string:
                if escaped:
                    escaped = False
                elif character == "\\":
                    escaped = True
                elif character == '"':
                    in_string = False
                continue
            if character == '"':
                in_string = True
            elif character in "[{":
                depth += 1
            elif character in "]}":
                depth -= 1
            elif character == "," and depth == 1:
                units.append(text[start:index + 1].strip())
                start = index + 1
        units.append(text[start:].strip())
        return [unit for unit in units if unit]

    def _merge_units(self, units: list[str]) -> list[str]:
        chunks: list[str] = []
        current: list[str] = []
        current_size = 0

        for unit in units:
            separator_size = 2 if current else 0
            if current and current_size + separator_size + len(unit) > self.chunk_size:
                chunks.append("\n\n".join(current))
                current = self._overlap_units(current)
                current_size = len("\n\n".join(current))
            current.append(unit)
            current_size += (2 if len(current) > 1 else 0) + len(unit)

        if current:
            chunks.append("\n\n".join(current))
        return chunks

    def _overlap_units(self, units: list[str]) -> list[str]:
        overlap: list[str] = []
        size = 0
        for unit in reversed(units):
            if overlap and size + len(unit) > self.chunk_overlap:
                break
            overlap.insert(0, unit)
            size += len(unit) + (2 if overlap else 0)
        return overlap

    def _fixed_size_chunks(self, text: str) -> list[str]:
        chunks = []
        start = 0
        step = max(1, self.chunk_size - self.chunk_overlap)
        while start < len(text):
            chunks.append(text[start:start + self.chunk_size])
            start += step
        return chunks


text_chunker = TextChunker()
