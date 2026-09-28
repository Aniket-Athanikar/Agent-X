"use client";

import React, { use } from "react";
import Link from "next/link";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Code, Layers, ClipboardList, ShieldCheck, PlayCircle,
  Cpu, CheckCircle2, ChevronRight, Zap, Terminal, Sparkles, AlertCircle
} from "lucide-react";

const capabilitiesData = {
  "ai-code-explainer": {
    title: "AI Code Explainer",
    tagline: "Spans file boundaries to build mental models of complex codebases instantly.",
    icon: <Code className="w-12 h-12 text-primary" />,
    intro: "Don't get lost in massive files or complex dependency loops. AgentForge parses repository architecture, constructs call graphs, and explains functionality line-by-line in plain English.",
    features: [
      "Dependency Mapping: Trace how modules interact, from frontend actions to DB schemas.",
      "Inline Explainers: Explains variables, functions, and logic blocks with a single click.",
      "Legacy Code Translation: Convert legacy systems into clean documentation instantly.",
      "Interactive Q&A: Query specific parts of the codebase directly from your editor."
    ],
    mockup: (
      <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs text-text-primary p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-text-secondary">
          <span>auth_service.js</span>
          <span className="text-primary">AI Analyzed</span>
        </div>
        <div className="space-y-1">
          <p className="text-text-secondary">// Handles session renewal and token validation</p>
          <p><span className="text-pink-400">async function</span> <span className="text-blue-400">verifyAndRenew</span>(token) &#123;</p>
          <p className="pl-4"><span className="text-pink-400">try</span> &#123;</p>
          <p className="pl-8"><span className="text-pink-400">const</span> decoded = jwt.verify(token, process.env.SECRET);</p>
          <p className="pl-8 bg-primary/10 border-l-2 border-primary py-0.5 my-0.5"><span className="text-emerald-400">💡 AgentForge Explains:</span> Validates token against SECRET key. If valid, queries session redis cluster.</p>
          <p className="pl-8"><span className="text-pink-400">return await</span> redis.renew(decoded.sub);</p>
          <p className="pl-4">&#125; <span className="text-pink-400">catch</span> (err) &#123;</p>
          <p className="pl-8"><span className="text-pink-400">throw new</span> Error(<span className="text-yellow-300">"Session expired"</span>);</p>
          <p className="pl-4">&#125;</p>
          <p>&#125;</p>
        </div>
      </div>
    )
  },
  "architecture-visualizer": {
    title: "Architecture Visualizer",
    tagline: "Dynamically maps microservices, data streams, and database models.",
    icon: <Layers className="w-12 h-12 text-cyan-400" />,
    intro: "Outdated architectural drawings are a thing of the past. AgentForge inspects config files, infrastructure definitions, and database structures to draw beautiful, live system diagrams.",
    features: [
      "Live Network Maps: Visualize traffic paths, gateway endpoints, and messaging streams.",
      "Database Schema Graphing: Explore tables, foreign keys, and relations interactively.",
      "Container Relationships: View Kubernetes, Docker, and environment deployment paths.",
      "Diff Impact Assessment: Preview how schema changes propagate across services."
    ],
    mockup: (
      <div className="bg-[#07130E]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-6 space-y-4 relative min-h-[220px] flex flex-col justify-center items-center">
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-3 bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 border border-white/10 rounded-lg text-center font-bold text-[10px] hover:scale-105 hover:-translate-y-2">
            <span className="block text-cyan-400">Client UI</span>
            <span className="text-text-secondary text-[8px]">Next.js</span>
          </div>
          <ChevronRight className="w-4 h-4 text-primary animate-pulse" />
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center font-bold text-[10px]">
            <span className="block text-primary">API Gateway</span>
            <span className="text-text-secondary text-[8px]">Express.js</span>
          </div>
          <ChevronRight className="w-4 h-4 text-primary animate-pulse" />
          <div className="p-3 bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 border border-white/10 rounded-lg text-center font-bold text-[10px] hover:scale-105 hover:-translate-y-2">
            <span className="block text-yellow-400">Auth DB</span>
            <span className="text-text-secondary text-[8px]">Redis</span>
          </div>
        </div>
        <div className="w-full border-t border-dashed border-white/5 pt-4 text-[10px] text-center text-text-secondary">
          ✨ System architecture sync complete. 4 nodes analyzed.
        </div>
      </div>
    )
  },
  "jira-task-assistant": {
    title: "Jira Task Assistant",
    tagline: "Translate tickets and project boards directly into actionable source-code plans.",
    icon: <ClipboardList className="w-12 h-12 text-pink-400" />,
    intro: "Bridge the gap between product requirements and code files. Paste a ticket reference, and AgentForge details the specific logic files, steps, and changes needed to build the feature.",
    features: [
      "Automatic File Locating: Finds matching backend files and endpoint routes for the task.",
      "Mock Implementation Plans: Drafts step-by-step logic scripts for implementation.",
      "PR Description Drafts: Generates full documentation of changes for review.",
      "Review Verification: Validates that code changes satisfy criteria in Jira tickets."
    ],
    mockup: (
      <div className="bg-[#07130E]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-[10px] text-pink-400 font-semibold bg-pink-500/10 w-fit px-2 py-0.5 rounded">
          <AlertCircle className="w-3.5 h-3.5" /> Jira Ticket #AF-402
        </div>
        <p className="text-xs font-bold text-white">Title: Add verification email validation route</p>
        <div className="border-t border-white/5 pt-3 space-y-2">
          <p className="text-[10px] text-text-secondary font-bold uppercase">Files to modify:</p>
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[9px] bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 px-2 py-1 rounded border border-white/10 text-white font-mono">src/routes/auth.js</span>
            <span className="text-[9px] bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 px-2 py-1 rounded border border-white/10 text-white font-mono">src/services/email.js</span>
          </div>
        </div>
      </div>
    )
  },
  "setup-guide-automation": {
    title: "Setup Guide Automation",
    tagline: "Build custom interactive development sandboxes tailored to user configurations.",
    icon: <PlayCircle className="w-12 h-12 text-purple-400" />,
    intro: "Stop dealing with manual environment configurations. Setup Guide Automation determines system settings, verifies tool requirements, and provisions docker environments on Day 1.",
    features: [
      "OS Detection: Tailors configuration steps specifically to macOS, Linux, or Windows.",
      "One-click Command Generation: Generates required commands without syntax mistakes.",
      "Sandbox Provisioning: Automatically sets up development databases and tools.",
      "Permission Verification: Checks API keys, secrets, and auth setups before execution."
    ],
    mockup: (
      <div className="bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs p-4 space-y-2">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="pt-2 text-text-secondary space-y-1 text-[10px]">
          <p className="text-primary">$ agentforge env:setup</p>
          <p className="text-white">✔ OS Detected: Windows (Powershell)</p>
          <p className="text-white">✔ Verifying Node.js version (&gt;=18.0) ... Found v20.10.0</p>
          <p className="text-white">✔ Downloading environment templates ... Success</p>
          <p className="text-cyan-400">💡 Setting up Docker Compose dev databases...</p>
        </div>
      </div>
    )
  },
  "soc2-data-compliance": {
    title: "SOC2 Data Compliance",
    tagline: "Frontier data privacy structures aligned with high enterprise security standards.",
    icon: <ShieldCheck className="w-12 h-12 text-rose-400" />,
    intro: "Security is built into every layer of AgentForge. Your proprietary files, secrets, database fields, and metadata never exit your network boundaries, ensuring full SOC2 type-II alignment.",
    features: [
      "Network Isolation: Keep all LLM tokens and model interactions within local boundaries.",
      "Data Masking: Mask personal identifiable data, keys, and values before query validation.",
      "Full Activity Logs: Log all code accesses, queries, and integrations for clear audits.",
      "SOC2 Compliance Auditing: Verified pipelines maintaining SOC2 certification specs."
    ],
    mockup: (
      <div className="bg-[#07130E]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-bold text-white">Data Compliance Monitor</span>
          </div>
          <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold uppercase">SOC2 ALIGNED</span>
        </div>
        <div className="space-y-2 border-t border-white/5 pt-3 text-[10px] text-text-secondary">
          <div className="flex justify-between"><span>Data Masking Encryption</span><span className="text-emerald-400 font-bold">ACTIVE</span></div>
          <div className="flex justify-between"><span>Enterprise Vault Secrets</span><span className="text-emerald-400 font-bold">SECURED</span></div>
          <div className="flex justify-between"><span>Local VPC Ingestion</span><span className="text-emerald-400 font-bold">ISOLATED</span></div>
        </div>
      </div>
    )
  }
};

