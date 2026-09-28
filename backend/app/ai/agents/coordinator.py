from app.ai.prompts.loader import load_prompt
from app.ai.agents.repo_agent import repository_agent

SYSTEM_PROMPT = load_prompt("system")
COORDINATOR_PROMPT = load_prompt("coordinator")


class CoordinatorAgent:
    REPOSITORY_TERMS = ("repository", "architecture", "folder", "endpoint", "api", "function", "authentication", "database", "flow", "dependency")

    def select_agents(self, question: str) -> list[str]:
        lowered = question.lower()
        selected = ["repository"] if any(term in lowered for term in self.REPOSITORY_TERMS) else ["document"]
        if any(term in lowered for term in ("plan", "roadmap", "steps")):
            selected.append("planning")
        if any(term in lowered for term in ("research", "compare", "investigate")):
            selected.append("research")
        return selected

    def collect_context(self, workspace_id: str, question: str) -> str:
        if "repository" in self.select_agents(question):
            return repository_agent.inspect(workspace_id, question)
        return ""


coordinator_agent = CoordinatorAgent()
