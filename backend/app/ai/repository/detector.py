from __future__ import annotations

from pathlib import Path
from typing import Iterable

from .models import (
    RepositoryFile,
    RepositoryInfo,
)


IGNORE_DIRS = {
    ".git",
    ".github",
    ".idea",
    ".vscode",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".next",
    "node_modules",
    "venv",
    ".venv",
    "env",
    "build",
    "dist",
    "target",
    "coverage",
    ".tox",
}


LANGUAGE_MAP = {
    ".py": "Python",
    ".java": "Java",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".jsx": "JavaScript",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".go": "Go",
    ".rs": "Rust",
    ".php": "PHP",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".cpp": "C++",
    ".cc": "C++",
    ".c": "C",
    ".cs": "C#",
    ".sql": "SQL",
    ".sh": "Shell",
    ".bat": "Batch",
    ".ps1": "PowerShell",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".xml": "XML",
    ".md": "Markdown",
}


ENTRY_POINTS = {
    "main.py",
    "manage.py",
    "app.py",
    "server.py",
    "run.py",
    "wsgi.py",
    "asgi.py",
    "package.json",
    "pom.xml",
    "Cargo.toml",
    "go.mod",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Dockerfile",
}


SUPPORTED_EXTENSIONS = set(LANGUAGE_MAP.keys())


class RepositoryDetector:

    def scan(
        self,
        root: str | Path,
    ) -> RepositoryInfo:

        root = Path(root).resolve()

        repo = RepositoryInfo(
            root=str(root),
        )

        for file in self._walk(root):

            relative = file.relative_to(root)

            language = self.detect_language(file)

            repo.files.append(
                RepositoryFile(
                    name=file.name,
                    path=str(relative),
                    extension=file.suffix.lower(),
                    language=language,
                    size=file.stat().st_size,
                )
            )

            if language:
                repo.languages.add(language)

            if file.name in ENTRY_POINTS:
                repo.entry_points.append(str(relative))

        repo.total_files = len(repo.files)

        return repo

    def _walk(
        self,
        root: Path,
    ) -> Iterable[Path]:

        for path in root.rglob("*"):

            if not path.is_file():
                continue

            if any(part in IGNORE_DIRS for part in path.parts):
                continue

            yield path

    def detect_language(
        self,
        file: Path,
    ) -> str | None:

        return LANGUAGE_MAP.get(
            file.suffix.lower()
        )

    def is_supported(
        self,
        file: Path,
    ) -> bool:

        return file.suffix.lower() in SUPPORTED_EXTENSIONS


repository_detector = RepositoryDetector()