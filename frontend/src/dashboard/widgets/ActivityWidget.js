"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitMerge, Eye, Rocket, MessageCircle } from 'lucide-react';
import { MOCK_ACTIVITY } from '../data/mockData';

const TYPE_ICONS = {
  commit:    { icon: GitCommit,     bg: 'bg-emerald-500/15', color: 'text-emerald-400' },
  pr_merged: { icon: GitMerge,      bg: 'bg-purple-500/15',  color: 'text-purple-400' },
  review:    { icon: Eye,           bg: 'bg-blue-500/15',    color: 'text-blue-400' },
  deploy:    { icon: Rocket,        bg: 'bg-orange-500/15',  color: 'text-orange-400' },
  comment:   { icon: MessageCircle, bg: 'bg-cyan-500/15',    color: 'text-cyan-400' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export default function ActivityWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
        <span className="text-xs text-text-secondary">Today</span>
      </div>

      {/* Timeline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative px-5 py-3"
      >
        {/* Vertical line */}
        <div className="absolute left-[33px] top-5 bottom-5 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {MOCK_ACTIVITY.map((activity) => {
          const config = TYPE_ICONS[activity.type] || TYPE_ICONS.commit;
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              variants={item}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="relative flex items-start gap-3.5 py-3 rounded-lg px-1 transition-colors cursor-default"
            >
              {/* Icon */}
              <div className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary leading-snug">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-text-secondary border border-white/5">
                    {activity.repo}
                  </span>
                  <span className="text-[10px] text-text-secondary/60">·</span>
                  <span className="text-[10px] text-text-secondary/60">{activity.user}</span>
                  <span className="text-[10px] text-text-secondary/60">·</span>
                  <span className="text-[10px] text-text-secondary/60">{activity.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
