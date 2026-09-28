"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Calculator, Sparkles, TrendingUp, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/services/authContext";

// Hydration Wrapper ensures animations only run on the client
const HydrationWrapper = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);
    if (!isMounted) return <section className="py-32 bg-[#030712]" />;
    return <>{children}</>;
};

// 3D Tilt Card Component
function TiltCard({ children, className, delay = 0 }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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

export default function PricingSection() {
    const { user } = useAuth();
    const [teamSize, setTeamSize] = useState(10);

    const averageHourlyCost = 65;
    const hoursSavedPerDeveloper = 18;
    const monthlyCostPerSeat = 49;
    const monthlySavings = teamSize * hoursSavedPerDeveloper * averageHourlyCost;
    const platformCost = teamSize * monthlyCostPerSeat;
    const netSavings = monthlySavings - platformCost;

    const pricingTiers = [
        { name: "Developer Free", price: "$0", period: "forever", desc: "For exploring public open-source codebases.", features: ["1 Public Repository", "Basic AST Parsing", "100 AI Queries/mo", "Community Support"], highlight: false },
        { name: "Workspace Pro", price: "$49", period: "per seat / mo", desc: "For fast-growing startups and professional teams.", features: ["Unlimited Private Repos", "Full Knowledge Graph", "Unlimited AI Prompts", "Autonomous PR Review", "Priority Support"], highlight: true },
        { name: "Enterprise OS", price: "Custom", period: "tailored", desc: "For large divisions requiring isolation and custom models.", features: ["VPC Deployment", "Custom LLM Fine-tuning", "Advanced SSO/SAML", "SOC2 Compliance", "Dedicated Engineer"], highlight: false }
    ];

    return (
        <HydrationWrapper>
            <section id="pricing" className="relative py-32 overflow-hidden bg-transparent border-t border-cyan-500/10">

                {/* Cinematic Zooming Background */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 pointer-events-none opacity-40"
                    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.2) 2px, transparent 0)", backgroundSize: "36px 36px" }}
                />

                {/* Deep Space Aurora Glows */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-24">

                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#06B6D4] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3" /> Flexible Scaling & Value
                        </motion.h2>
                        <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white">Transparent Pricing, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Measurable ROI</span></motion.h3>
                    </div>

                    {/* 3D ROI Calculator */}
                    <TiltCard delay={0.2} className="p-8 md:p-12 rounded-[2rem] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-black/60 border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl group hover:border-cyan-500/40 transition-colors">

                        <div className="lg:col-span-7 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-transform"><Calculator className="w-6 h-6 text-cyan-400" /></div>
                                <h4 className="text-2xl font-black text-white">Interactive ROI Calculator</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between font-bold"><span className="text-gray-300 text-sm">Team Size</span><span className="text-cyan-400 text-sm">{teamSize} Devs</span></div>
                                <input type="range" min="5" max="250" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full h-3 bg-white/[0.05] rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]" />
                            </div>
                        </div>

                        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                            <div className="bg-[#030712] border border-white/[0.05] p-6 rounded-2xl shadow-inner"><Users className="w-6 h-6 text-gray-400 mb-2" /><div className="text-2xl font-black text-white">{teamSize}</div><div className="text-[10px] text-gray-500 uppercase">Devs</div></div>
                            <div className="bg-[#030712] border border-white/[0.05] p-6 rounded-2xl shadow-inner"><TrendingUp className="w-6 h-6 text-emerald-400 mb-2" /><div className="text-2xl font-black text-white">{teamSize * hoursSavedPerDeveloper}h</div><div className="text-[10px] text-gray-500 uppercase">Saved/mo</div></div>
                            <div className="col-span-2 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"><DollarSign className="w-8 h-8 text-cyan-400 mb-2" /><div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">${netSavings.toLocaleString()}</div><div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mt-1">Net Monthly Savings</div></div>
                        </div>

                    </TiltCard>

                    {/* 3D Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {pricingTiers.map((tier, idx) => (
                            <TiltCard key={tier.name} delay={0.4 + idx * 0.1} className={`h-full p-8 rounded-[2rem] border backdrop-blur-md flex flex-col justify-between ${tier.highlight ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]" : "border-white/[0.08] bg-[#09090b]/60 shadow-xl"}`}>
                                <div>
                                    <h4 className="text-xl font-black text-white mb-2">{tier.name}</h4>
                                    <div className="text-4xl font-black text-white mb-6 tracking-tight">{tier.price}<span className="text-sm font-medium text-gray-500 tracking-normal">/{tier.period}</span></div>
                                    <ul className="space-y-4 mb-8">
                                        {tier.features.map(f => <li key={f} className="flex gap-3 text-sm text-gray-300 font-medium"><Check className="w-5 h-5 text-emerald-400 shrink-0" /> {f}</li>)}
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (tier.name === "Enterprise OS") {
                                            window.location.href = "/contact";
                                        } else if (user) {
                                            window.location.href = "/billing";
                                        } else {
                                            window.location.href = "/register";
                                        }
                                    }}
                                    className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-lg hover:-translate-y-1 cursor-pointer ${tier.highlight ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.05]"}`}
                                >
                                    Select Plan
                                </button>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>
        </HydrationWrapper>
    );
}