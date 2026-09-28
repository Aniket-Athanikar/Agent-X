from app.ai.tools.filesystem import filesystem_tool


class SearchTool:
    def search_repository(self, root: str, query: str) -> list[str]:
        return filesystem_tool.find_text(root, query)


search_tool = SearchTool()
