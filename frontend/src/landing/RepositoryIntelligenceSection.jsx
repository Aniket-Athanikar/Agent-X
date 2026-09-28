"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    FolderGit2,
    FileCode2,
    SearchCode,
    Network,
    Cpu,
    Fingerprint,
    Database
} from "lucide-react";

// 3D Tilt Card Component
function TiltCard({ children, className, delay = 0 }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full h-full"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className={`relative w-full h-full ${className}`}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

export default function RepositoryIntelligenceSection() {
    const metrics = [
        {
            icon: <SearchCode className="w-5 h-5 text-cyan-400" />,
            title: "Semantic Code Search",
            desc: "Find logic, not just strings. Search across millions of lines of code using natural language."
        },
        {
            icon: <Network className="w-5 h-5 text-emerald-400" />,
            title: "Dynamic Knowledge Graph",
            desc: "Automatically maps dependencies, relationships, and architecture as your codebase evolves."
        },
        {
            icon: <Fingerprint className="w-5 h-5 text-cyan-400" />,
            title: "Deep Context Awareness",
            desc: "Understands your specific coding conventions, internal APIs, and architectural patterns."
        }
    ];

    return (
        <section id="intelligence" className="relative py-32 overflow-hidden bg-[#030712] border-t border-emerald-500/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">

            {/* --- BOLD ZOOMING BACKGROUND PATTERN --- */}
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
            <div className="absolute top-1/2 left-0 w-[500px] h-[600px] bg-emerald-500/10 rounded-full blur-[200px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-20">

                {/* Title Group */}
                <div className="space-y-6 max-w-3xl text-center mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                            Repository Intelligence
                        </h2>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white leading-tight font-sans tracking-tight"
                    >
                        It understands your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            entire architecture
                        </span>
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto"
                    >
                        Agent-X doesn't just read files It builds a high-fidelity vector representation of your entire organization's codebase, documentation, and history in seconds
                    </motion.p>
                </div>

                {/* --- DEEP VIEW SCANNER MOCKUP --- */}
                <TiltCard delay={0.3} className="w-full rounded-[2.5rem] overflow-hidden bg-black/60 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row min-h-[450px] group/main hover:border-emerald-500/40 transition-colors">

                    {/* Left Column: File Tree */}
                    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-cyan-500/20 bg-[#030712]/80 p-6 flex flex-col relative overflow-hidden">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4 text-cyan-400" /> Raw Repository
                        </h4>

                        <div className="space-y-4 font-mono text-sm relative z-10">
                            <div className="text-gray-300 flex items-center gap-2"><FolderGit2 className="w-4 h-4 text-cyan-400" /> src/</div>
                            <div className="pl-6 space-y-3">
                                <div className="text-gray-400 flex items-center gap-2"><FolderGit2 className="w-4 h-4 text-emerald-400" /> core/</div>
                                <div className="pl-6 space-y-3">
                                    <div className="text-gray-500 flex items-center gap-2"><FileCode2 className="w-4 h-4" /> engine.ts</div>
                                    <div className="text-emerald-400 flex items-center gap-2 bg-emerald-500/10 p-1 -ml-1 rounded border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><FileCode2 className="w-4 h-4" /> vectors.ts</div>
                                    <div className="text-gray-500 flex items-center gap-2"><FileCode2 className="w-4 h-4" /> parser.ts</div>
                                </div>
                                <div className="text-gray-400 flex items-center gap-2"><FolderGit2 className="w-4 h-4 text-cyan-400" /> api/</div>
                                <div className="pl-6 space-y-3">
                                    <div className="text-gray-500 flex items-center gap-2"><FileCode2 className="w-4 h-4" /> routes.ts</div>
                                </div>
                            </div>
                        </div>

                        {/* Scanning Beam Overlay */}
                        <motion.div
                            animate={{ y: ["-10%", "150%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/10 to-emerald-500/30 border-b border-emerald-500/50 pointer-events-none z-20 shadow-[0_5px_15px_rgba(16,185,129,0.4)]"
                        />
                    </div>

                    {/* Right Column: AI Translation & Knowledge Graph */}
                    <div className="flex-1 p-6 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#030712] to-emerald-500/5">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Agent-X Embedding Space
                        </h4>

                        <div className="flex-1 flex items-center justify-center relative">

                            {/* Central Database Icon */}
                            <div className="relative z-20 w-16 h-16 rounded-2xl bg-black border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center group-hover/main:scale-110 transition-transform">
                                <Database className="w-8 h-8 text-emerald-400" />
                                <div className="absolute inset-0 rounded-2xl border border-emerald-400 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
                            </div>

                            {/* Orbiting Graph Nodes */}
                            {[...Array(6)].map((_, i) => {
                                const angle = (i * 360) / 6;
                                const radius = 100;
                                const x = Math.cos((angle * Math.PI) / 180) * radius;
                                const y = Math.sin((angle * Math.PI) / 180) * radius;

                                return (
                                    <motion.div
                                        key={i}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                        className="absolute inset-0 z-10 flex items-center justify-center"
                                    >
                                        <motion.div
                                            style={{ x, y }}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 + i, delay: i * 0.5 }}
                                            className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                                        />
                                    </motion.div>
                                );
                            })}

                            {/* Decorative connecting SVGs */}
                            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40">
                                <g className="origin-center animate-[spin_30s_linear_infinite]" style={{ transformOrigin: "center" }}>
                                    <circle cx="50%" cy="50%" r="100" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 8" />
                                    <circle cx="50%" cy="50%" r="160" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2 6" />
                                </g>
                            </svg>

                            {/* Floating Code Snippet Overlay */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, -20] }}
                                transition={{ repeat: Infinity, duration: 6, times: [0, 0.1, 0.9, 1] }}
                                className="absolute right-4 top-1/4 bg-black/80 border border-emerald-500/30 backdrop-blur-md p-3 rounded-xl font-mono text-[10px] text-cyan-400 max-w-[200px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                            >
                                <div className="text-gray-400 mb-1">// Extracted Context</div>
                                export const getVectors = (id) =&gt; ...<br />
                                <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">Similarity Score: 98.4%</span>
                            </motion.div>
                        </div>
                    </div>
                </TiltCard>

                {/* 3D Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {metrics.map((metric, idx) => (
                        <TiltCard key={metric.title} delay={0.4 + (idx * 0.1)} className="p-6 rounded-[2rem] bg-black/50 border border-emerald-500/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-emerald-500/30 hover:bg-[#030712]/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all flex flex-col gap-4 group">

                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                {metric.icon}
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2 text-lg">{metric.title}</h4>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{metric.desc}</p>
                            </div>
                        </TiltCard>
                    ))}
                </div>

            </div>
        </section>
    );
}
