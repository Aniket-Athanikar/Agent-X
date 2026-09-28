import JSZip from "jszip";

const IGNORED = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage", "__pycache__", "venv", ".venv"]);
let activeWorkspaceEntries = new Map();

export function normalizeWorkspacePath(path = "") {
  return String(path).replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+/g, "/").replace(/^\.\//, "");
}

export function setActiveWorkspaceEntries(entries) {
  activeWorkspaceEntries = new Map(entries.map((entry) => {
    const path = normalizeWorkspacePath(entry.path);
    return [path, { ...entry, path }];
  }));
}

export async function readActiveWorkspaceFile(path) {
  const entry = activeWorkspaceEntries.get(normalizeWorkspacePath(path));
  if (!entry) return null;
  return readWorkspaceFile(entry);
}

export function buildWorkspaceTree(entries) {
  const root = { id: "root", name: "root", path: "", type: "folder", children: [] };
  for (const entry of entries) {
    const parts = normalizeWorkspacePath(entry.path).split("/").filter(Boolean);
    if (!parts.length || parts.some((part) => IGNORED.has(part)) || entry.path.endsWith(".pyc")) continue;
    let current = root;
    parts.forEach((name, index) => {
      const path = parts.slice(0, index + 1).join("/");
      let child = current.children.find((node) => node.name === name);
      if (!child) {
        child = { id: path, name, path, type: index === parts.length - 1 ? "file" : "folder", children: index === parts.length - 1 ? undefined : [] };
        current.children.push(child);
      }
      current = child;
    });
  }
  const sort = (nodes) => nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1)).map((node) => ({ ...node, children: node.children && sort(node.children) }));
  return sort(root.children);
}

export async function openFolderWorkspace() {
  if (!window.showDirectoryPicker) throw new Error("Your browser does not support native folder access.");
  const directory = await window.showDirectoryPicker();
  const entries = [];
  async function walk(handle, prefix = "") {
    for await (const [name, child] of handle.entries()) {
      const path = normalizeWorkspacePath(`${prefix}${name}`);
      if (IGNORED.has(name)) continue;
      if (child.kind === "directory") await walk(child, `${path}/`);
      else entries.push({ path, handle: child });
    }
  }
  await walk(directory);
  setActiveWorkspaceEntries(entries);
  return { name: directory.name, type: "folder", entries, tree: buildWorkspaceTree(entries) };
}

export async function openZipWorkspace(file) {
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter((entry) => !entry.dir).map((entry) => ({ path: entry.name, content: entry.async("string") }));
  setActiveWorkspaceEntries(entries);
  return { name: file.name.replace(/\.zip$/i, ""), type: "zip", entries, tree: buildWorkspaceTree(entries) };
}

export async function readWorkspaceFile(entry) {
  if (entry.content !== undefined && entry.content !== null) return entry.content;
  return (await entry.handle.getFile()).text();
}
