from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


# ==========================================================
# TECHNOLOGY MODELS
# ==========================================================


class TechnologyInfo(BaseModel):
    """
    Generic technology detected in the repository.

    Example:
        Python
        FastAPI
        PostgreSQL
        Docker
        LangGraph
    """

    name: str
    category: str  # language | framework | database | ai | devops | tool
    version: Optional[str] = None


class FrameworkInfo(BaseModel):
    """
    Framework details.
    """

    name: str
    version: Optional[str] = None


class DependencyInfo(BaseModel):
    """
    Relationship between two repository files/modules.
    """

    source: str
    target: str

    dependency_type: str = "import"

    resolved: bool = True


# ==========================================================
# FILE MODEL
# ==========================================================


class FileKnowledge(BaseModel):
    """
    Knowledge collected for one file.
    """

    # Basic

    name: str
    path: str

    extension: str
    language: Optional[str] = None

    size: int = 0

    last_modified: Optional[float] = None

    content_hash: Optional[str] = None

    # AI

    summary: Optional[str] = None

    description: Optional[str] = None

    docstring: Optional[str] = None

    # Code

    imports: List[str] = Field(default_factory=list)

    imports_from: List[str] = Field(default_factory=list)

    exports: List[str] = Field(default_factory=list)

    classes: List[str] = Field(default_factory=list)

    methods: List[str] = Field(default_factory=list)

    functions: List[str] = Field(default_factory=list)

    variables: List[str] = Field(default_factory=list)

    constants: List[str] = Field(default_factory=list)

    apis: List[str] = Field(default_factory=list)

    dependencies: List[str] = Field(default_factory=list)


# ==========================================================
# FOLDER MODEL
# ==========================================================


class FolderKnowledge(BaseModel):
    """
    Knowledge collected for one folder.
    """

    path: str

    parent: Optional[str] = None

    summary: Optional[str] = None

    files: List[str] = Field(default_factory=list)

    folders: List[str] = Field(default_factory=list)


# ==========================================================
# REPOSITORY MODEL
# ==========================================================


class RepositoryKnowledge(BaseModel):
    """
    Complete repository knowledge base.

    This object is shared between the Repository Agent,
    RAG pipeline, architecture agent, and future AI agents.
    """

    # ------------------------------------------------------
    # Workspace
    # ------------------------------------------------------

    workspace_id: str

    root: str

    project_name: str

    # ------------------------------------------------------
    # Technologies
    # ------------------------------------------------------

    languages: List[str] = Field(default_factory=list)

    technologies: List[TechnologyInfo] = Field(default_factory=list)

    frameworks: List[FrameworkInfo] = Field(default_factory=list)

    package_managers: List[str] = Field(default_factory=list)

    databases: List[str] = Field(default_factory=list)

    ai_frameworks: List[str] = Field(default_factory=list)

    infrastructure: List[str] = Field(default_factory=list)

    # ------------------------------------------------------
    # Project Structure
    # ------------------------------------------------------

    entry_points: List[str] = Field(default_factory=list)

    entry_files: List[str] = Field(default_factory=list)

    api_routes: List[str] = Field(default_factory=list)

    config_files: List[str] = Field(default_factory=list)

    important_files: List[str] = Field(default_factory=list)

    # ------------------------------------------------------
    # Repository Contents
    # ------------------------------------------------------

    files: Dict[str, FileKnowledge] = Field(default_factory=dict)

    folders: Dict[str, FolderKnowledge] = Field(default_factory=dict)

    dependencies: List[DependencyInfo] = Field(default_factory=list)

    dependency_categories: Dict[str, List[str]] = Field(default_factory=dict)

    graph: Dict[str, dict] = Field(default_factory=dict)

    # ------------------------------------------------------
    # Git Information
    # ------------------------------------------------------

    git_branch: Optional[str] = None

    git_commit: Optional[str] = None

    # ------------------------------------------------------
    # Documentation
    # ------------------------------------------------------

    readme: Optional[str] = None

    license: Optional[str] = None

    # ------------------------------------------------------
    # AI Generated
    # ------------------------------------------------------

    project_summary: Optional[str] = None

    architecture_summary: Optional[str] = None

    execution_flow: Optional[str] = None

    # ------------------------------------------------------
    # Upload / Indexing
    # ------------------------------------------------------

    ignored_files: List[str] = Field(default_factory=list)

    unsupported_files: List[str] = Field(default_factory=list)

    # ------------------------------------------------------
    # Statistics
    # ------------------------------------------------------

    total_files: int = 0

    indexed_files: int = 0

    total_folders: int = 0

    total_lines: int = 0

    indexed_chunks: int = 0