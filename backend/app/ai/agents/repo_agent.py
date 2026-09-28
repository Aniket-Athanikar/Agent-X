from app.ai.prompts.loader import load_prompt
from pathlib import Path

from app.ai.tools import filesystem_tool, git_tool, search_tool

SYSTEM_PROMPT = load_prompt("system")
REPO_PROMPT = load_prompt("repo")


class RepositoryAgent:
    def inspect(self, workspace_id: str, question: str) -> str:
        root = Path("uploads") / workspace_id / "extracted"
        if not root.is_dir():
            root = Path("uploads") / workspace_id
        files = filesystem_tool.list_files(str(root), limit=80)
        matches = search_tool.search_repository(str(root), question)
        git_summary = git_tool.summary(str(root))
        sections = ["Repository files:\n" + "\n".join(files)] if files else []
        if matches:
            sections.append("Potentially relevant files:\n" + "\n".join(matches))
        if git_summary:
            sections.append("Latest git commit: " + git_summary)
        return "\n\n".join(sections)


repository_agent = RepositoryAgent()
