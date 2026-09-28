"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  GitBranch,
  MessageSquare,
  Pin,
} from "lucide-react";
import {
  toggleFolderExpanded,
  selectFile,
  setFileBranches,
  setActiveBranch,
  selectChat,
  deleteChat,
  attachFileToActiveChat,
} from "../store/dashboardSlice";
import { MOCK_BRANCHES } from "../utils/fileTree";
import { normalizeWorkspacePath, readActiveWorkspaceFile } from "@/services/localWorkspace";

const languageFor = (path) => {
  const name = path.split("/").pop()?.toLowerCase() || "";
  const special = { dockerfile: "dockerfile", makefile: "makefile", jenkinsfile: "jenkins", "cmakelists.txt": "cmake" };
  const languages = { py:"python", js:"javascript", jsx:"javascript", mjs:"javascript", cjs:"javascript", ts:"typescript", tsx:"typescript", java:"java", c:"c", h:"c", cpp:"cpp", cc:"cpp", hpp:"cpp", cs:"csharp", go:"go", rs:"rust", php:"php", rb:"ruby", kt:"kotlin", swift:"swift", dart:"dart", scala:"scala", r:"r", m:"matlab", mm:"objective-cpp", lua:"lua", pl:"perl", ex:"elixir", exs:"elixir", clj:"clojure", fs:"fsharp", fsx:"fsharp", vb:"visual-basic", sql:"sql", sh:"shell", bash:"shell", ps1:"powershell", html:"html", htm:"html", css:"css", scss:"scss", sass:"sass", less:"less", vue:"vue", svelte:"svelte", json:"json", yaml:"yaml", yml:"yaml", xml:"xml", toml:"toml", ini:"ini", cfg:"ini", conf:"config", md:"markdown", markdown:"markdown", rst:"restructuredtext", csv:"csv", txt:"text" };
  return special[name] || languages[name.split(".").pop()] || "text";
};

