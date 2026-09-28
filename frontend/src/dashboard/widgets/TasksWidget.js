"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { MOCK_TASKS } from '../data/mockData';
import { useDashboard } from '../hooks/useDashboard';

const STATUS_CONFIG = {
  done:          { color: 'bg-emerald-400', icon: CheckCircle2, iconColor: 'text-emerald-400' },
  'in-progress': { color: 'bg-yellow-400',  icon: Clock,        iconColor: 'text-yellow-400' },
  todo:          { color: 'bg-gray-500',     icon: Circle,       iconColor: 'text-gray-500' },
};

const PRIORITY_CONFIG = {
  high:   'bg-red-500/15 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  low:    'bg-gray-500/15 text-gray-400 border-gray-500/20',
};

export default function TasksWidget() {
  const { selectTask } = useDashboard();
  const [tasks, setTasks] = useState(
    MOCK_TASKS.map((t) => ({ ...t, checked: t.status === 'done' }))
  );

  const toggleCheck = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, checked: !t.checked, status: !t.checked ? 'done' : 'todo' }
          : t
      )
    );
  };

  const activeTasks = tasks.filter((t) => t.status !== 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-text-primary">Active Tasks</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
            {activeTasks}
          </span>
        </div>
        <AlertTriangle className="w-4 h-4 text-text-secondary/40" />
      </div>

      {/* Task list */}
      <div className="divide-y divide-white/5">
        {tasks.map((task) => {
          const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
          const StatusIcon = statusCfg.icon;

          return (
            <motion.div
              key={task.id}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              onClick={() => selectTask(task)}
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer group transition-colors"
            >
              {/* Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheck(task.id);
                }}
                className={`shrink-0 transition-colors ${statusCfg.iconColor} hover:text-primary`}
              >
                <StatusIcon className="w-4 h-4" />
              </button>

              {/* Task info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-secondary/60">{task.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${PRIORITY_CONFIG[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <p className={`text-sm mt-0.5 truncate ${task.checked ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                  {task.title}
                </p>
              </div>

              {/* Due date */}
              <span className="shrink-0 text-xs text-text-secondary">{task.dueDate}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5">
        <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors group">
          View all tasks
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
