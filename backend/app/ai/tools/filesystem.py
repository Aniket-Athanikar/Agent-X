from pathlib import Path


class FileSystemTool:
    def list_files(self, root: str, limit: int = 200) -> list[str]:
        root_path = Path(root)
        if not root_path.is_dir():
            return []
        return [path.relative_to(root_path).as_posix() for path in root_path.rglob("*") if path.is_file()][:limit]

    def find_text(self, root: str, query: str, limit: int = 20) -> list[str]:
        matches = []
        for path in Path(root).rglob("*"):
            if not path.is_file() or path.suffix.lower() not in {".py", ".js", ".ts", ".tsx", ".java", ".md"}:
                continue
            try:
                if query.lower() in path.read_text(encoding="utf-8", errors="ignore").lower():
                    matches.append(str(path))
            except OSError:
                continue
            if len(matches) >= limit:
                break
        return matches


filesystem_tool = FileSystemTool()
