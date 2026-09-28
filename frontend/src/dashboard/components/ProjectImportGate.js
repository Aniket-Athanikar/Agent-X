"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FolderOpen, FileUp, FileArchive, Github, Upload } from "lucide-react";
import {
  setProjectLoaded,
  setFileTree,
  setExpandedFolders,
  completeWorkspaceSwitch,
  cancelWorkspaceSwitch,
} from "../store/dashboardSlice";
import { buildFileTree, pathsFromFileList } from "../utils/fileTree";
import { uploadRepo } from "@/services/upload";
import { normalizeWorkspacePath, openFolderWorkspace, openZipWorkspace, setActiveWorkspaceEntries } from "@/services/localWorkspace";

function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (err) {}
}

const importOptions = [
  {
    id: "folder",
    icon: FolderOpen,
    title: "Open Folder",
    description: "Select a project folder from your computer",
    accept: null,
    directory: true,
  },
  {
    id: "file",
    icon: FileUp,
    title: "Open File",
    description: "Open one or more individual files",
    accept: "*/*",
    multiple: true,
    directory: false,
  },
  {
    id: "zip",
    icon: FileArchive,
    title: "Upload ZIP",
    description: "Import a compressed project archive",
    accept: ".zip,.tar,.gz",
    directory: false,
  },
];

