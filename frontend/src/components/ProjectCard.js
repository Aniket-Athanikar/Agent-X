"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, ArrowRight, Clock, FileText } from "lucide-react";

export default function ProjectCard({ project, documentCount = 0 }) {
  const statusColor =
    project.status === "active"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : "bg-amber-500/15 text-amber-400 border-amber-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl border border-white/10 bg-[#0f261e]/80 backdrop-blur-sm p-5 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-emerald-400" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${statusColor}`}>
            {project.status}
          </span>
        </div>

        <h3 className="text-base font-bold text-white mb-1 truncate">{project.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-4">
          {project.description || "No description yet."}
        </p>

        <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {documentCount} files
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}
          </span>
        </div>

        <Link
          href={`/workspace?project=${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Open workspace
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}