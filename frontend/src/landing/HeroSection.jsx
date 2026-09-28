"use client";

import { useState } from "react";
import { ArrowRight, Cpu, Layers, Sparkles } from "lucide-react";
import { useAuth } from "@/services/authContext";

export default function HeroSection() {
  const { user } = useAuth();
  const [promptInput, setPromptInput] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const query = promptInput.trim();
    if (query) window.location.href = `${user ? "/dashboard" : "/register"}?prompt=${encodeURIComponent(query)}`;
  };

  return <section className="relative min-h-[720px] pt-36 pb-20 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(109,93,251,.12),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(6,182,212,.10),transparent_28%)]" />
    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 space-y-7"><div className="inline-flex items-center gap-2 bg-[#6D5DFB]/10 border border-[#6D5DFB]/30 rounded-full px-4 py-1.5 text-xs text-[#a99dfd] font-bold"><Sparkles className="w-3.5 h-3.5" />Next-Generation Autonomous Engineering</div><div className="space-y-4"><h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">One AI Workspace<br />Every Team<br /><span className="text-cyan-300">Every Project With Agent-X</span></h1><p className="text-lg md:text-xl text-gray-300 max-w-2xl font-medium leading-relaxed">Agent-X connects people, projects, documentation, repositories, and APIs in one intelligent workspace.</p></div><form onSubmit={submit} className="max-w-lg bg-[#0b1020] border border-white/[0.12] rounded-2xl p-2.5 flex items-center shadow-lg"><input aria-label="Ask Agent-X" placeholder="Ask Agent-X: Analyze our React platform..." value={promptInput} onChange={(event) => setPromptInput(event.target.value)} className="flex-1 bg-transparent text-white text-sm px-3 placeholder-gray-500 focus:outline-none" /><button className="bg-[#6D5DFB] hover:bg-[#7C3AED] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5">Build <ArrowRight className="w-3.5 h-3.5" /></button></form><div className="flex flex-wrap gap-4"><a href={user ? "/workspace" : "/register"} className="rounded-xl bg-[#6D5DFB] hover:bg-[#7C3AED] text-white px-7 py-4 text-sm font-bold transition-colors">Launch Live Workspace</a><a href={user ? "/billing" : "/register"} className="rounded-xl border border-white/[0.14] text-gray-200 hover:bg-white/[0.06] px-7 py-4 text-sm font-bold transition-colors">View Pricing Scale</a></div></div>
      <div className="lg:col-span-5 grid gap-4"><div className="rounded-2xl border border-cyan-400/20 bg-[#0b1020] p-6 shadow-xl"><div className="flex items-center gap-3 text-cyan-300"><Cpu className="w-6 h-6" /><div><h2 className="font-bold">AI Employee OS</h2><p className="text-xs text-gray-400 mt-1">Automate code, tests, and documentation.</p></div></div><div className="mt-6 border-t border-white/10 pt-4 font-mono text-xs text-gray-400 space-y-2"><p className="text-white">$ init agent-x --connect</p><p className="text-emerald-400">✓ Workspace ready</p><p>▶ Ask a question to start exploring.</p></div></div><div className="rounded-2xl border border-emerald-400/20 bg-[#0b1020] p-6 flex items-center gap-3"><Layers className="w-6 h-6 text-emerald-300" /><div><h2 className="font-bold">Knowledge Graph</h2><p className="text-xs text-gray-400 mt-1">Maps repositories and documentation clearly.</p></div></div></div>
    </div>
  </section>;
}
