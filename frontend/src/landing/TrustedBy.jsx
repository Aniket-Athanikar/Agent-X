"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Award, RefreshCw, Zap, Server } from "lucide-react";

const partners = [
  { 
    id: "openai", 
    name: "OpenAI", 
    desc: "GPT-4o RLHF Onboarding", 
    x: 120, y: 70, 
    logs: [
      "[OPENAI] HANDSHAKE: SUCCESS (AES-256)",
      "[OPENAI] SYNCING GPT-4o RLHF AST GRAPHS...",
      "[OPENAI] CONNECTED: 1,402 ACTIVE CORES",
      "[OPENAI] TELEMETRY: OK (LATENCY 14ms)"
    ],
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" 
  },
  { 
    id: "anthropic", 
    name: "Anthropic", 
    desc: "Claude 3.5 System Audits", 
    x: 290, y: 50, 
    logs: [
      "[ANTHROPIC] PIPELINE ESTABLISHED",
      "[ANTHROPIC] RETRIEVING INTEGRITY COEFFICIENTS...",
      "[ANTHROPIC] VERIFIED CLAUDE 3.5 AST INDEX",
      "[ANTHROPIC] SHIELD LEVEL: 100% MAXIMUM"
    ],
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" 
  },
  { 
    id: "deepmind", 
    name: "Google DeepMind", 
    desc: "Gemini Reasoning Enablement", 
    x: 430, y: 150, 
    logs: [
      "[DEEPMIND] TUNNEL OPEN: GEMINI CORE",
      "[DEEPMIND] MAPPING AST REASONING GRAPH...",
      "[DEEPMIND] SYNC RATE: 99.85% (SUCCESS)",
      "[DEEPMIND] CONCURRENT THREADS: 12,402"
    ],
    color: "text-violet-400 border-violet-500/30 bg-violet-950/20" 
  },
  { 
    id: "meta", 
    name: "Meta AI", 
    desc: "Llama 3 Local Sandboxing", 
    x: 380, y: 280, 
    logs: [
      "[META] INGESTING LLAMA 3 WEIGHT VECTOR...",
      "[META] DEPLOYING LOCAL DOCKER SANDBOX...",
      "[META] RESOURCE PARSING INTEGRITY: OK",
      "[META] DOCKED REPOS: 412 WORKSPACES"
    ],
    color: "text-rose-400 border-rose-500/30 bg-rose-950/20" 
  },
  { 
    id: "microsoft", 
    name: "Microsoft", 
    desc: "Azure AI Safety Verification", 
    x: 210, y: 310, 
    logs: [
      "[AZURE] CONNECTED: EAST US HYPERCLUSTER",
      "[AZURE] INITIALIZING TRACE ENCLAVES...",
      "[AZURE] SECURITY SCHEMAS APPLIED",
      "[AZURE] QUOTA ALLOCATION: UNLIMITED"
    ],
    color: "text-amber-400 border-amber-500/30 bg-amber-950/20" 
  },
  { 
    id: "mistral", 
    name: "Mistral AI", 
    desc: "Large Scale Model Setup", 
    x: 80, y: 210, 
    logs: [
      "[MISTRAL] DEPLOYING MISTRAL LARGE INSTANCE",
      "[MISTRAL] CONNECTING AST VECTOR CACHE...",
      "[MISTRAL] TRACING PIPELINES: COMPLETE",
      "[MISTRAL] LATENCY STATE: 22ms"
    ],
    color: "text-teal-400 border-teal-500/30 bg-teal-950/20" 
  }
];

export default function TrustedBy() {
  const [activeId, setActiveId] = useState("openai");
  const [syncRate, setSyncRate] = useState(99.82);

  const activePartner = partners.find(p => p.id === activeId) || partners[0];

  // Randomly tick sync rates slightly
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncRate(prev => {
        const delta = (Math.random() - 0.5) * 0.02;
        return parseFloat(Math.min(100, Math.max(99, prev + delta)).toFixed(2));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle through partners if user is idle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId(prev => {
        const idx = partners.findIndex(p => p.id === prev);
        const nextIdx = (idx + 1) % partners.length;
        return partners[nextIdx].id;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-transparent border-t border-cyan-500/10 relative overflow-hidden z-10">
      
      {/* 3D Cybernetic Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(6,182,212,0.1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(6,182,212,0.1) 1.5px, transparent 1.5px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Radial Theme Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Metrics & Brand details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE INTEGRATIONS
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
              Trusted by the <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Frontier Labs</span>
            </h2>
            
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Agent-X interfaces directly with host APIs and secure cluster sandboxes to maintain live, zero-leak AST repositories. Select a cluster to query telemetry.
            </p>

            {/* Simulated Live Analytics */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cyan-500/10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-lg font-black text-white font-mono leading-none">{syncRate}%</span>
                </div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-mono font-bold">Workspace Sync Accuracy</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-lg font-black text-white font-mono leading-none">14.2ms</span>
                </div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-mono font-bold">Average Telemetry Ping</p>
              </div>
            </div>
          </div>

          {/* Right Column: Cybernetic Connection Mesh */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[500px] h-[360px] bg-black/45 backdrop-blur-md rounded-2xl border border-cyan-500/10 shadow-[0_0_50px_rgba(0,0,0,0.4)] p-4 flex flex-col justify-between overflow-hidden">
              
              {/* Animated Cluster Connections Map (SVG) */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Central Node representing Agent-X */}
                  <g transform="translate(250, 180)">
                    <circle r="36" className="fill-black stroke-cyan-500/20 stroke-2" />
                    <circle r="22" className="fill-cyan-950/40 stroke-cyan-400/40 stroke-[1.5] animate-pulse" />
                    <text textAnchor="middle" dy="4" className="fill-cyan-400 text-[10px] font-mono font-black tracking-tighter">ENGINE</text>
                  </g>

                  {/* Draw connection lines from outer partners to Center */}
                  {partners.map(p => {
                    const isActive = p.id === activeId;
                    return (
                      <g key={`line-${p.id}`}>
                        <line
                          x1={p.x}
                          y1={p.y}
                          x2={250}
                          y2={180}
                          className={`stroke-[1.5] transition-all duration-500 ${
                            isActive ? "stroke-cyan-400" : "stroke-cyan-500/10"
                          }`}
                          strokeDasharray={isActive ? "none" : "5,5"}
                        />
                        {isActive && (
                          <circle r="3" fill="#22C55E">
                            <animateMotion
                              path={`M ${p.x} ${p.y} L 250 180`}
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Partner Interactive Hotspots */}
                {partners.map(p => {
                  const isActive = p.id === activeId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveId(p.id)}
                      style={{ left: p.x - 28, top: p.y - 14 }}
                      className={`absolute px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-tight transition-all duration-300 shadow-md flex items-center gap-1.5 cursor-pointer z-10 ${
                        isActive
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-105"
                          : "bg-black/80 border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-cyan-500/25"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-gray-700"}`} />
                      {p.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>

              {/* Header inside the terminal wrapper */}
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2 relative z-10 w-full">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono text-[#8b949e] font-bold uppercase tracking-wider">SECURE TRACE MONITOR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">LIVE FEED</span>
                </div>
              </div>

              {/* Telemetry Output console */}
              <div className="h-16 flex flex-col justify-end bg-black/45 border border-cyan-500/5 p-2.5 rounded-lg relative z-10 w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePartner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1 font-mono text-[9px] text-[#8b949e] text-left"
                  >
                    {activePartner.logs.map((log, idx) => (
                      <p key={idx} className={idx === activePartner.logs.length - 1 ? "text-cyan-400 font-bold" : ""}>
                        {log}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
