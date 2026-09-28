"use client";
import AgentXLogo from "@/components/AgentXLogo";
import Background3D from '@/components/Background3D';


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/authContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = forgotPassword(email);
      setLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/reset-password");
        }, 1500);
      } else {
        setError(res.message);
      }
    }, 800); // Simulate network delay
  };

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
        href="/login"
        className="absolute top-8 left-8 z-20 text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Sign In
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
                AGENT FORGE
              </span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white">
              Password
              <span className="text-gradient block mt-1">Recovery</span>
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Retrieve access to your secure workspace, analytics dashboards, and automated growth engine
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Secure Access</h4>
                  <p className="text-xs text-gray-400 mt-1">End-to-end encrypted account recovery</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-[#030712]/80 backdrop-blur-sm">
          <div className="animate-slide-in-right w-full flex justify-center">

            {/* Inner Form Card */}
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#0b1221] rounded-2xl flex items-center justify-center border border-cyan-500/30 mx-auto mb-4 text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Forgot Password</h2>
                <p className="text-xs text-gray-400 mt-1.5">Enter your email address to request a reset code</p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 animate-slide-in-left">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 animate-slide-in-left flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email match found! Redirecting to reset page...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0b1221] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 focus:bg-cyan-900/30 hover:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3.5 text-sm font-bold text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Code...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500">
                Remembered your password?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  Sign In
                </Link>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
