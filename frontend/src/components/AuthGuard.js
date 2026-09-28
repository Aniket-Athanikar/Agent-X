"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/authContext";
import { getOnboardingStatus } from "@/services/onboardingApi";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden">
        {/* Zoombing Dotted Grid Pattern */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 2px, transparent 0)",
            backgroundSize: "36px 36px"
          }}
        />

        {/* Ambient Deep Space Aurora Glows */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#6D5DFB]/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative flex flex-col items-center z-10">
          {/* Glowing Aura Core */}
          <div className="absolute w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse" />
          {/* Animated Spinner with Gradient Outline */}
          <div className="w-14 h-14 border-[3px] border-cyan-500/10 border-t-emerald-400 border-r-cyan-400 rounded-full animate-spin relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
          <span className="mt-6 text-[10px] font-bold font-mono tracking-[0.25em] bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase animate-pulse">
            Verifying Identity
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return children;
}
