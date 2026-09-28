"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';

const PROGRESS = 78;
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_OFFSET = CIRCUMFERENCE - (PROGRESS / 100) * CIRCUMFERENCE;

export default function LearningWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="glass-card rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <BookOpen className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-sm font-semibold text-text-primary">Learning Progress</h3>
      </div>

      {/* Progress ring + info */}
      <div className="flex items-center gap-5">
        {/* SVG ring */}
        <div className="relative w-24 h-24 shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            {/* Progress arc */}
            <motion.circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="url(#learningGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: STROKE_OFFSET }}
              transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="learningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xl font-bold text-gradient"
            >
              {PROGRESS}%
            </motion.span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary mb-1">Advanced RLHF Techniques</p>
          <p className="text-xs text-text-secondary mb-3">Module 4 of 6</p>

          {/* Module progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {[1, 2, 3, 4, 5, 6].map((mod) => (
              <div
                key={mod}
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  mod <= 4
                    ? mod === 4
                      ? 'bg-gradient-to-r from-primary to-accent-cyan'
                      : 'bg-primary/60'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group">
            Continue Learning
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