function FileTreeNode({ node, depth = 0 }) {
  const dispatch = useDispatch();
  const selectedFile = useSelector((s) => s.dashboard?.selectedFile);
  const expandedFolders = useSelector((s) => s.dashboard?.expandedFolders ?? {});

  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders[node.path] ?? depth < 2;
  const isSelected = normalizeWorkspacePath(selectedFile?.path) === normalizeWorkspacePath(node.path);

  const handleClick = async () => {
    if (isFolder) {
      dispatch(toggleFolderExpanded(node.path));
    } else {
      const content = await readActiveWorkspaceFile(node.path);
      dispatch(selectFile({
        name: node.name,
        path: normalizeWorkspacePath(node.path),
        type: node.type,
        language: languageFor(node.path),
        content: typeof content === "string" ? content.slice(0, 100_000) : "",
      }));
      dispatch(setFileBranches(MOCK_BRANCHES));
      dispatch(attachFileToActiveChat({ name: node.name, path: node.path, type: "code" }));
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        draggable={!isFolder}
        onDragStart={(e) => {
          if (!isFolder) {
            e.dataTransfer.setData("application/agent-x-file", JSON.stringify(node));
            e.dataTransfer.effectAllowed = "copy";
          }
        }}
        className={`w-full flex items-center gap-1 py-1 pr-2 text-left text-[13px] transition-colors cursor-pointer group border-l-2 ${
          isSelected && !isFolder
            ? "bg-cyan-500/10 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-[#e6edf3]"
        }`}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {isFolder ? (
          isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-cyan-400 opacity-80" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-cyan-400 opacity-80" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 shrink-0 text-cyan-400/80 group-hover:text-cyan-300" />
          ) : (
            <Folder className="w-4 h-4 shrink-0 text-cyan-400/80 group-hover:text-cyan-300" />
          )
        ) : (
          <File className="w-4 h-4 shrink-0 text-emerald-400/80 group-hover:text-emerald-300" />
        )}
        <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">{node.name}</span>
      </button>
      {isFolder && isExpanded &&
        node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
    </>
  );
}
 
function ChatListPanel() {
  const dispatch = useDispatch();
  const chats = useSelector((s) => s.dashboard?.chats ?? []);
  const activeChatId = useSelector((s) => s.dashboard?.activeChatId);
 
  return (
    <div className="flex-1 overflow-y-auto py-1">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => dispatch(selectChat(chat.id))}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors cursor-pointer border-l-2 ${
            activeChatId === chat.id
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-400"
              : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-[#e6edf3]"
          }`}
        >
          {chat.pinned ? (
            <Pin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60 text-cyan-400" />
          )}
          <span className="truncate">{chat.title}</span>
        </button>
      ))}
    </div>
  );
}
 
function BranchPanel() {
  const dispatch = useDispatch();
  const selectedFile = useSelector((s) => s.dashboard?.selectedFile);
  const fileBranches = useSelector((s) => s.dashboard?.fileBranches ?? []);
  const activeBranch = useSelector((s) => s.dashboard?.activeBranch ?? "main");
 
  if (!selectedFile) return null;
 
  return (
    <div className="border-t border-cyan-500/10 bg-black/10 shrink-0">
      <div className="px-3 py-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400">
        <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
        Branches — {selectedFile.name}
      </div>
      <div className="max-h-[180px] overflow-y-auto pb-2">
        {fileBranches.map((branch) => (
          <button
            key={branch.name}
            onClick={() => dispatch(setActiveBranch(branch.name))}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${
              activeBranch === branch.name
                ? "bg-emerald-500/10 text-[#10B981] font-bold"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-[#e6edf3]"
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <GitBranch className="w-3 h-3 shrink-0 text-[#10B981]" />
              {branch.name}
              {branch.default && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider font-bold">default</span>
              )}
            </span>
            {(branch.ahead > 0 || branch.behind > 0) && (
              <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                {branch.ahead > 0 && `↑${branch.ahead}`}
                {branch.behind > 0 && ` ↓${branch.behind}`}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ExplorerSidebar() {
  const sidebarPanel = useSelector((s) => s.dashboard?.sidebarPanel ?? "explorer");
  const fileTree = useSelector((s) => s.dashboard?.fileTree ?? []);
  const projectLoaded = useSelector((s) => s.dashboard?.projectLoaded ?? false);
  const projectName = useSelector((s) => s.dashboard?.projectName ?? "");
  const expandedFolders = useSelector((s) => s.dashboard?.expandedFolders ?? {});
  const selectedFile = useSelector((s) => s.dashboard?.selectedFile ?? null);

  useEffect(() => {
    if (!projectLoaded) return;
    const saved = localStorage.getItem("agent_x_workspace_session") || localStorage.getItem("agentforge_workspace_session");
    if (!saved) return;
    try {
      localStorage.setItem("agent_x_workspace_session", JSON.stringify({
        ...JSON.parse(saved),
        expanded: expandedFolders,
        selectedFile,
      }));
    } catch {}
  }, [expandedFolders, projectLoaded, selectedFile]);

  const panelTitle =
    sidebarPanel === "chats" ? "Chats" : sidebarPanel === "billing" ? "Billing" : "Explorer";

  return (
    <aside className="w-[260px] h-full bg-[#0d1117] border-r border-white/[0.06] flex flex-col shrink-0 overflow-hidden">
      <div className="flex flex-col h-full w-full">
        <div className="h-14 px-4 flex items-center text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400 border-b border-cyan-500/10 shrink-0 select-none">
          {panelTitle}
        </div>

        {sidebarPanel === "chats" ? (
          <ChatListPanel />
        ) : (
          <>
            {projectLoaded && (
              <div className="px-3 py-2 text-[12px] text-[#8b949e] border-b border-white/[0.06] truncate shrink-0">
                {projectName || "Project"}
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-1 min-h-0">
              {!projectLoaded ? (
                <p className="px-3 py-4 text-[12px] text-[#8b949e]/60 italic">
                  Open a project to see files
                </p>
              ) : fileTree.length === 0 ? (
                <p className="px-3 py-4 text-[12px] text-[#8b949e]/60 italic">
                  No files in project
                </p>
              ) : (
                fileTree.map((node) => <FileTreeNode key={node.path} node={node} />)
              )}
            </div>

            <BranchPanel />
          </>
        )}
      </div>
    </aside>
  );
}
