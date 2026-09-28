"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Video, Clock } from 'lucide-react';
import { MOCK_MEETINGS } from '../data/mockData';

const TYPE_CONFIG = {
  standup: { label: 'Standup', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  review:  { label: 'Review',  bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400' },
  '1on1':  { label: '1:1',     bg: 'bg-purple-500/15',  text: 'text-purple-400',  dot: 'bg-purple-400' },
};

export default function MeetingsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Schedule</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-cyan/15 text-accent-cyan">
            {MOCK_MEETINGS.length}
          </span>
        </div>
      </div>

      {/* Meetings with timeline */}
      <div className="relative px-5 py-3">
        {/* Timeline line */}
        <div className="absolute left-[33px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-accent-cyan/20 to-transparent" />

        <div className="space-y-1">
          {MOCK_MEETINGS.map((meeting, idx) => {
            const typeConfig = TYPE_CONFIG[meeting.type] || TYPE_CONFIG.standup;

            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                className="relative flex items-start gap-4 py-3 group"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-3 h-3 rounded-full mt-1.5 ${typeConfig.dot} ring-4 ring-surface`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{meeting.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </span>
                        <span>{meeting.duration}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {meeting.attendees}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                        {typeConfig.label}
                      </span>
                      {meeting.status === 'upcoming' && (
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
                          <Video className="w-3 h-3" />
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
