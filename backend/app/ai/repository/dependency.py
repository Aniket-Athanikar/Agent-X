from __future__ import annotations

import json
from pathlib import Path
from typing import Dict

from .models import RepositoryKnowledge


# ==========================================================
# Dependency Categories
# ==========================================================

CATEGORY_MAP = {

    # ---------------- Backend ----------------

    "fastapi": "Backend",
    "django": "Backend",
    "flask": "Backend",
    "uvicorn": "Backend",
    "gunicorn": "Backend",

    "express": "Backend",
    "nestjs": "Backend",

    "spring-boot": "Backend",

    "gin": "Backend",
    "fiber": "Backend",
    "echo": "Backend",

    # ---------------- Database ----------------

    "sqlalchemy": "Database",
    "psycopg2": "Database",
    "pymongo": "Database",
    "motor": "Database",

    # ---------------- Cache ----------------

    "redis": "Cache",

    # ---------------- AI ----------------

    "langchain": "AI",
    "langgraph": "AI",
    "transformers": "AI",
    "sentence-transformers": "AI",
    "ollama": "AI",
    "openai": "AI",

    # ---------------- Vector ----------------

    "qdrant-client": "Vector Database",
    "chromadb": "Vector Database",
    "faiss": "Vector Database",

    # ---------------- Authentication ----------------

    "python-jose": "Authentication",
    "passlib": "Authentication",
    "bcrypt": "Authentication",
    "jwt": "Authentication",

    # ---------------- Cloud ----------------

    "boto3": "Cloud",
    "azure-storage": "Cloud",
    "google-cloud-storage": "Cloud",

    # ---------------- Testing ----------------

    "pytest": "Testing",
    "unittest": "Testing",

    "jest": "Testing",

    # ---------------- Dev ----------------

    "black": "Dev Tool",
    "ruff": "Dev Tool",
    "isort": "Dev Tool",
    "pre-commit": "Dev Tool",

    "eslint": "Dev Tool",
    "prettier": "Dev Tool",

}


class DependencyAnalyzer:

    def analyze(
        self,
        repo: RepositoryKnowledge,
    ) -> RepositoryKnowledge:

        root = Path(repo.root)

        grouped: Dict[str, list[str]] = {}

        self._requirements(root, grouped)
        self._package_json(root, grouped)
        self._go_mod(root, grouped)
        self._cargo(root, grouped)
        self._pom(root, grouped)

        repo.package_managers = self._detect_package_managers(root)

        repo.databases = grouped.get("Database", [])

        repo.ai_frameworks = grouped.get("AI", [])

        repo.infrastructure = (
            grouped.get("Cloud", [])
            + grouped.get("Cache", [])
            + grouped.get("Vector Database", [])
        )

        repo.dependency_summary = grouped

        return repo

    # -----------------------------------------------------

    def _add(
        self,
        grouped: Dict[str, list[str]],
        package: str,
    ):

        package = package.lower()

        category = CATEGORY_MAP.get(package)

        if category is None:
            category = "Others"

        grouped.setdefault(category, [])

        if package not in grouped[category]:
            grouped[category].append(package)

    # -----------------------------------------------------

    def _requirements(
        self,
        root: Path,
        grouped: Dict[str, list[str]],
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

            if pkg:
                self._add(grouped, pkg)

    # -----------------------------------------------------

    def _package_json(
        self,
        root: Path,
        grouped: Dict[str, list[str]],
    ):

        file = root / "package.json"

        if not file.exists():
            return

        try:

            data = json.loads(file.read_text())

            deps = {}

            deps.update(data.get("dependencies", {}))
            deps.update(data.get("devDependencies", {}))

            for pkg in deps:
                self._add(grouped, pkg)

        except Exception:
            pass

    # -----------------------------------------------------

    def _go_mod(
        self,
        root: Path,
        grouped: Dict[str, list[str]],
    ):

        file = root / "go.mod"

        if not file.exists():
            return

        for line in file.read_text().splitlines():

            if line.startswith("require"):
                continue

            if line.strip():
                self._add(
                    grouped,
                    line.split()[0],
                )

    # -----------------------------------------------------

    def _cargo(
        self,
        root: Path,
        grouped: Dict[str, list[str]],
    ):

        file = root / "Cargo.toml"

        if file.exists():
            grouped.setdefault(
                "Backend",
                []
            ).append("rust")

    # -----------------------------------------------------

    def _pom(
        self,
        root: Path,
        grouped: Dict[str, list[str]],
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
                grouped,
                "spring-boot",
            )

    # -----------------------------------------------------

    def _detect_package_managers(
        self,
        root: Path,
    ) -> list[str]:

        managers = []

        if (root / "requirements.txt").exists():
            managers.append("pip")

        if (root / "pyproject.toml").exists():
            managers.append("poetry")

        if (root / "package.json").exists():
            managers.append("npm")

        if (root / "pom.xml").exists():
            managers.append("maven")

        if (root / "build.gradle").exists():
            managers.append("gradle")

        if (root / "go.mod").exists():
            managers.append("go")

        if (root / "Cargo.toml").exists():
            managers.append("cargo")

        return managers


dependency_analyzer = DependencyAnalyzer()