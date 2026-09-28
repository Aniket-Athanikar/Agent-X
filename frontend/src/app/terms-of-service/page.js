"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import Background3D from '@/components/Background3D';

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  const dirs = { up: 'translate-y-10', left: '-translate-x-10', right: 'translate-x-10', scale: 'scale-95' };
  return (
    <div ref={ref} className={`${className} transition-all duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${visible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${dirs[direction] || dirs.up}`}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
  );
}

export default function TermsOfServicePage() {
  const lastUpdated = "June 23, 2026";

  return (
    <div className="relative min-h-screen bg-[#081a14] text-gray-100 grid-bg pb-24 overflow-hidden flex flex-col justify-between">
      <Background3D />
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <Reveal delay={100} className="space-y-5 mb-16 border-b border-white/10 pb-10">
          <Link href="/" className="text-xs text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 mb-6">
            <span>←</span> Back to Home
          </Link>
          <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-[11px] text-emerald-400 font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            Legal Documentation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: {lastUpdated}</p>
        </Reveal>

        <div className="space-y-12 text-sm sm:text-base text-gray-300 leading-relaxed">
          <Reveal delay={200}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">01</span>
                Agreement to Terms
              </h2>
              <p className="mb-4">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and AgentForge AI ("Company", "we", "us", or "our"), concerning your access to and use of the https://agentforge.ai website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
              <p>
                You agree that by accessing the Site and participating in our evaluation tasks, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/20">02</span>
                Independent Contractor Status
              </h2>
              <p className="mb-4">
                By registering on AgentForge AI, you acknowledge and agree that you are acting as an independent contractor. Nothing in these Terms of Service shall be construed as creating an employer-employee relationship, a partnership, or a joint venture between you and AgentForge AI.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>You are solely responsible for all taxes, withholdings, and other statutory obligations arising from your compensation.</li>
                <li>You have full discretion to choose when, where, and how frequently you claim tasks on the platform.</li>
                <li>AgentForge AI does not guarantee a minimum amount of work or compensation.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/20">03</span>
                Confidentiality and Non-Disclosure
              </h2>
              <p className="mb-4">
                As an expert evaluator, you will be exposed to proprietary prompts, unreleased AI models, and confidential data belonging to AgentForge AI and our laboratory partners.
              </p>
              <p className="text-emerald-400 font-semibold mb-4">You strictly agree to the following confidentiality protocols:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Do not copy, screenshot, record, or distribute any tasks, prompts, or model responses from the workspace.</li>
                <li>Do not discuss the specifics of unreleased models on public forums, social media, or with third parties.</li>
                <li>Do not use automated bots, scraping tools, or scripts to extract data from the platform.</li>
              </ul>
              <p className="mt-4 text-red-400 text-xs font-bold uppercase tracking-wide">Violation of these terms will result in immediate termination and potential legal action.</p>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">04</span>
                Task Quality and Accuracy
              </h2>
              <p className="mb-4">
                AgentForge AI maintains a strict quality control system. By submitting an evaluation, you warrant that your work is original, accurate, and reflects your true expert judgment.
              </p>
              <p>
                We reserve the right to reject submissions, withhold compensation, or lower your internal trust score if your evaluations are found to be rushed, plagiarized, low-effort, or factually incorrect. Consistently falling below our 95% accuracy threshold may result in account suspension.
              </p>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/20">05</span>
                Intellectual Property Rights
              </h2>
              <p>
                Any justifications, reasoning, code corrections, or text generated by you while completing tasks on the platform become the exclusive property of AgentForge AI. You hereby assign all intellectual property rights, including copyrights, in such submissions to AgentForge AI in exchange for the financial compensation agreed upon for the task.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