export default function CapabilityPage({ params }) {
  const resolvedParams = use(params);
  const capability = capabilitiesData[resolvedParams.slug] || {
    title: "Capability Not Found",
    tagline: "Please select a valid capability.",
    icon: <Cpu className="w-12 h-12 text-primary" />,
    intro: "The requested capability details are unavailable. Double-check your link details.",
    features: [],
    mockup: null
  };

  return (
    <main className="min-h-screen aurora-bg text-text-primary font-sans relative">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Home
        </Link>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 border border-white/10 flex items-center justify-center hover:scale-105 hover:-translate-y-2">
              {capability.icon}
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black font-albert tracking-tight text-white leading-tight">
                {capability.title}
              </h1>
              <p className="text-lg text-primary font-medium tracking-wide">
                {capability.tagline}
              </p>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              {capability.intro}
            </p>
          </div>

          {/* Right Column: Interactive Mockup */}
          {capability.mockup && (
            <div className="lg:col-span-5 relative w-full">
              {capability.mockup}
              {/* Decorative behind glow */}
              <div className="absolute inset-0 bg-primary/5 blur-[60px] -z-10" />
            </div>
          )}
        </div>
      </section>

      {/* Details & Features */}
      {capability.features.length > 0 && (
        <section className="py-20 border-t border-white/5 bg-black/20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-albert text-white">How it empowers your engineers</h2>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                AgentForge integrates seamlessly into your code pipelines, providing automated explanations, interactive visualizations, and continuous task assistance.
              </p>
              <div className="grid gap-4">
                {capability.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-white">{feat.split(":")[0]}</h3>
                      <p className="text-[10px] text-text-secondary mt-0.5">{feat.split(":")[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#07130E]/30 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-[10px] text-primary px-2.5 py-0.5 rounded font-bold uppercase">
                  <Zap className="w-3.5 h-3.5" /> Fast Integration
                </div>
                <h3 className="text-lg font-bold text-white">Get Started with {capability.title}</h3>
                <p className="text-xs text-text-secondary font-light">Configure this module directly in your workspace dashboard to begin analyzing files and mapping flows.</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:scale-102 active:scale-98 transition-all"
                >
                  Enable Capability
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 hover:bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/10 font-bold text-xs text-white transition-all"
                >
                  Contact Enterprise
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
