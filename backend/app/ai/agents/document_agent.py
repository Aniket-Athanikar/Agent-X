from app.ai.prompts.loader import load_prompt

SYSTEM_PROMPT = load_prompt("system")
DOCUMENT_PROMPT = load_prompt("document")


class DocumentAgent:
    name = "document"

    def instructions(self) -> str:
        return DOCUMENT_PROMPT


document_agent = DocumentAgent()
