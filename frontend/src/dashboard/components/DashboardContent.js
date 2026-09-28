"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useAuth } from "@/services/authContext";
import ProjectCard from "@/components/ProjectCard";
import {
  FolderKanban,
  UploadCloud,
  MessageSquare,
  HardDrive,
  Plus,
  ArrowRight,
  FileText,
  Bot,
  Settings,
  RefreshCw,
  Sparkles,
  CreditCard,
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}

export default function DashboardContent({ onRefresh, loading }) {
  const { user } = useAuth();
  const projects = useSelector((s) => s.dashboard?.projects || []);
  const usage = useSelector((s) => s.dashboard?.workspaceUsage);
  const recentDocuments = useSelector((s) => s.dashboard.recentDocuments);
  const recentSessions = useSelector((s) => s.dashboard?.recentSessions || []);
  const agents = useSelector((s) => s.dashboard?.agents || []);
  const currentProject = useSelector((s) => s.dashboard?.currentProject);
  const error = useSelector((s) => s.dashboard?.workspaceError);

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const storageMb = usage ? (usage.storage_bytes / 1024 / 1024).toFixed(1) : "0";

  const quickActions = [
    { href: "/project", label: "New Project", icon: Plus, accent: "bg-emerald-500 text-black" },
    { href: "/workspace", label: "Upload Files", icon: UploadCloud, accent: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25" },
    { href: "/settings", label: "Billing & Usage", icon: CreditCard, accent: "bg-violet-500/15 text-violet-400 border border-violet-500/25" },
    { href: "/settings", label: "Settings", icon: Settings, accent: "bg-white/5 text-gray-300 border border-white/10" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#0f261e]/90 via-[#081a14]/80 to-[#030712]/90 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              AgentForge Command Center
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              {currentProject
                ? `Active project: ${currentProject}. Manage uploads, agents, and sessions from your workspace.`
                : "Create your first project to unlock uploads, AI agents, and workspace sessions."}
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:text-white hover:border-emerald-500/30 transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} color="bg-emerald-500/15 text-emerald-400" />
        <StatCard label="Uploads" value={usage?.total_uploads ?? 0} icon={UploadCloud} color="bg-cyan-500/15 text-cyan-400" />
        <StatCard label="Sessions" value={usage?.total_sessions ?? 0} icon={MessageSquare} color="bg-violet-500/15 text-violet-400" />
        <StatCard label="Storage (MB)" value={storageMb} icon={HardDrive} color="bg-amber-500/15 text-amber-400" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${action.accent}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {action.label}
            </Link>
          );
        })}
      </div>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-400" />
            Your Projects
          </h2>
          <Link href="/project" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">No projects yet. Start by creating one.</p>
            <Link href="/project" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-bold">
              <Plus className="w-4 h-4" /> Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                documentCount={project.document_count ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* Activity grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Recent Documents
          </h3>
          {recentDocuments.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No uploads yet. Go to Workspace to upload files.</p>
          ) : (
            <ul className="space-y-2">
              {recentDocuments.slice(0, 5).map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-sm text-white truncate">{doc.original_filename}</span>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                    {(doc.size_bytes / 1024).toFixed(0)} KB
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Recent Sessions
          </h3>
          {recentSessions.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No sessions started yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentSessions.slice(0, 5).map((session) => (
                <li key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-sm text-white truncate">{session.title}</span>
                  <span className="text-[10px] text-emerald-400 capitalize shrink-0 ml-2">{session.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Agents strip */}
      {agents.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            Active Agents
          </h3>
          <div className="flex flex-wrap gap-2">
            {agents.slice(0, 6).map((agent) => (
              <span
                key={agent.id}
                className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300"
              >
                {agent.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
