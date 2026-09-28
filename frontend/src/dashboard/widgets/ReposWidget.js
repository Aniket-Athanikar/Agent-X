"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GitFork, Star, Clock, CheckCircle, XCircle, FileCode, GitBranch } from 'lucide-react';
import { MOCK_REPOS } from '../data/mockData';
import { useDashboard } from '../hooks/useDashboard';

const LANG_COLORS = {
  Python:     'bg-blue-400',
  TypeScript: 'bg-cyan-400',
  Go:         'bg-teal-400',
  Rust:       'bg-orange-400',
  JavaScript: 'bg-yellow-400',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ReposWidget() {
  const { selectRepo } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-text-primary">Repositories</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-cyan/15 text-accent-cyan">
            {MOCK_REPOS.length}
          </span>
        </div>
        <GitFork className="w-4 h-4 text-text-secondary/40" />
      </div>

      {/* Repo list */}
      <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-white/5">
        {MOCK_REPOS.map((repo) => (
          <motion.div
            key={repo.name}
            variants={item}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            onClick={() => selectRepo(repo)}
            className="px-5 py-4 cursor-pointer group transition-all duration-300 hover:border-l-2 hover:border-l-primary/40"
          >
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2">
              <GitFork className="w-4 h-4 text-text-secondary/60 shrink-0" />
              <span className="font-mono text-sm font-semibold text-primary group-hover:text-primary/90 truncate">
                {repo.name}
              </span>
              <span className={`ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                repo.status === 'passing'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              }`}>
                {repo.status === 'passing' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {repo.status}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${LANG_COLORS[repo.lang] || 'bg-gray-400'}`} />
                {repo.lang}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <FileCode className="w-3 h-3" />
                {repo.files}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {repo.branch}
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" />
                {repo.lastCommit}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
