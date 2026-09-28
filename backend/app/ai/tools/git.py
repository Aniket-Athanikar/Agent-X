import subprocess
from pathlib import Path


class GitTool:
    def summary(self, root: str) -> str | None:
        if not (Path(root) / ".git").is_dir():
            return None
        result = subprocess.run(["git", "-C", root, "log", "-1", "--oneline"], capture_output=True, text=True, timeout=5)
        return result.stdout.strip() or None


git_tool = GitTool()
