"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Network, Zap, Globe, Database, Code } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-emerald-400" />,
    title: "Autonomous Agents",
    description: "Deploy AI agents that understand your codebase and execute tasks independently.",
  },
  {
    icon: <Network className="w-8 h-8 text-blue-400" />,
    title: "Intelligent Orchestration",
    description: "Coordinate multiple agents across different repositories, pipelines, and environments.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption, SOC2 compliance, and role-based access control.",
  },
  {
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    title: "Real-time Execution",
    description: "Watch your AI agents write, test, and deploy code in real-time.",
  },
  {
    icon: <Globe className="w-8 h-8 text-cyan-400" />,
    title: "Global Distribution",
    description: "Scale your AI workforce instantly across multi-cloud environments.",
  },
  {
    icon: <Database className="w-8 h-8 text-teal-400" />,
    title: "Database Sync",
    description: "Automatically index and synchronize schemas across all databases.",
  },
  {
    icon: <Code className="w-8 h-8 text-indigo-400" />,
    title: "Deep Code Analysis",
    description: "Run advanced static analysis and automated vulnerability detection.",
  },
];

export default function PlatformSection() {
  return (
    <section id="platform" className="relative py-32 bg-[#030712] overflow-hidden border-t border-cyan-500/10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Glowing Dotted Pattern Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.2) 2px, transparent 0)",
          backgroundSize: "36px 36px"
        }}
      />

      <div className="container mx-auto px-6 relative z-10 mb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            The Ultimate <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">AI Engineering Platform</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Agent-X provides a comprehensive ecosystem to build, manage, and scale your autonomous AI workforce with unprecedented control and visibility
          </motion.p>
        </div>
      </div>

      {/* Auto Carousel Marquee */}
      <div className="relative w-full flex overflow-hidden group py-10">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex gap-8 px-4 w-max"
        >
          {/* Double array to create seamless loop */}
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="w-[350px] shrink-0 bg-white/[0.02] border border-cyan-500/10 rounded-[2rem] p-8 hover:bg-black/40 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300 relative overflow-hidden group/card backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
              <div className="mb-8 p-4 bg-[#030712]/80 shadow-inner shadow-cyan-500/20 rounded-xl inline-block border border-white/5 relative z-10 group-hover/card:scale-110 transition-transform duration-300 group-hover/card:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm relative z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
