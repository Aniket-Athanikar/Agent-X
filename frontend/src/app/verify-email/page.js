"use client";
import AgentXLogo from "@/components/AgentXLogo";
import Background3D from '@/components/Background3D';


import VerifyEmailForm from "@/auth/VerifyEmailForm";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
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
        href="/register"
        className="absolute top-8 left-8 z-20 text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Register
      </Link>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-5xl glass rounded-3xl overflow-hidden grid lg:grid-cols-12 shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-cyan-500/30"
      >
        
        {/* Left Section (Branding) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center p-8 xl:p-12 border-r border-cyan-500/20 bg-black/40 backdrop-blur-xl/50 relative overflow-hidden">
          {/* Animated Blob */}
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse-glow pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6 animate-slide-in-left">
            <div className="flex items-center gap-3 mb-6">
              <AgentXLogo className="w-12 h-12" />
              <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1.5 text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                AGENT-X AI NETWORK
              </span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white">
              Verify Your
              <span className="text-gradient block mt-1">Identity</span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              We require email verification to ensure the integrity and security of the Agent-X Network.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Trust & Safety</h4>
                  <p className="text-xs text-gray-400 mt-1">Keeps the network secure for all elite validators.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-[#030712]/80 backdrop-blur-sm">
          <div className="animate-slide-in-right w-full flex justify-center">
            <VerifyEmailForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
