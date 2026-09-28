"use client";
import AgentXLogo from "@/components/AgentXLogo";
import Background3D from '@/components/Background3D';


import LoginForm from "@/auth/LoginForm";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center px-4 py-16 overflow-hidden">
      <Background3D />
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.35) 2px, transparent 0)",
          backgroundSize: "36px 36px"
        }}
      />

      <div className="glow-glow-top" />
      <div className="glow-glow-bottom" />

      {/* Subtle vertical lines */}
      <div className="absolute inset-0 flex justify-around pointer-events-none opacity-[0.03]">
        <div className="w-px h-full bg-white"></div>
        <div className="w-px h-full bg-white"></div>
        <div className="w-px h-full bg-white"></div>
        <div className="w-px h-full bg-white"></div>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-20 text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
      </Link>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-5xl glass rounded-3xl overflow-hidden grid lg:grid-cols-12 shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-cyan-500/30"
      >

        {/* Left Section (Branding) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8 xl:p-12 border-r border-cyan-500/20 bg-black/40 backdrop-blur-xl/20 relative overflow-hidden">
          {/* Animated Blob */}
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse-glow pointer-events-none"></div>

          <div className="relative z-10 space-y-6 animate-slide-in-left">
            <div className="flex items-center gap-3 mb-6">
              <AgentXLogo className="w-12 h-12" />
              <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1.5 text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                Login AgentForge
              </span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white font-albert">
              Train the next generation of
              <span className="text-gradient block mt-1">Frontier Models</span>
            </h1>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Sign in to access your workspace, claim high-complexity tasks, and contribute to cutting-edge AI evaluation.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">High-Impact Work</h4>
                  <p className="text-xs text-gray-400 mt-1">Shape the reasoning capabilities of leading LLMs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Premium Compensation</h4>
                  <p className="text-xs text-gray-400 mt-1">Earn top-of-market rates for your specialized expertise.</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 mt-4 border-t border-cyan-500/20 flex gap-6">
              <div>
                <h4 className="text-xl font-bold text-white">10K+</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Experts</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">50+</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Countries</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">$25M</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Funded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-[#030712]/80 backdrop-blur-sm">
          <div className="animate-slide-in-right w-full flex justify-center">
            <LoginForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
