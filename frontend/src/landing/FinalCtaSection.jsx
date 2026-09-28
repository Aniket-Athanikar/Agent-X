
"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, TerminalSquare, CreditCard } from "lucide-react";
import { useAuth } from "@/services/authContext";
import Link from "next/link";

export default function FinalCtaSection() {
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useAuth();

    // --- 1. HOOKS AT THE TOP ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Softer springs for a medium-sized card
    const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

    // Subtler rotation for a horizontal banner (5 degrees instead of 10)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    // Dynamic background shift
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-5%", "5%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-5%", "5%"]);

    // --- 2. EFFECTS & HANDLERS ---
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate percentage from center (-0.5 to 0.5)
        x.set(mouseX / rect.width - 0.5);
        y.set(mouseY / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // --- 3. HYDRATION FIX ---
    if (!isMounted) {
        return <section className="py-20 bg-[#030712]" />;
    }

    // --- 4. RENDER ---
    return (
        <section className="relative py-20 overflow-hidden bg-[#030712] border-t border-cyan-500/10">

            {/* Cinematic Background Pattern (Scaled down for medium section) */}
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 pointer-events-none transform-gpu origin-center opacity-70"
                style={{
                    backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(6,182,212,0.2) 1.5px, transparent 0)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Deep Space Aurora Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

                {/* 3D TILT MOTION MEDIUM CARD */}
                <div style={{ perspective: 1000 }} className="w-full">
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                        className="relative w-full rounded-[2.5rem] bg-black/60 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] p-8 md:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 hover:border-cyan-500/40 transition-colors"
                    >

                        {/* Left Column: Text */}
                        <div className="relative z-10 flex-1 space-y-5 text-center lg:text-left" style={{ transform: "translateZ(30px)" }}>
                            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>Start Building</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                                Ready for the <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                    AI Revolution?
                                </span>
                            </h2>

                            <p className="text-gray-400 text-sm md:text-base font-medium max-w-lg mx-auto lg:mx-0">
                                Transform your repository into a living workspace Deploy autonomous agents and ship faster than ever
                            </p>
                        </div>

                        {/* Right Column: Buttons */}
                        <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-4" style={{ transform: "translateZ(40px)" }}>
                            <Link
                                href={user ? "/#pricing" : "/login"}
                                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white px-8 py-4 text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <CreditCard className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                                {user ? "View Pricing Options" : "Sign In & See Pricing"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="#demo"
                                className="w-full sm:w-auto rounded-xl border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02] hover:bg-white/[0.05] text-white px-8 py-4 text-sm font-bold transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4 text-yellow-500" />
                                Book Enterprise Demo
                            </a>

                            <p className="text-[10px] text-gray-500 font-medium text-center mt-2">
                                Free tier available for open-source
                            </p>
                        </div>

                    </motion.div>
                </div>

            </div>
        </section>
    );
}