"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SYSTEM_HEALTH } from '../data/mockData';

const getBarColor = (latency) => {
  if (latency < 100) return '#10B981';
  if (latency < 200) return '#F59E0B';
  return '#EF4444';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const latency = payload[0].value;
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="text-xs font-semibold text-text-primary mb-1">{label}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full" style={{ background: getBarColor(latency) }} />
        <span className="text-text-secondary">Latency:</span>
        <span className="text-text-primary font-medium">{latency}ms</span>
      </div>
    </div>
  );
};

export default function SystemHealthWidget() {
  const allHealthy = SYSTEM_HEALTH.every((s) => s.status === 'healthy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">System Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${allHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
          <span className="text-xs text-text-secondary">
            {allHealthy ? 'All Systems Operational' : 'Degraded Performance'}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 py-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={SYSTEM_HEALTH} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              width={40}
              label={{ value: 'ms', position: 'insideTopLeft', fill: '#94A3B8', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="latency" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {SYSTEM_HEALTH.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.latency)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 pb-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          &lt; 100ms
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          100-200ms
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          &gt; 200ms
        </span>
      </div>
    </motion.div>
  );
}