// Recursive helper to traverse dropped webkit directory entries
const traverseFileTree = (item, path = "") => {
  return new Promise((resolve) => {
    if (item.isFile) {
      item.file((file) => {
        file.filepath = path + item.name;
        resolve([file]);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      const readEntries = () => {
        dirReader.readEntries((entries) => {
          const promises = entries.map((entry) =>
            traverseFileTree(entry, path + item.name + "/")
          );
          Promise.all(promises).then((results) => {
            resolve(results.flat());
          });
        });
      };
      readEntries();
    } else {
      resolve([]);
    }
  });
};

export default function ProjectImportGate({ switching = false }) {
  const dispatch = useDispatch();
  const folderRef = useRef(null);
  const fileRef = useRef(null);
  const zipRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agent_x_workspace_session") || localStorage.getItem("agentforge_workspace_session");
    if (!saved) return;
    try {
      const session = JSON.parse(saved);
      // Directory handles cannot be serialized. Do not restore a tree without its source entries.
      localStorage.removeItem("agent_x_workspace_session");
      localStorage.removeItem("agentforge_workspace_session");
    } catch {
      localStorage.removeItem("agent_x_workspace_session");
      localStorage.removeItem("agentforge_workspace_session");
    }
  }, [dispatch]);

  const handleImport = async (importType, fileList) => {

    const localEntries = Array.from(fileList).map((entry) => ({
      path: normalizeWorkspacePath(entry.webkitRelativePath || entry.name),
      handle: { getFile: async () => entry },
    }));
    setActiveWorkspaceEntries(localEntries);

  try {
    const file = fileList[0];

    const result = await uploadRepo(file);

    console.log(result);
  } catch (err) {
    console.error(err);
    alert("Upload failed");
    return;
  }
    const paths = pathsFromFileList(fileList).map(normalizeWorkspacePath);
    const tree = buildFileTree(paths);
    const expanded = {};
    tree.forEach((node) => {
      if (node.type === "folder") expanded[node.path] = true;
    });

    const projectName =
      importType === "folder"
        ? paths[0]?.split("/")[0] || "Imported Project"
        : fileList[0]?.name?.replace(/\.(zip|tar|gz)$/i, "") || "Imported Project";

    dispatch(setFileTree(tree));
    dispatch(setExpandedFolders(expanded));
    dispatch(
      setProjectLoaded({
        loaded: true,
        name: projectName,
        importType,
      })
    );
    playChime();
  };

  const loadWorkspace = async (loader) => {
    try {
      const workspace = await loader();
      if (switching) dispatch(completeWorkspaceSwitch());
      const expanded = {};
      workspace.tree.forEach((node) => { if (node.type === "folder") expanded[node.path] = true; });
      dispatch(setFileTree(workspace.tree));
      dispatch(setExpandedFolders(expanded));
      dispatch(setProjectLoaded({ loaded: true, name: workspace.name, importType: workspace.type }));
      localStorage.setItem("agent_x_workspace_session", JSON.stringify({ name: workspace.name, type: workspace.type, tree: workspace.tree, expanded }));
      playChime();
    } catch (error) {
      if (error.name === "AbortError" && switching) dispatch(cancelWorkspaceSwitch());
      else if (error.name !== "AbortError") alert(error.message || "Could not open workspace");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const items = e.dataTransfer.items;
    if (!items) return;

    const filesList = [];
    const promises = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        promises.push(
          traverseFileTree(item).then((files) => {
            filesList.push(...files);
          })
        );
      }
    }

    await Promise.all(promises);

    if (filesList.length) {
      setActiveWorkspaceEntries(filesList.map((entry) => ({
        path: normalizeWorkspacePath(entry.filepath || entry.name),
        handle: { getFile: async () => entry },
      })));
      const paths = filesList.map((f) => normalizeWorkspacePath(f.filepath || f.name));
      const tree = buildFileTree(paths);
      const expanded = {};
      tree.forEach((node) => {
        if (node.type === "folder") expanded[node.path] = true;
      });

      const projectName = filesList[0]?.filepath?.split("/")[0] || "Dragged Project";

      dispatch(setFileTree(tree));
      dispatch(setExpandedFolders(expanded));
      dispatch(
        setProjectLoaded({
          loaded: true,
          name: projectName,
          importType: "folder",
        })
      );
      playChime();
    }
  };

  const refs = { folder: folderRef, file: fileRef, zip: zipRef };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col items-center justify-center px-6 py-12 transition-all duration-300 relative ${
        isDragOver ? "bg-cyan-500/5" : ""
      }`}
    >
      {isDragOver && (
        <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-cyan-400 animate-pulse pointer-events-none flex flex-col items-center justify-center gap-3 bg-[#030712]/80 backdrop-blur-sm z-50 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <Upload className="w-10 h-10 text-cyan-400 animate-bounce" />
          <p className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest">Drop folder to load workspace</p>
        </div>
      )}

      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-2xl font-semibold text-[#e6edf3] mb-2 uppercase tracking-tight font-sans">
          Open a project to get started
        </h1>
        <p className="text-sm text-[#8b949e]">
          Import a folder, file, or ZIP archive. Your project structure will appear in the sidebar like VS Code.
        </p>
      </div>

      <div className="w-full max-w-2xl grid gap-3">
        {importOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => opt.id === "folder" ? loadWorkspace(openFolderWorkspace) : refs[opt.id].current?.click()}
              className="flex items-center gap-4 w-full p-4 rounded-lg border border-white/[0.08] bg-[#161b22] hover:bg-[#1c2128] hover:border-cyan-500/30 text-left transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#21262d] flex items-center justify-center shrink-0 group-hover:bg-[#10B981]/10">
                <Icon className="w-5 h-5 text-[#8b949e] group-hover:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#e6edf3]">{opt.title}</p>
                <p className="text-xs text-[#8b949e] mt-0.5">{opt.description}</p>
              </div>
            </button>
          );
        })}

        <button
          disabled
          className="flex items-center gap-4 w-full p-4 rounded-lg border border-white/[0.04] bg-[#161b22]/50 text-left opacity-50 cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-lg bg-[#21262d] flex items-center justify-center shrink-0">
            <Github className="w-5 h-5 text-[#8b949e]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#e6edf3]">Clone from GitHub</p>
            <p className="text-xs text-[#8b949e] mt-0.5">Coming soon — connect a repository URL</p>
          </div>
        </button>
      </div>

      <input
        ref={folderRef}
        type="file"
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleImport("folder", e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleImport("file", e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={zipRef}
        type="file"
        accept=".zip,.tar,.gz"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) loadWorkspace(() => openZipWorkspace(e.target.files[0]));
          e.target.value = "";
        }}
      />
    </div>
  );
}
