/** Build a nested tree from flat file paths (from folder/zip imports). */
export function buildFileTree(paths) {
  const root = { name: "root", path: "", type: "folder", children: [] };

  for (const filePath of paths) {
    const parts = filePath.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      const fullPath = parts.slice(0, idx + 1).join("/");

      if (isFile) {
        current.children.push({
          name: part,
          path: fullPath,
          type: "file",
        });
      } else {
        let folder = current.children.find(
          (c) => c.type === "folder" && c.name === part
        );
        if (!folder) {
          folder = { name: part, path: fullPath, type: "folder", children: [] };
          current.children.push(folder);
        }
        current = folder;
      }
    });
  }

  return sortTree(root.children);
}

function sortTree(nodes) {
  return nodes
    .map((n) =>
      n.type === "folder" ? { ...n, children: sortTree(n.children) } : n
    )
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

/** Mock branches shown when a file is selected (GitHub-style). */
export const MOCK_BRANCHES = [
  { name: "main", ahead: 0, behind: 0, default: true },
  { name: "develop", ahead: 2, behind: 1, default: false },
  { name: "feature/auth-middleware", ahead: 5, behind: 0, default: false },
  { name: "fix/upload-validation", ahead: 1, behind: 2, default: false },
];

export function pathsFromFileList(fileList) {
  return Array.from(fileList).map((f) => f.webkitRelativePath || f.name);
}