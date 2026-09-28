from app.ai.prompts.loader import load_prompt

SYSTEM_PROMPT = load_prompt("system")
PLANNING_PROMPT = load_prompt("planner")


class PlanningAgent:
    name = "planning"

    def instructions(self) -> str:
        return PLANNING_PROMPT


planning_agent = PlanningAgent()
