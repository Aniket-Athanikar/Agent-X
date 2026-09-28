from __future__ import annotations

from collections import defaultdict
from typing import Dict, List

from .models import RepositoryKnowledge


class RepositoryGraphBuilder:
    """
    Builds an in-memory dependency graph for the repository.

    Nodes:
        - files
        - folders

    Edges:
        imports
        contains
        belongs_to
    """

    def build(
        self,
        knowledge: RepositoryKnowledge,
    ) -> dict:

        graph = {
            "nodes": {},
            "edges": defaultdict(list),
        }

        self._add_folders(graph, knowledge)
        self._add_files(graph, knowledge)
        self._add_folder_relationships(graph, knowledge)
        self._add_import_relationships(graph, knowledge)

        return graph

    # ---------------------------------------------------------
    # Folder Nodes
    # ---------------------------------------------------------

    def _add_folders(
        self,
        graph: dict,
        knowledge: RepositoryKnowledge,
    ):

        for folder in knowledge.folders.values():

            graph["nodes"][folder.path] = {
                "type": "folder",
                "summary": folder.summary,
            }

    # ---------------------------------------------------------
    # File Nodes
    # ---------------------------------------------------------

    def _add_files(
        self,
        graph: dict,
        knowledge: RepositoryKnowledge,
    ):

        for file in knowledge.files.values():

            graph["nodes"][file.path] = {
                "type": "file",
                "language": file.language,
                "summary": file.summary,
            }

    # ---------------------------------------------------------
    # Folder -> File
    # ---------------------------------------------------------

    def _add_folder_relationships(
        self,
        graph: dict,
        knowledge: RepositoryKnowledge,
    ):

        for folder in knowledge.folders.values():

            for file_path in folder.files:

                graph["edges"][folder.path].append(
                    {
                        "target": file_path,
                        "type": "contains",
                    }
                )

                graph["edges"][file_path].append(
                    {
                        "target": folder.path,
                        "type": "belongs_to",
                    }
                )

    # ---------------------------------------------------------
    # File -> File Imports
    # ---------------------------------------------------------

    def _add_import_relationships(
        self,
        graph: dict,
        knowledge: RepositoryKnowledge,
    ):

        file_paths = set(knowledge.files.keys())

        for file in knowledge.files.values():

            for imported in file.imports:

                matches = [
                    path
                    for path in file_paths
                    if path.endswith(imported.replace(".", "/") + ".py")
                    or path.endswith(imported + ".py")
                ]

                for match in matches:

                    graph["edges"][file.path].append(
                        {
                            "target": match,
                            "type": "imports",
                        }
                    )

    # ---------------------------------------------------------
    # Helpers
    # ---------------------------------------------------------

    def neighbours(
        self,
        graph: dict,
        node: str,
    ) -> List[dict]:

        return graph["edges"].get(node, [])

    def find_dependents(
        self,
        graph: dict,
        target: str,
    ) -> List[str]:

        dependents = []

        for source, edges in graph["edges"].items():

            for edge in edges:

                if (
                    edge["type"] == "imports"
                    and edge["target"] == target
                ):
                    dependents.append(source)

        return dependents

    def architecture(
        self,
        graph: dict,
    ) -> Dict:

        folders = []
        files = []

        for node, info in graph["nodes"].items():

            if info["type"] == "folder":
                folders.append(node)

            else:
                files.append(node)

        return {
            "folders": sorted(folders),
            "files": sorted(files),
            "relationships": dict(graph["edges"]),
        }


graph_builder = RepositoryGraphBuilder()