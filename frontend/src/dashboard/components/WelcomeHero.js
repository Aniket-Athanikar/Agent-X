"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, TrendingUp } from 'lucide-react';
import { useGreeting } from '../hooks/useGreeting';
import { MOCK_USER, MOCK_SPRINT, MOCK_PROJECT } from '../data/mockData';

const MetricCard = ({ icon: Icon, label, value, accent, children }) => (
  <motion.div
    whileHover={{ scale: 1.04, y: -2 }}
    className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[120px] cursor-default shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}>
      {Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </div>
    <span className="text-lg font-bold text-text-primary">{value}</span>
    <span className="text-xs text-text-secondary">{label}</span>
  </motion.div>
);

export default function WelcomeHero() {
  const { greeting, emoji } = useGreeting();
  const sprintProgress = Math.round((MOCK_SPRINT.completedTasks / MOCK_SPRINT.totalTasks) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Gradient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/5 via-emerald-500/5 to-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Greeting */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-text-secondary text-lg mb-1">
                {emoji} {greeting},
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">{MOCK_USER.name}</span>
              </h1>
            </motion.div>

            {/* Role pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-2 mt-5"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <Zap className="w-3 h-3" />
                {MOCK_USER.role}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-text-secondary border border-white/5">
                {MOCK_USER.department}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                {MOCK_PROJECT.name}
              </span>
            </motion.div>
          </div>

          {/* Right: Metric cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-3 sm:gap-4"
          >
            <MetricCard
              label="AI Score"
              value={MOCK_USER.productivityScore}
              accent="bg-primary/20 text-primary"
            >
              <span className="text-sm font-bold text-primary">⚡</span>
            </MetricCard>

            <MetricCard
              icon={TrendingUp}
              label="Sprint"
              value={`${MOCK_SPRINT.daysLeft}d left`}
              accent="bg-accent-cyan/20 text-accent-cyan"
            >
              {null}
            </MetricCard>

            <MetricCard
              label="Streak"
              value={`${MOCK_USER.streak} days`}
              accent="bg-orange-500/20 text-orange-400"
            >
              <Flame className="w-4 h-4" />
            </MetricCard>
          </motion.div>
        </div>

        {/* Sprint progress bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
          className="mt-6"
        >
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span>{MOCK_SPRINT.name}</span>
            <span className="text-primary font-medium">{sprintProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sprintProgress}%` }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}