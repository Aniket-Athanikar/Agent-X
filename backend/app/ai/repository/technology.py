from __future__ import annotations

import json
from pathlib import Path

from .models import RepositoryInfo


FRAMEWORK_RULES = {
    # ---------------- Python ----------------
    "fastapi": ("FastAPI", "Backend"),
    "django": ("Django", "Backend"),
    "flask": ("Flask", "Backend"),
    "sqlalchemy": ("SQLAlchemy", "Database"),
    "redis": ("Redis", "Cache"),
    "langchain": ("LangChain", "AI"),
    "langgraph": ("LangGraph", "AI"),
    "qdrant-client": ("Qdrant", "Vector Database"),
    "chromadb": ("ChromaDB", "Vector Database"),
    "pymongo": ("MongoDB", "Database"),
    "psycopg2": ("PostgreSQL", "Database"),

    # ---------------- Node ----------------
    "react": ("React", "Frontend"),
    "next": ("Next.js", "Frontend"),
    "nextjs": ("Next.js", "Frontend"),
    "vue": ("Vue", "Frontend"),
    "angular": ("Angular", "Frontend"),
    "express": ("Express", "Backend"),
    "nestjs": ("NestJS", "Backend"),

    # ---------------- Java ----------------
    "spring-boot": ("Spring Boot", "Backend"),

    # ---------------- Go ----------------
    "gin": ("Gin", "Backend"),
    "fiber": ("Fiber", "Backend"),
    "echo": ("Echo", "Backend"),

    # ---------------- AI ----------------
    "ollama": ("Ollama", "LLM"),
    "openai": ("OpenAI", "LLM"),
    "transformers": ("Transformers", "AI"),
    "sentence-transformers": ("Sentence Transformers", "Embeddings"),
}


class TechnologyAnalyzer:

    def analyze(
        self,
        repo: RepositoryInfo,
    ) -> RepositoryInfo:

        technologies = {}

        root = Path(repo.root)

        self._scan_requirements(root, technologies)
        self._scan_package_json(root, technologies)
        self._scan_go_mod(root, technologies)
        self._scan_pom(root, technologies)
        self._scan_cargo(root, technologies)

        repo.technologies = sorted(
            technologies.values(),
            key=lambda x: x["name"],
        )

        return repo

    # --------------------------------------------------

    def _add(
        self,
        technologies: dict,
        key: str,
    ):

        key = key.lower()

        if key not in FRAMEWORK_RULES:
            return

        name, category = FRAMEWORK_RULES[key]

        technologies[name] = {
            "name": name,
            "category": category,
        }

    # --------------------------------------------------

    def _scan_requirements(
        self,
        root: Path,
        technologies: dict,
    ):

        file = root / "requirements.txt"

        if not file.exists():
            return

        for line in file.read_text(
            encoding="utf8",
            errors="ignore",
        ).splitlines():

            pkg = (
                line.split("==")[0]
                .split(">=")[0]
                .split("<=")[0]
                .strip()
            )

            self._add(technologies, pkg)

    # --------------------------------------------------

    def _scan_package_json(
        self,
        root: Path,
        technologies: dict,
    ):

        file = root / "package.json"

        if not file.exists():
            return

        try:
            data = json.loads(file.read_text())

            deps = {}

            deps.update(data.get("dependencies", {}))
            deps.update(data.get("devDependencies", {}))

            for pkg in deps.keys():
                self._add(technologies, pkg)

        except Exception:
            pass

    # --------------------------------------------------

    def _scan_go_mod(
        self,
        root: Path,
        technologies: dict,
    ):

        file = root / "go.mod"

        if not file.exists():
            return

        self._add(technologies, "go")

        for line in file.read_text(
            encoding="utf8",
            errors="ignore",
        ).splitlines():

            self._add(
                technologies,
                line.strip().split()[0],
            )

    # --------------------------------------------------

    def _scan_pom(
        self,
        root: Path,
        technologies: dict,
    ):

        file = root / "pom.xml"

        if not file.exists():
            return

        text = file.read_text(
            encoding="utf8",
            errors="ignore",
        ).lower()

        if "spring-boot" in text:
            self._add(
                technologies,
                "spring-boot",
            )

    # --------------------------------------------------

    def _scan_cargo(
        self,
        root: Path,
        technologies: dict,
    ):

        file = root / "Cargo.toml"

        if not file.exists():
            return

        technologies["Rust"] = {
            "name": "Rust",
            "category": "Language",
        }


technology_analyzer = TechnologyAnalyzer()