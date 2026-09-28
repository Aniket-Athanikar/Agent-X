"use client";

import React from "react";
import { motion } from "framer-motion";
import AgentXLogo from "@/components/AgentXLogo";
import { Github, MessageSquare, Database, Cloud, FileText, Kanban, Sparkles, Network } from "lucide-react";

export default function IntegrationSection() {
    const integrations = [
        { id: 1, name: "Source Control", icon: <Github className="w-5 h-5 text-white" />, tool: "GitHub, GitLab", position: "top-[5%] left-[15%]" },
        { id: 2, name: "Communications", icon: <MessageSquare className="w-5 h-5 text-white" />, tool: "Slack, Teams", position: "top-[5%] right-[15%]" },
        { id: 3, name: "Databases", icon: <Database className="w-5 h-5 text-white" />, tool: "Postgres, MongoDB", position: "bottom-[15%] left-[10%]" },
        { id: 4, name: "Cloud Infrastructure", icon: <Cloud className="w-5 h-5 text-white" />, tool: "AWS, Vercel", position: "bottom-[15%] right-[10%]" },
        { id: 5, name: "Documentation", icon: <FileText className="w-5 h-5 text-white" />, tool: "Notion, Confluence", position: "top-[45%] left-[5%]" },
        { id: 6, name: "Project Management", icon: <Kanban className="w-5 h-5 text-white" />, tool: "Jira, Linear", position: "top-[45%] right-[5%]" },
    ];

    return (
        <section className="relative py-32 overflow-hidden bg-[#030712] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-t border-cyan-500/10">

            {/* --- CINEMATIC ZOOMING BACKGROUND PATTERN --- */}
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 pointer-events-none transform-gpu origin-center"
                style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.2) 2px, transparent 0)",
                    backgroundSize: "36px 36px"
                }}
            />

            {/* Deep Space Aurora Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Title Group */}
                <div className="text-center space-y-6 max-w-3xl mx-auto mb-20 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.1] backdrop-blur-md rounded-full px-4 py-1.5 text-xs text-gray-300 font-bold"
                    >
                        <Network className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Seamless Ecosystem Integration</span>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white leading-tight font-sans tracking-tight"
                    >
                        Connects to everything<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            Works instantly
                        </span>
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto"
                    >
                        Agent-X plugs directly into your existing tech stack No complex migrations required—just authorize and let the AI index your workspace
                    </motion.p>
                </div>

                {/* Integration Interactive Web Area */}
                <div className="relative w-full h-[600px] max-w-4xl mx-auto hidden md:block">

                    {/* Animated SVG Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
                        {integrations.map((_, idx) => (
                            <motion.line
                                key={`line-${idx}`}
                                x1="50%"
                                y1="50%"
                                x2={idx % 2 === 0 ? (idx < 2 ? "25%" : idx < 4 ? "15%" : "20%") : (idx < 2 ? "75%" : idx < 4 ? "85%" : "80%")}
                                y2={idx < 2 ? "15%" : idx < 4 ? "85%" : "55%"}
                                stroke="url(#line-gradient)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.5 + idx * 0.2, ease: "easeOut" }}
                            />
                        ))}
                        <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06B6D4" />
                                <stop offset="100%" stopColor="#6D5DFB" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Central AI Core */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Outer pulsing rings */}
                            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                            <div className="absolute inset-4 rounded-full border border-emerald-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />

                            {/* Core Glassmorphic Hub */}
                            <div className="w-24 h-24 rounded-full bg-black/80 border border-cyan-500/50 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <AgentXLogo 
                                    className="w-14 h-14 animate-[spin_12s_linear_infinite] drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] relative z-10" 
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Surrounding Integration Nodes */}
                    {integrations.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                opacity: { duration: 0.5, delay: 0.6 + idx * 0.1 },
                                scale: { duration: 0.5, delay: 0.6 + idx * 0.1 },
                                y: { repeat: Infinity, duration: 4, delay: idx * 0.5, ease: "easeInOut" }
                            }}
                            className={`absolute ${item.position} z-10 group`}
                        >
                            <div className="flex flex-col items-center gap-3 cursor-pointer">
                                {/* Icon Container */}
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.1] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center group-hover:border-[#06B6D4]/50 group-hover:bg-[#06B6D4]/10 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_rgba(6,182,212,0.2)] transition-all duration-300">
                                    {item.icon}
                                </div>

                                {/* Labels */}
                                <div className="text-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                    <h4 className="text-sm font-bold text-white whitespace-nowrap">{item.name}</h4>
                                    <p className="text-[10px] text-[#06B6D4] font-semibold tracking-wide uppercase mt-0.5">{item.tool}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View (Grid fallback instead of Absolute Web) */}
                <div className="grid grid-cols-2 gap-4 mt-12 md:hidden">
                    {integrations.map((item, idx) => (
                        <motion.div
                            key={`mobile-${item.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex flex-col items-center text-center gap-3 shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                                <p className="text-[10px] text-gray-500 font-semibold">{item.tool}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
