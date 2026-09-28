"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Bot,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import AppShell from "@/dashboard/AppShell";
import { useWorkspaceOverview } from "@/dashboard/hooks/useWorkspaceOverview";
import { useSelector } from "react-redux";
import { uploadProjectDocument } from "@/services/workspaceApi";

export default function WorkspaceClient() {
  return (
    <AppShell>
      <WorkspaceContent />
    </AppShell>
  );
}

function WorkspaceContent() {
  const { refresh } = useWorkspaceOverview();
  const searchParams = useSearchParams();
  const fileRef = useRef(null);

  const projects = useSelector((s) => s.dashboard?.projects || []);
  const currentProject = useSelector((s) => s.dashboard?.currentProject);
  const currentProjectId = useSelector((s) => s.dashboard?.currentProjectId);
  const recentDocuments = useSelector((s) => s.dashboard.recentDocuments);
  const usage = useSelector((s) => s.dashboard?.workspaceUsage);

  const [activeProjectId, setActiveProjectId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fromQuery = searchParams.get("project");
    if (fromQuery) {
      setActiveProjectId(Number(fromQuery));
    } else if (currentProjectId) {
      setActiveProjectId(currentProjectId);
    } else if (projects[0]?.id) {
      setActiveProjectId(projects[0].id);
    }
  }, [searchParams, currentProjectId, projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeProjectId) return;
    setUploading(true);
    setMessage("");
    try {
      await uploadProjectDocument(activeProjectId, file);
      setMessage(`Uploaded ${file.name} successfully.`);
      await refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-cyan-400" />
              Workspace
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {activeProject ? activeProject.name : currentProject || "Select a project"}
            </p>
          </div>

          {projects.length > 1 && (
            <select
              value={activeProjectId || ""}
              onChange={(e) => setActiveProjectId(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0f261e]">
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
            {message}
          </div>
        )}

        {usage && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Uploads", value: usage.total_uploads, icon: UploadCloud },
              { label: "Sessions", value: usage.total_sessions, icon: MessageSquare },
              { label: "API Calls", value: usage.total_api_calls, icon: Bot },
              { label: "Storage MB", value: (usage.storage_bytes / 1024 / 1024).toFixed(1), icon: FileText },
            ].map(({ label, value, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <Icon className="w-4 h-4 text-emerald-400 mb-2" />
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div
          onClick={() => activeProjectId && fileRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
            activeProjectId
              ? "border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5"
              : "border-white/10 opacity-50 cursor-not-allowed"
          }`}
        >
          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} disabled={!activeProjectId} />
          <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${uploading ? "animate-pulse text-emerald-400" : "text-gray-500"}`} />
          <p className="text-sm text-white font-semibold">
            {uploading ? "Uploading…" : "Drop files or click to upload"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {activeProjectId ? "Files attach to your active project" : "Create a project first"}
          </p>
        </div>

        <section>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Recent Documents
          </h2>
          {recentDocuments.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-white/10 rounded-xl">
              No documents uploaded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-white truncate">{doc.original_filename}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                    {(doc.size_bytes / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
  );
}
