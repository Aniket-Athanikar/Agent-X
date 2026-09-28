import asyncio
import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch


class FileCapabilityTests(unittest.TestCase):
    def test_representative_languages_are_read_detected_and_chunked(self):
        from app.ai.parsers import parse_document
        from app.ai.rag.chunker import TextChunker

        samples = {
            "example.py": "def greet():\n    return 'hello'\n",
            "example.js": "export function greet() { return 'hello'; }\n",
            "example.ts": "export const greet = (): string => 'hello';\n",
            "example.html": "<main><h1>Hello</h1></main>\n",
            "example.css": ".title { color: red; }\n",
            "Example.java": "class Example { static void main() {} }\n",
            "example.cpp": "int main() { return 0; }\n",
            "example.go": "package main\nfunc main() {}\n",
            "example.rs": "fn main() {}\n",
            "example.php": "<?php echo 'hello';\n",
            "example.sql": "SELECT * FROM users;\n",
            "example.json": '{"name":"Agent-X"}\n',
            "example.yaml": "name: Agent-X\n",
            "README.md": "# Guide\n\nReadable document.\n",
            "example.sh": "#!/bin/sh\necho hello\n",
            "Dockerfile": "FROM python:3.12\nRUN echo hello\n",
            "Makefile": "build:\n\techo hello\n",
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name, content in samples.items():
                path = root / name
                path.write_text(content, encoding="utf-8")
                document = parse_document(str(path), directory)
                self.assertEqual(content.replace("\r\n", "\n"), document.text)
                self.assertNotEqual("document", document.language)
                chunks = TextChunker(chunk_size=80, chunk_overlap=10).chunk(document.text, document.language, document.metadata)
                self.assertTrue(chunks)
                self.assertEqual(1, chunks[0]["metadata"]["line_start"])
                self.assertIn("line_end", chunks[0]["metadata"])

    def test_binary_and_oversized_files_are_not_supported(self):
        from app.ai.parsers import is_supported_text_file
        with tempfile.TemporaryDirectory() as directory:
            binary = Path(directory) / "disguised.py"
            binary.write_bytes(b"\x00\x01\x02")
            self.assertFalse(is_supported_text_file(binary))

    def test_active_file_content_is_in_prompt_context(self):
        from app.ai.rag.generator import RAGGenerator
        active = {"file_name": "example.js", "file_path": "src/example.js", "language": "javascript", "content": "export const actualSource = 42;"}
        with patch("app.ai.rag.generator.retriever.retrieve", new=AsyncMock(return_value=[])), \
             patch("app.ai.rag.generator.coordinator_agent.collect_context", return_value=""):
            _, prompt = asyncio.run(RAGGenerator._retrieve_prompt("Explain this file", 3, "test", active))
        self.assertIn("src/example.js", prompt)
        self.assertIn("actualSource = 42", prompt)
        self.assertIn("Language: javascript", prompt)

