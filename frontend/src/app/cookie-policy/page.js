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

export default function CookiePolicyPage() {
  const lastUpdated = "June 23, 2026";

  return (
    <div className="relative min-h-screen bg-[#081a14] text-gray-100 grid-bg pb-24 overflow-hidden flex flex-col justify-between">
      <Background3D />
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <Reveal delay={100} className="space-y-5 mb-16 border-b border-white/10 pb-10">
          <Link href="/" className="text-xs text-gray-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-2 mb-6">
            <span>←</span> Back to Home
          </Link>
          <span className="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 text-[11px] text-cyan-400 font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            Legal Documentation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: {lastUpdated}</p>
        </Reveal>

        <div className="space-y-12 text-sm sm:text-base text-gray-300 leading-relaxed">
          <Reveal delay={200}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">01</span>
                What are Cookies?
              </h2>
              <p className="mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p>
                At AgentForge AI, we use cookies to keep you logged into your secure workspace, remember your preferences, and understand how you interact with our platform to improve task delivery.
              </p>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/20">02</span>
                How We Use Cookies
              </h2>
              <p className="mb-4">We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
              
              <div className="space-y-6 mt-6">
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 p-5 rounded-2xl border border-white/10 hover:scale-105 hover:-translate-y-2">
                  <h3 className="text-white font-bold mb-2 text-base">Essential Cookies</h3>
                  <p className="text-sm text-gray-400">These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Without these cookies, the task evaluation workspace cannot function securely.</p>
                </div>
                
                <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 p-5 rounded-2xl border border-white/10 hover:scale-105 hover:-translate-y-2">
                  <h3 className="text-white font-bold mb-2 text-base">Performance and Functionality Cookies</h3>
                  <p className="text-sm text-gray-400">These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your domain expertise selection) may become unavailable.</p>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 p-5 rounded-2xl border border-white/10 hover:scale-105 hover:-translate-y-2">
                  <h3 className="text-white font-bold mb-2 text-base">Analytics and Customization Cookies</h3>
                  <p className="text-sm text-gray-400">These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm border border-indigo-500/20">03</span>
                How can you control cookies?
              </h2>
              <p className="mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
              </p>
              <p>
                You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </p>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="bg-[#0f261e]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/20">04</span>
                Updates to this Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
