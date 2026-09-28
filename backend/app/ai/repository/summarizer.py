from __future__ import annotations

from app.ai.llm import ollama_service

from .models import (
    RepositoryKnowledge,
    FileKnowledge,
    FolderKnowledge,
)


class RepositorySummarizer:
    """
    Generates beginner-friendly summaries using Ollama.

    These summaries are cached inside RepositoryKnowledge
    so future chat requests become much faster.
    """

    # --------------------------------------------------------
    # Repository Summary
    # --------------------------------------------------------

    async def summarize_repository(
        self,
        repo: RepositoryKnowledge,
    ) -> str:

        prompt = f"""
You are a senior software engineer.

Explain this project to a beginner.

Project Name:
{repo.project_name}

Languages:
{", ".join(repo.languages)}

Frameworks:
{", ".join(repo.frameworks)}

Databases:
{", ".join(repo.databases)}

AI Frameworks:
{", ".join(repo.ai_frameworks)}

Infrastructure:
{", ".join(repo.infrastructure)}

Entry Points:
{", ".join(repo.entry_points)}

Explain:

1. What this project does.
2. Why it exists.
3. Overall architecture.
4. Main workflow.
5. Major folders.
6. Keep it under 250 words.
7. Use simple English.
"""

        summary = await ollama_service.generate(prompt)

        repo.project_summary = summary.strip()

        return repo.project_summary

    # --------------------------------------------------------
    # Folder Summary
    # --------------------------------------------------------

    async def summarize_folder(
        self,
        folder: FolderKnowledge,
    ) -> str:

        prompt = f"""
Explain what this folder is responsible for.

Folder:

{folder.path}

Files:

{chr(10).join(folder.files)}

Write for a junior developer.

Maximum 100 words.
"""

        summary = await ollama_service.generate(prompt)

        folder.summary = summary.strip()

        return folder.summary

    # --------------------------------------------------------
    # File Summary
    # --------------------------------------------------------

    async def summarize_file(
        self,
        file: FileKnowledge,
    ) -> str:

        prompt = f"""
Explain this source file.

Filename:
{file.name}

Language:
{file.language}

Classes:
{", ".join(file.classes)}

Functions:
{", ".join(file.functions)}

Imports:
{", ".join(file.imports)}

API Endpoints:
{", ".join(file.apis)}

Explain:

• Purpose

• Responsibilities

• How other files use it

Maximum 120 words.

Use beginner-friendly English.
"""

        summary = await ollama_service.generate(prompt)

        file.summary = summary.strip()

        return file.summary

    # --------------------------------------------------------
    # Generate Everything
    # --------------------------------------------------------

    async def build(
        self,
        repo: RepositoryKnowledge,
    ) -> RepositoryKnowledge:

        await self.summarize_repository(repo)

        for folder in repo.folders.values():
            await self.summarize_folder(folder)

        for file in repo.files.values():
            await self.summarize_file(file)

        return repo


repository_summarizer = RepositorySummarizer()