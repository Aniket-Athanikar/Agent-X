"""Safe, centralized capability detection for repository and document ingestion."""
from pathlib import Path
from typing import Callable
import mimetypes

from app.ai.schemas.rag import ParsedDocument
from app.ai.parsers.pdf_parser import extract_pdf_text
from app.ai.parsers.docx_parser import extract_docx_text
from app.ai.parsers.txt_parser import extract_txt_text

MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024
SPECIAL_FILENAMES = {"dockerfile": "dockerfile", "makefile": "makefile", "cmakelists.txt": "cmake", "jenkinsfile": "jenkins", "readme": "text", "license": "text", "license.txt": "text"}
LANGUAGES = {
    ".py":"python", ".js":"javascript", ".jsx":"javascript", ".mjs":"javascript", ".cjs":"javascript", ".ts":"typescript", ".tsx":"typescript", ".java":"java", ".c":"c", ".h":"c", ".cpp":"cpp", ".cc":"cpp", ".cxx":"cpp", ".hpp":"cpp", ".hh":"cpp", ".cs":"csharp", ".go":"go", ".rs":"rust", ".php":"php", ".rb":"ruby", ".kt":"kotlin", ".kts":"kotlin", ".swift":"swift", ".dart":"dart", ".scala":"scala", ".r":"r", ".m":"matlab", ".mm":"objective-cpp", ".lua":"lua", ".pl":"perl", ".ex":"elixir", ".exs":"elixir", ".clj":"clojure", ".fs":"fsharp", ".fsx":"fsharp", ".vb":"visual-basic", ".sql":"sql", ".sh":"shell", ".bash":"shell", ".zsh":"shell", ".ps1":"powershell", ".html":"html", ".htm":"html", ".css":"css", ".scss":"scss", ".sass":"sass", ".less":"less", ".vue":"vue", ".svelte":"svelte", ".json":"json", ".yaml":"yaml", ".yml":"yaml", ".xml":"xml", ".toml":"toml", ".ini":"ini", ".cfg":"ini", ".conf":"config", ".env":"dotenv", ".md":"markdown", ".markdown":"markdown", ".txt":"text", ".rst":"restructuredtext", ".csv":"csv",
}
DOCUMENT_PARSERS = {".pdf": extract_pdf_text, ".docx": extract_docx_text}
SUPPORTED_TYPES = {**{extension: extract_txt_text for extension in LANGUAGES}, **DOCUMENT_PARSERS}

def detect_file(path: str | Path) -> tuple[str | None, str, str | None]:
    candidate = Path(path)
    extension = candidate.suffix.lower()
    return SPECIAL_FILENAMES.get(candidate.name.lower()) or LANGUAGES.get(extension), extension, mimetypes.guess_type(str(candidate))[0]

def is_probably_binary(path: str | Path) -> bool:
    try:
        candidate = Path(path)
        if candidate.stat().st_size > MAX_TEXT_FILE_BYTES:
            return True
        sample = candidate.read_bytes()[:8192]
    except OSError:
        return True
    if b"\x00" in sample:
        return True
    controls = sum(byte < 32 and byte not in (9, 10, 13, 12) for byte in sample)
    return bool(sample) and controls / len(sample) > 0.15

def is_supported_text_file(path: str | Path) -> bool:
    language, extension, _ = detect_file(path)
    return (language is not None or extension in DOCUMENT_PARSERS) and not is_probably_binary(path)


def get_parser(file_path: str) -> Callable[[str], str]:
    """Return the parser registered for a file path."""
    language, extension, _ = detect_file(file_path)
    if is_probably_binary(file_path):
        raise ValueError("Binary, oversized, or unreadable file")
    parser = DOCUMENT_PARSERS.get(extension) if extension in DOCUMENT_PARSERS else (extract_txt_text if language else None)
    if parser is None:
        raise ValueError(f"Unsupported file type: {extension or 'no extension'}")
    return parser


def extract_text(file_path: str) -> str:

    return get_parser(file_path)(file_path)


def parse_document(file_path: str, root_path: str | None = None) -> ParsedDocument:
    """Parse a supported file into the shared ingestion contract."""
    path = Path(file_path)
    language, extension, mime_type = detect_file(path)
    relative_path = str(path)
    if root_path:
        try:
            relative_path = path.relative_to(root_path).as_posix()
        except ValueError:
            pass

    return ParsedDocument(
        text=extract_text(str(path)),
        filename=path.name,
        path=relative_path,
        language=language or "document",
        file_type=extension.lstrip(".") or "unknown",
        metadata={"extension": extension, "mime_type": mime_type, "size_bytes": path.stat().st_size},
    )
