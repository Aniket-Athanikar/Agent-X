"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    GitPullRequest,
    Workflow,
    Bot,
    CheckCircle2,
    MessageSquare,
    Zap,
    Clock,
    PlayCircle,
    Settings
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

export default function WorkflowsSection() {
    const features = [
        {
            icon: <Zap className="w-5 h-5 text-cyan-400" />,
            title: "Event-Driven Triggers",
            desc: "Kick off AI workflows automatically via webhooks, cron jobs, database inserts, or git events."
        },
        {
            icon: <Bot className="w-5 h-5 text-emerald-400" />,
            title: "Multi-Agent Pipelines",
            desc: "Chain specialized agents together. Have one write code, another review it, and a third write the docs."
        },
        {
            icon: <Settings className="w-5 h-5 text-cyan-400" />,
            title: "Human-in-the-Loop",
            desc: "Require manual approval for critical actions like deploying to production or dropping tables."
        }
    ];

    return (
        <section id="workflows" className="relative py-32 overflow-hidden bg-[#030712] border-t border-cyan-500/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">

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
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[200px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[200px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-20">

                {/* Title Group */}
                <div className="space-y-6 max-w-3xl text-center mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2">
                            <Workflow className="w-4 h-4" /> Automation Engine
                        </h2>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white leading-tight font-sans tracking-tight"
                    >
                        Pipelines that <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            think for themselves
                        </span>
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto"
                    >
                        Build autonomous workflows that react to your environment Agent-X intercepts events, delegates tasks to specialized AI, and executes actions across your stack
                    </motion.p>
                </div>

                {/* --- DEEP VIEW PIPELINE MOCKUP --- */}
                <TiltCard delay={0.3} className="w-full rounded-[2.5rem] bg-black/60 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] p-8 md:p-12 hover:border-cyan-500/40 transition-colors group/main">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover/main:scale-110 transition-transform">
                                <Workflow className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm tracking-wide">Automated Code Review & Fix</h4>
                                <p className="text-xs text-gray-500 font-mono mt-1">ID: flow_7829a • Trigger: GitHub Webhook</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            Workflow Active
                        </div>
                    </div>

                    {/* Pipeline Visualization */}
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0 mt-12 mb-4">

                        {/* Animated Connecting Line Background (Desktop) */}
                        <div className="hidden md:block absolute top-10 left-10 right-10 h-0.5 bg-white/[0.05] z-0" />

                        {/* Animated Progress Beam (Desktop) */}
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
                            className="hidden md:block absolute top-10 left-10 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 z-0 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        />

                        {/* Step 1: Trigger */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 0.5 }}
                                className="w-20 h-20 rounded-2xl bg-[#09090b] border border-cyan-500/20 shadow-xl flex items-center justify-center group-hover:border-emerald-400/50 transition-colors"
                            >
                                <GitPullRequest className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                            </motion.div>
                            <div className="text-center">
                                <h5 className="text-white font-bold text-sm">PR Opened</h5>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">Triggered by @dev</p>
                            </div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute -top-3 -right-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </motion.div>
                        </div>

                        {/* Step 2: Agent Action */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 1.5 }}
                                className="w-20 h-20 rounded-2xl bg-[#09090b] border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
                                <Bot className="w-8 h-8 text-cyan-400 relative z-10" />
                            </motion.div>
                            <div className="text-center">
                                <h5 className="text-white font-bold text-sm">Agent-X AI Code Review</h5>
                                <p className="text-[10px] text-cyan-400 font-mono mt-1">Analyzing changes...</p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 3 }}
                                className="absolute -top-3 -right-3"
                            >
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </motion.div>
                        </div>

                        {/* Step 3: Tests/CI */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 2.5 }}
                                className="w-20 h-20 rounded-2xl bg-[#09090b] border border-cyan-500/20 shadow-xl flex items-center justify-center group-hover:border-cyan-400/50 transition-colors"
                            >
                                <PlayCircle className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </motion.div>
                            <div className="text-center">
                                <h5 className="text-white font-bold text-sm">Run Test Suite</h5>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">Executing Jest</p>
                            </div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 4 }} className="absolute -top-3 -right-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </motion.div>
                        </div>

                        {/* Step 4: Notification */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 3.5 }}
                                className="w-20 h-20 rounded-2xl bg-[#09090b] border border-cyan-500/20 shadow-xl flex items-center justify-center group-hover:border-emerald-400/50 transition-colors"
                            >
                                <MessageSquare className="w-8 h-8 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                            </motion.div>
                            <div className="text-center">
                                <h5 className="text-white font-bold text-sm">Slack Alert</h5>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">Notify #engineering</p>
                            </div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 4.5 }} className="absolute -top-3 -right-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 bg-black rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </motion.div>
                        </div>

                    </div>

                    {/* Live Log Terminal Output */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="mt-10 rounded-xl bg-black/80 border border-cyan-500/20 p-4 font-mono text-[11px] text-gray-400 h-32 overflow-hidden flex flex-col justify-end shadow-inner"
                    >
                        <div className="space-y-2">
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex gap-3">
                                <span className="text-gray-600">[14:02:01]</span> <span className="text-emerald-400">TRIGGER:</span> GitHub Webhook received for PR #492
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2.5 }} className="flex gap-3">
                                <span className="text-gray-600">[14:02:03]</span> <span className="text-cyan-400">AGENT:</span> Analyzing 14 changed files. Found 2 potential memory leaks
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 3.5 }} className="flex gap-3">
                                <span className="text-gray-600">[14:02:15]</span> <span className="text-emerald-400">SYSTEM:</span> Applied auto-fix. Initiating test suite...
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 4.5 }} className="flex gap-3">
                                <span className="text-gray-600">[14:02:42]</span> <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">SUCCESS:</span> 100% tests passed. Sent summary to Slack #engineering
                            </motion.div>
                        </div>
                    </motion.div>
                </TiltCard>

                {/* 3D Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <TiltCard key={feature.title} delay={0.4 + (idx * 0.1)} className="p-8 rounded-[2rem] bg-black/50 border border-cyan-500/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-cyan-500/30 hover:bg-[#030712]/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all flex flex-col gap-4 group">

                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2 text-lg">{feature.title}</h4>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        </TiltCard>
                    ))}
                </div>

            </div>
        </section>
    );
}
