from __future__ import annotations

from pathlib import Path

from .detector import repository_detector
from .technology import technology_detector
from .dependency import dependency_analyzer
from .graph_builder import graph_builder
from .summarizer import repository_summarizer

from .models import RepositoryKnowledge


class RepositoryAnalyzer:
    """
    Main repository analysis pipeline.

    This class coordinates all repository analysis steps.

    Flow:

        Scan Repository
              ↓
        Detect Technologies
              ↓
        Analyze Dependencies
              ↓
        Build Dependency Graph
              ↓
        Generate AI Summaries
              ↓
        Return RepositoryKnowledge
    """

    async def analyze(
        self,
        workspace_id: str,
        root: str | Path,
    ) -> RepositoryKnowledge:

        root = Path(root)

        # ----------------------------------------------------
        # Step 1
        # Scan repository
        # ----------------------------------------------------

        knowledge = repository_detector.scan(
            workspace_id=workspace_id,
            root=root,
        )

        # ----------------------------------------------------
        # Step 2
        # Detect technologies
        # ----------------------------------------------------

        technology_detector.detect(
            knowledge,
        )

        # ----------------------------------------------------
        # Step 3
        # Analyze dependencies
        # ----------------------------------------------------

        dependency_analyzer.analyze(
            knowledge,
        )

        # ----------------------------------------------------
        # Step 4
        # Build repository graph
        # ----------------------------------------------------

        graph = graph_builder.build(
            knowledge,
        )

        knowledge.graph = graph

        # ----------------------------------------------------
        # Step 5
        # Generate AI summaries
        # ----------------------------------------------------

        await repository_summarizer.build(
            knowledge,
        )

        return knowledge

    async def refresh(
        self,
        knowledge: RepositoryKnowledge,
    ) -> RepositoryKnowledge:
        """
        Rebuild summaries after repository changes.
        """

        await repository_summarizer.build(
            knowledge,
        )

        return knowledge

    def architecture(
        self,
        knowledge: RepositoryKnowledge,
    ):

        return graph_builder.architecture(
            knowledge.graph
        )

    def dependents(
        self,
        knowledge: RepositoryKnowledge,
        file_path: str,
    ):

        return graph_builder.find_dependents(
            knowledge.graph,
            file_path,
        )

    def neighbours(
        self,
        knowledge: RepositoryKnowledge,
        file_path: str,
    ):

        return graph_builder.neighbours(
            knowledge.graph,
            file_path,
        )


repository_analyzer = RepositoryAnalyzer()