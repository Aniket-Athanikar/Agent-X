"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, GitBranch, FileUp, Code2, Video, Workflow, ListTodo, BookOpen,
} from 'lucide-react';
import { QUICK_ACTIONS } from '../data/mockData';

const ICON_MAP = {
  Sparkles, GitBranch, FileUp, Code2, Video, Workflow, ListTodo, BookOpen,
};

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'hover:border-emerald-500/30', shadow: 'hover:shadow-emerald-500/10' },
  blue:    { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'hover:border-blue-500/30',    shadow: 'hover:shadow-blue-500/10' },
  purple:  { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'hover:border-purple-500/30',  shadow: 'hover:shadow-purple-500/10' },
  orange:  { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'hover:border-orange-500/30',  shadow: 'hover:shadow-orange-500/10' },
  rose:    { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'hover:border-rose-500/30',    shadow: 'hover:shadow-rose-500/10' },
  cyan:    { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'hover:border-cyan-500/30',    shadow: 'hover:shadow-cyan-500/10' },
  yellow:  { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'hover:border-yellow-500/30',  shadow: 'hover:shadow-yellow-500/10' },
  indigo:  { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'hover:border-indigo-500/30',  shadow: 'hover:shadow-indigo-500/10' },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function QuickActions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {QUICK_ACTIONS.map((action) => {
        const Icon = ICON_MAP[action.icon] || Sparkles;
        const colors = COLOR_MAP[action.color] || COLOR_MAP.emerald;

        return (
          <motion.button
            key={action.id}
            variants={item}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => console.log('Quick action:', action.label)}
            className={`bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-xl p-4 flex flex-col items-start gap-3 text-left transition-all duration-300 cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{action.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}