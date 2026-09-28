from app.ai.prompts.loader import load_prompt

SYSTEM_PROMPT = load_prompt("system")
RESEARCH_PROMPT = load_prompt("research")


class ResearchAgent:
    name = "research"

    def instructions(self) -> str:
        return RESEARCH_PROMPT


research_agent = ResearchAgent()
