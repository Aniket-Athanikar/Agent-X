from functools import lru_cache
from pathlib import Path

PROMPTS_DIR = Path(__file__).parent

@lru_cache(maxsize=None)
def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.md"

    if not path.exists():
        raise FileNotFoundError(f"Prompt '{name}' not found.")

    return path.read_text(encoding="utf-8").strip()