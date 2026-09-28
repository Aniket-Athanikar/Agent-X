"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, User, Layers, Briefcase, Brain, CreditCard } from "lucide-react";
import { useAuth } from "@/services/authContext";
import Link from "next/link";
import AgentXLogo from "@/components/AgentXLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const links = [
    { name: "Workspace", href: "/workspace", icon: Briefcase },
    { name: "Pricing", href: user ? "/billing" : "/register", icon: CreditCard },
  ];

  return (
    <motion.nav initial={false} className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-150 bg-[#030712] border-b border-cyan-500/10 ${isScrolled ? "py-4" : "py-6"}`}>

      {/* Glowing Dotted Pattern Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(16,185,129,0.3) 2px, transparent 0)",
          backgroundSize: "36px 36px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 tracking-tight group">
          <div className="relative flex items-center justify-center">
            <AgentXLogo className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-white">
            AGENT-<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">X</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const Icon = link.icon;
            return (
            <Link key={link.name} href={link.href} className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 hover:-translate-y-0.5">
              <Icon className="w-4 h-4 text-emerald-400" />
              {link.name}
            </Link>
          )})}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 mr-2 border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 rounded-full">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                  alt="User Avatar" 
                  className="w-7 h-7 rounded-full bg-cyan-900/50 border border-cyan-400/30 group-hover:border-cyan-300 transition-colors" 
                />
                <span className="text-white text-[11px] font-bold uppercase tracking-wide group-hover:text-cyan-200 transition-colors">{user.fullName}</span>
              </div>
              <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center gap-2 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                <LayoutDashboard className="w-3 h-3" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all">
                Logout <LogOut className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[11px] font-bold text-gray-300 hover:text-white uppercase tracking-widest hover:bg-white/[0.1] hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2">
                <User className="w-3 h-3" /> Sign In
              </Link>
              <Link href="/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[11px] font-bold flex items-center gap-2 hover:opacity-90 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all">
                Launch Workspace <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-cyan-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#030712]/95 backdrop-blur-3xl border-b border-cyan-500/20 relative z-10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                <Link key={link.name} href={link.href} className="text-sm font-bold text-gray-400 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Icon className="w-5 h-5 text-emerald-400" />
                  {link.name}
                </Link>
              )})}
              <div className="h-px bg-cyan-500/10 my-2" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2 p-2 bg-cyan-950/30 rounded-lg border border-cyan-500/20 group">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                      alt="User Avatar" 
                      className="w-9 h-9 rounded-full bg-cyan-900/50 border border-cyan-400/30 group-hover:border-cyan-300 transition-colors" 
                    />
                    <span className="text-white text-sm font-bold uppercase tracking-wide group-hover:text-cyan-200 transition-colors">{user.fullName}</span>
                  </div>
                  <Link href="/dashboard" className="text-sm font-bold text-cyan-400 uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { setIsOpen(false); handleLogout(); }} className="text-sm font-bold text-red-400 uppercase tracking-widest text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className="text-sm font-bold text-emerald-400 uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                    Launch Workspace
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
