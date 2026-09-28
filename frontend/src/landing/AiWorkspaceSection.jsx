"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Terminal,
    Folder,
    FileCode,
    FileJson,
    CheckCircle2,
    MessageSquare,
    Zap,
    Sparkles,
    Play,
    Cpu
} from "lucide-react";

export default function AiWorkspaceSection() {
    return (
        <section id="workspace" className="relative py-32 overflow-hidden bg-[#030712] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">

            {/* --- BOLD ZOOMING BACKGROUND PATTERN --- */}
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 pointer-events-none transform-gpu origin-center"
                style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)",
                    backgroundSize: "36px 36px"
                }}
            />

            {/* Deep Space Aurora Glows */}
            <div className="absolute top-1/3 right-1/4 w-[700px] h-[500px] bg-[#6D5DFB]/15 rounded-full blur-[200px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[180px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-16">

                {/* Title Group */}
                <div className="space-y-6 max-w-3xl text-center mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-[#06B6D4] text-xs font-black uppercase tracking-[0.2em] drop-shadow-md">
                            The Agent-X Dashboard
                        </h2>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white leading-tight font-sans tracking-tight"
                    >
                        Where your code <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            writes itself
                        </span>
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto"
                    >
                        Experience a collaborative environment where autonomous agents review pull requests, debug production errors, and scaffold architecture in real-time
                    </motion.p>
                </div>

                {/* --- DEEP VIEW WORKSPACE MOCKUP --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, rotateX: 1, rotateY: -1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.3 }}
                    className="relative w-full rounded-3xl overflow-hidden bg-black/40 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] hover:border-cyan-400/50 transition-all flex flex-col"
                >
                    {/* Mac-style Window Header */}
                    <div className="h-12 border-b border-cyan-500/20 bg-black/40 flex items-center px-4 justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-cyan-950/30 border border-cyan-500/30 text-[10px] text-cyan-400 font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Sparkles className="w-3 h-3 text-[#6D5DFB]" />
                            Agent-X Live Environment
                        </div>
                        <div className="w-16" /> {/* Spacer for centering */}
                    </div>

                    {/* Workspace Body Grid */}
                    <div className="flex flex-col md:flex-row h-[600px]">

                        {/* Sidebar (File Explorer) */}
                        <div className="w-full md:w-64 border-r border-white/[0.08] bg-black/20 p-4 flex flex-col gap-4 shrink-0 hidden md:flex">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Explorer</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-300 hover:bg-white/[0.05] p-1.5 rounded cursor-pointer transition-colors">
                                    <Folder className="w-4 h-4 text-[#06B6D4]" /> src
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6D5DFB] bg-[#6D5DFB]/10 p-1.5 rounded cursor-pointer ml-4 border border-[#6D5DFB]/20">
                                    <FileCode className="w-4 h-4" /> AgentCore.tsx
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 hover:bg-white/[0.05] p-1.5 rounded cursor-pointer ml-4 transition-colors">
                                    <FileCode className="w-4 h-4 text-gray-500" /> index.tsx
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 hover:bg-white/[0.05] p-1.5 rounded cursor-pointer ml-4 transition-colors">
                                    <FileJson className="w-4 h-4 text-yellow-500/70" /> config.json
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/[0.08]">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Active AgentsForge</h4>
                                <div className="flex items-center justify-between text-xs text-gray-300 bg-white/[0.03] p-2 rounded border border-white/[0.05]">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-3.5 h-3.5 text-[#22C55E]" /> RefactorBot
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area (Code Editor + AI Generation) */}
                        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050816]">
                            {/* Editor Tabs */}
                            <div className="flex border-b border-white/[0.08] bg-black/40">
                                <div className="px-4 py-2 text-sm font-mono text-[#6D5DFB] border-b-2 border-[#6D5DFB] bg-[#6D5DFB]/5 flex items-center gap-2">
                                    AgentCore.tsx <span className="w-2 h-2 rounded-full bg-[#6D5DFB] block" />
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="flex-1 p-6 font-mono text-sm overflow-hidden relative">
                                <div className="text-gray-500 select-none absolute left-4 flex flex-col items-end pr-4 border-r border-white/[0.08]">
                                    {[...Array(15)].map((_, i) => <span key={i} className="leading-7">{i + 1}</span>)}
                                </div>
                                <div className="pl-12 leading-7">
                                    <div className="text-[#F59E0B]">import <span className="text-gray-300">&#123; useState, useEffect &#125;</span> from <span className="text-[#22C55E]">'react'</span>;</div>
                                    <div className="text-[#F59E0B]">import <span className="text-gray-300">&#123; NeuralNetwork &#125;</span> from <span className="text-[#22C55E]">'@agent-x/core'</span>;</div>
                                    <br />
                                    <div className="text-[#6D5DFB]">export default function <span className="text-[#06B6D4]">AgentCore</span>() &#123;</div>
                                    <div className="pl-6 text-gray-300">const [status, setStatus] = <span className="text-[#06B6D4]">useState</span>(<span className="text-[#22C55E]">'idle'</span>);</div>
                                    <br />

                                    {/* Simulated AI Typing Effect */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                        className="pl-6 relative"
                                    >
                                        {/* AI Suggestion Box Glow */}
                                        <div className="absolute -inset-2 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 rounded-lg pointer-events-none" />

                                        <div className="text-gray-500 italic">// AI Generated: Optimize resource allocation based on historical loads</div>
                                        <div className="text-[#06B6D4]">useEffect<span className="text-gray-300">(() =&gt; &#123;</span></div>

                                        <motion.div
                                            initial={{ clipPath: "inset(0 100% 0 0)" }}
                                            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.5, duration: 2, ease: "linear" }}
                                        >
                                            <div className="pl-6 text-gray-300">const pipeline = <span className="text-[#F59E0B]">new</span> <span className="text-[#06B6D4]">NeuralNetwork</span>(&#123;</div>
                                            <div className="pl-12 text-gray-300">mode: <span className="text-[#22C55E]">'autonomous'</span>,</div>
                                            <div className="pl-12 text-gray-300">workers: <span className="text-purple-400">navigator.hardwareConcurrency</span></div>
                                            <div className="pl-6 text-gray-300">&#125;);</div>
                                            <div className="pl-6 text-gray-300">pipeline.<span className="text-[#06B6D4]">initialize</span>().<span className="text-[#06B6D4]">then</span>(() =&gt; <span className="text-[#06B6D4]">setStatus</span>(<span className="text-[#22C55E]">'active'</span>));</div>
                                        </motion.div>

                                        <div className="text-gray-300">&#125;, []);</div>

                                        {/* Accept/Reject Overlay */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 3.5, duration: 0.3 }}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#09090b] p-1.5 rounded-lg border border-[#6D5DFB]/50 shadow-xl z-20"
                                        >
                                            <button className="flex items-center gap-1 text-[10px] bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded font-sans font-bold transition-colors">
                                                <CheckCircle2 className="w-3 h-3" /> Accept
                                            </button>
                                            <button className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded font-sans font-bold transition-colors">
                                                Reject
                                            </button>
                                        </motion.div>
                                    </motion.div>

                                    <br />
                                    <div className="pl-6 text-gray-300">return <span className="text-gray-500">&lt;</span><span className="text-blue-400">Agent-X Dashboard</span> <span className="text-[#06B6D4]">status</span>=<span className="text-[#06B6D4]">&#123;</span>status<span className="text-[#06B6D4]">&#125;</span> <span className="text-gray-500">/&gt;</span>;</div>
                                    <div className="text-[#6D5DFB]">&#125;</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Pane (Terminal / Agent Chat) */}
                        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/[0.08] bg-black/40 flex flex-col shrink-0">
                            {/* Pane Tabs */}
                            <div className="flex border-b border-white/[0.08] bg-black/60">
                                <button className="flex-1 py-3 text-xs font-bold text-white border-b-2 border-white flex items-center justify-center gap-2">
                                    <Terminal className="w-3.5 h-3.5" /> Output
                                </button>
                                <button className="flex-1 py-3 text-xs font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-300 transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" /> Ask AI
                                </button>
                            </div>

                            {/* Terminal Output */}
                            <div className="flex-1 p-4 font-mono text-xs overflow-hidden flex flex-col gap-2">
                                <div className="text-gray-400">Agent-X OS v2.4.1 initialized.</div>
                                <div className="text-[#06B6D4]">$ agent deploy --auto-resolve</div>

                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-yellow-500 mt-0.5">▶</span> Analyzing dependency tree...
                                </motion.div>

                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-yellow-500 mt-0.5">▶</span> Running automated tests...
                                </motion.div>

                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3 }} className="flex items-start gap-2 text-[#22C55E]">
                                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> All 142 tests passed
                                </motion.div>

                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.5 }} className="flex items-start gap-2 text-[#6D5DFB] bg-[#6D5DFB]/10 border border-[#6D5DFB]/20 p-2 rounded-lg mt-2">
                                    <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>AI suggests optimizing <b>useEffect</b> hook in AgentCore.tsx to prevent memory leaks. (Auto-generating patch)</span>
                                </motion.div>
                            </div>

                            {/* Action Bar */}
                            <div className="p-4 border-t border-cyan-500/20 bg-black/40">
                                <motion.button whileHover={{ scale: 1.05 }} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2">
                                    <Play className="w-3.5 h-3.5 fill-black" /> Execute Pipeline
                                </motion.button>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
