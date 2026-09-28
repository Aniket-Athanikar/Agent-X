"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Video, Calendar, Book, Hash, Sparkles } from "lucide-react";

const communityFeatures = [
  { icon: <MessageSquare className="w-4 h-4 text-primary" />, name: "Discord Server" },
  { icon: <Hash className="w-4 h-4 text-accent-cyan" />, name: "Slack Channels" },
  { icon: <Book className="w-4 h-4 text-primary" />, name: "Learning Hub" },
  { icon: <Calendar className="w-4 h-4 text-accent-cyan" />, name: "Events" },
  { icon: <Video className="w-4 h-4 text-primary" />, name: "Workshops" },
  { icon: <Users className="w-4 h-4 text-accent-cyan" />, name: "Engineering Meetups" }
];

const avatars = [
  { initials: "CTO", role: "Chief Technology Officer", left: "12%", top: "20%", duration: 4.5, x: [-5, 5, -5], y: [10, -10, 10], color: "from-emerald-500/30 to-emerald-500/10" },
  { initials: "TL", role: "Team Lead", left: "32%", top: "72%", duration: 5.2, x: [4, -4, 4], y: [-8, 8, -8], color: "from-cyan-500/30 to-cyan-500/10" },
  { initials: "BE", role: "Backend Architect", left: "75%", top: "18%", duration: 4.8, x: [-6, 6, -6], y: [12, -12, 12], color: "from-indigo-500/30 to-indigo-500/10" },
  { initials: "DO", role: "DevOps Engineer", left: "82%", top: "68%", duration: 5.5, x: [5, -5, 5], y: [-10, 10, -10], color: "from-emerald-500/30 to-emerald-500/10" },
  { initials: "FE", role: "Frontend Developer", left: "22%", top: "52%", duration: 4.2, x: [-3, 3, -3], y: [7, -7, 7], color: "from-cyan-500/30 to-cyan-500/10" },
  { initials: "SE", role: "Security Auditor", left: "55%", top: "12%", duration: 5.0, x: [6, -6, 6], y: [-11, 11, -11], color: "from-indigo-500/30 to-indigo-500/10" },
  { initials: "QA", role: "QA Lead", left: "64%", top: "78%", duration: 4.7, x: [-4, 4, -4], y: [9, -9, 9], color: "from-emerald-500/30 to-emerald-500/10" },
  { initials: "PM", role: "Product Manager", left: "88%", top: "42%", duration: 5.3, x: [5, -5, 5], y: [-10, 10, -10], color: "from-cyan-500/30 to-cyan-500/10" },
];

export default function Community() {
  return (
    <section className="py-16 bg-transparent relative z-10 overflow-hidden border-t border-white/5">
      {/* 160px theme vertical/horizontal grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "160px 160px"
        }}
      />

      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <div className="max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-text-secondary uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Engineering Ecosystem
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-albert text-white tracking-tight leading-tight">
            Join The Developer Community
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            Connect, collaborate, and grow with thousands of engineering managers, developers, and platform professionals.
          </p>
        </div>

        {/* Floating Avatars Concept */}
        <div className="relative h-60 max-w-4xl mx-auto mb-10">
          {avatars.map((av, i) => (
            <motion.div
              key={i}
              animate={{
                y: av.y,
                x: av.x
              }}
              transition={{ duration: av.duration, repeat: Infinity, ease: "easeInOut" }}
              className="absolute group z-20 cursor-pointer"
              style={{
                left: av.left,
                top: av.top
              }}
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* Glowing Circle */}
                <div className={`w-10 h-10 rounded-xl border border-white/15 bg-gradient-to-br ${av.color} flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.08)] group-hover:scale-105 group-hover:border-primary/45 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300`}>
                  <span className="text-[9px] font-bold text-white tracking-wider font-albert">
                    {av.initials}
                  </span>
                </div>

                {/* Hover Label card */}
                <div className="absolute top-11 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 bg-[#07130E] border border-white/10 px-2 py-0.5 rounded text-[8px] text-white font-semibold whitespace-nowrap shadow-xl">
                  {av.role}
                </div>
              </div>
            </motion.div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center z-30">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 backdrop-blur-xl px-6 py-3 rounded-xl text-white font-bold hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] border border-cyan-500/30 text-xs inline-block"
            >
              Join The Developer Discord
            </motion.a>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {communityFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-text-secondary hover:text-white hover:bg-[#07130E] hover:border-primary/25 hover:scale-102 transition-all duration-300 cursor-pointer font-medium"
            >
              {feat.icon}
              <span className="font-semibold text-[10px]">{feat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
