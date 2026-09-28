import asyncio
import importlib
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch


class RAGCoreTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with patch("qdrant_client.QdrantClient") as client:
            client.return_value.get_collections.return_value = SimpleNamespace(collections=[])
            cls.pipeline_module = importlib.import_module("app.ai.rag.pipeline")

    def test_python_chunks_keep_class_methods_together(self):
        chunker = self.pipeline_module.text_chunker.__class__(chunk_size=140, chunk_overlap=20)
        chunks = chunker.chunk(
            "class Service:\n    def first(self):\n        return 1\n\n    def second(self):\n        return 2\n\ndef helper():\n    return 3\n",
            language="python",
        )
        self.assertEqual(2, len(chunks))
        self.assertIn("def first", chunks[0]["text"])
        self.assertIn("def second", chunks[0]["text"])
        self.assertIn("def helper", chunks[1]["text"])

    def test_prompt_preserves_active_file_priority(self):
        from app.ai.prompts import rag_prompt_builder

        prompt = rag_prompt_builder.build("What is missing?", "No matching details.")
        self.assertIn("ACTIVE FILE is the primary source", prompt)

    def test_prompt_adapts_explanation_style_to_the_question(self):
        from app.ai.prompts import rag_prompt_builder

        prompt = rag_prompt_builder.build("Explain this code line by line.", "def greet(name): return name")
        self.assertIn("infer what the user needs", prompt)
        self.assertIn("line-by-line request", prompt)
        self.assertIn("ASCII diagram", prompt)
        self.assertIn("Do not mention retrieval, embeddings, Qdrant, RAG", prompt)

    def test_prompt_keeps_markdown_formatting_functional(self):
        from app.ai.prompts import rag_prompt_builder

        prompt = rag_prompt_builder.build("What does this file do?", "def greet(name): return name")
        self.assertIn("Never use Markdown bold markers", prompt)
        self.assertIn("literal `svg` text", prompt)
        self.assertIn("code blocks, useful lists, and simple ASCII diagrams", prompt)

    def test_answer_cleanup_removes_decorative_formatting_but_preserves_code(self):
        from app.ai.rag.generator import clean_answer_formatting

        answer = "**IndexView** handles the homepage.\n\nsvg\n\n```python\nlabel = '**keep this**'\n```\n"
        self.assertEqual(
            "IndexView handles the homepage.\n\n```python\nlabel = '**keep this**'\n```",
            clean_answer_formatting(answer),
        )

    def test_pipeline_batches_and_uses_deterministic_ids(self):
        pipeline = self.pipeline_module.RAGPipeline.__new__(self.pipeline_module.RAGPipeline)
        qdrant = Mock()
        qdrant.file_is_current.return_value = False
        embedding = SimpleNamespace(embed_batch=AsyncMock(return_value=[[0.1] * 768]))

        with tempfile.TemporaryDirectory() as temporary_directory, \
             patch.object(self.pipeline_module, "qdrant_service", qdrant), \
             patch.object(self.pipeline_module, "embedding_service", embedding):
            source = Path(temporary_directory) / "example.txt"
            source.write_text("AgentForge local RAG test document.", encoding="utf-8")
            result = asyncio.run(pipeline.index_document(str(source), "workspace-a"))

        self.assertEqual("workspace-a", result["workspace_id"])
        self.assertEqual(1, result["chunks"])
        qdrant.add_documents.assert_called_once()
        point_ids = qdrant.add_documents.call_args.kwargs["point_ids"]
        self.assertEqual(point_ids[0], qdrant.add_documents.call_args.kwargs["metadata_list"][0]["chunk_id"])


if __name__ == "__main__":
    unittest.main()
