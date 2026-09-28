"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Pin, ArrowRight } from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../data/mockData';

const CATEGORY_COLORS = {
  Company:  'bg-primary/15 text-primary',
  Learning: 'bg-blue-500/15 text-blue-400',
  Strategy: 'bg-purple-500/15 text-purple-400',
};

export default function AnnouncementsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Megaphone className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Company Updates</h3>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors group">
          View all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Announcements */}
      <div className="divide-y divide-white/5">
        {MOCK_ANNOUNCEMENTS.map((ann, idx) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.08, duration: 0.4 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors"
          >
            {/* Pinned icon */}
            {ann.pinned && (
              <Pin className="w-3.5 h-3.5 text-primary shrink-0 rotate-45" />
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${ann.pinned ? 'text-text-primary' : 'text-text-primary/80'}`}>
                {ann.title}
              </p>
              <span className="text-[10px] text-text-secondary mt-0.5">{ann.date}</span>
            </div>

            {/* Category badge */}
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              CATEGORY_COLORS[ann.category] || 'bg-white/5 text-text-secondary'
            }`}>
              {ann.category}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
