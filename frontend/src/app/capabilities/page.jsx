"use client";
import Background3D from '@/components/Background3D';


import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Network, Code2, BrainCircuit, ScanSearch, ShieldCheck, Workflow, ArrowRight } from "lucide-react";

const capabilities = [
  {
    id: "autonomous-workflows",
    title: "Autonomous Workflows",
    desc: "Deploy self-healing agents that plan, orchestrate, and execute complex multi-step pipelines entirely autonomously.",
    icon: <Workflow className="w-8 h-8 text-cyan-400" />,
    color: "cyan"
  },
  {
    id: "code-intelligence",
    title: "Code Intelligence",
    desc: "Deep codebase parsing capable of automated refactoring, generating unit tests, and pinpointing complex logic bugs.",
    icon: <Code2 className="w-8 h-8 text-emerald-400" />,
    color: "emerald"
  },
  {
    id: "contextual-memory",
    title: "Contextual Memory",
    desc: "Infinite context window management. Agents retain deep project history, architectural decisions, and coding standards.",
    icon: <BrainCircuit className="w-8 h-8 text-[#6D5DFB]" />,
    color: "indigo"
  },
  {
    id: "multi-modal",
    title: "Multi-Modal Parsing",
    desc: "Simultaneously process and cross-reference architecture diagrams, code files, and natural language specifications.",
    icon: <ScanSearch className="w-8 h-8 text-cyan-400" />,
    color: "cyan"
  },
  {
    id: "security",
    title: "Security & Sandboxing",
    desc: "Isolated, highly secure Docker environments for agents to execute, test, and validate code without system risk.",
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    color: "emerald"
  },
  {
    id: "api-orchestration",
    title: "API Orchestration",
    desc: "Seamless integration layer allowing agents to securely authenticate and control external enterprise tools and APIs.",
    icon: <Network className="w-8 h-8 text-[#6D5DFB]" />,
    color: "indigo"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export default function CapabilitiesPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="relative min-h-screen bg-[#030712] font-sans flex flex-col overflow-x-hidden selection:bg-cyan-500/30">
      <Background3D />
      <Navbar />

      {/* Global Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      
      {/* Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      <main className="flex-1 relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-xs text-cyan-400 font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            Platform Capabilities
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]">
            Unleash <span className="bg-gradient-to-r from-[#6D5DFB] via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Autonomous</span> Potential
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
            Discover the suite of intelligence, orchestration, and execution capabilities that power the next generation of software development.
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
        >
          {capabilities.map((cap) => (
            <Link key={cap.id} href={`/capabilities/${cap.id}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2, y: -5 }}
                className="group h-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-3xl flex flex-col items-start text-left cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-400/50 relative overflow-hidden"
              >
                {/* Internal Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] relative z-10">
                  {cap.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-cyan-400 transition-colors">
                  {cap.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed relative z-10 mb-8 flex-grow">
                  {cap.desc}
                </p>

                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform relative z-10">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
