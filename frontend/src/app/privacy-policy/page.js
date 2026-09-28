"use client";
import Background3D from '@/components/Background3D';


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

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

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 23, 2026";

  return (
    <div className="relative min-h-screen bg-[#081a14] text-gray-100 grid-bg pb-24 overflow-hidden flex flex-col justify-between">
      <Background3D />
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

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
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: {lastUpdated}</p>
        </Reveal>

        <div className="space-y-12 text-sm sm:text-base text-gray-300 leading-relaxed">
          <Reveal delay={200}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">01</span>
                Introduction
              </h2>
              <p className="mb-4">
                At AgentForge AI ("we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy details how we collect, use, disclose, and safeguard your data when you visit our website or participate in our AI training platform as an evaluator, reviewer, or developer.
              </p>
              <p>
                By accessing or using AgentForge AI, you agree to the terms of this Privacy Policy. If you do not agree with the terms outlined here, please do not access the site.
              </p>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/20">02</span>
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-bold mb-2">Personal Data</h3>
                  <p>We may collect personally identifiable information, such as your name, email address, educational background, professional experience, and payment information (processed via secure third-party gateways like Stripe or Deel) when you register as a contributor.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Derivative Data</h3>
                  <p>Our servers automatically collect information when you access the platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Task and Evaluation Data</h3>
                  <p>We collect and retain the code, text, reasoning, and justification you provide when evaluating AI models. This data is anonymized and used exclusively for the purpose of training frontier neural networks.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/20">03</span>
                How We Use Your Information
              </h2>
              <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Create and manage your expert account.</li>
                <li>Process your task evaluations and assign appropriate compensation.</li>
                <li>Email you regarding account status, payout confirmations, or new task availability.</li>
                <li>Analyze platform usage to improve UI/UX and optimize our task distribution algorithms.</li>
                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                <li>Comply with legal and regulatory obligations, including tax reporting for independent contractors.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">04</span>
                Disclosure of Your Information
              </h2>
              <p className="mb-4">We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties except in the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li><strong className="text-white">By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                <li><strong className="text-white">Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us, such as payment processing (e.g., Deel, PayPal), data analysis, email delivery, and hosting services.</li>
                <li><strong className="text-white">AI Research Partners:</strong> The evaluations and reasoning you provide (anonymized and stripped of personal identifiers) are shared with our AI laboratory partners to improve their frontier models.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/20">05</span>
                Data Security
              </h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
          </Reveal>
          
          <Reveal delay={700}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/20">06</span>
                Contact Us
              </h2>
              <p className="mb-4">
                If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at:
              </p>
              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 p-4 rounded-xl border border-white/10 text-sm font-mono text-emerald-400 hover:scale-105 hover:-translate-y-2">
                AgentForge AI Privacy Team<br/>
                privacy@agentforge.ai<br/>
                201 Spear St, San Francisco, CA 94105
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
