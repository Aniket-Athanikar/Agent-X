from app.ai.prompts.loader import load_prompt


class RAGPromptBuilder:
    """Builds context-grounded prompts shared by RAG answers and streams."""

    def build(self, question: str, context: str) -> str:
        return load_prompt("rag").format(question=question, context=context)


rag_prompt_builder = RAGPromptBuilder()
