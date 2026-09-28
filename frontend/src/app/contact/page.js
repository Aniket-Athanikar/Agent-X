"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen font-sans flex flex-col bg-[#020C09]">
      <Background3D />
      {/* 1. Dark Hero Section */}
      <section className="relative pt-28 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />

        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(16,185,129,0.15)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-24">
          <Reveal delay={100} direction="up">
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight mb-6">
              Get in Touch
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              Have questions about becoming an expert, or need support with your evaluations? We are here to help
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">

            {/* Left side: Info & Map */}
            <Reveal direction="right">
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-bold mb-6">Our HQ</h3>
                  <div className="space-y-4 text-gray-400 text-lg">
                    <p className="flex items-center gap-4">
                      <span className="text-emerald-500 text-2xl">📍</span> Hinjawadi Phase 3, IT Park, Pune, Maharastra
                    </p>
                    <p className="flex items-center gap-4">
                      <span className="text-emerald-500 text-2xl">✉️</span> expert-support@agentforge.ai
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-cyan-500/20">
                    <h4 className="font-bold text-lg mb-2">Support Hours</h4>
                    <p className="text-gray-400">24/7 Global Support<br />for Active Experts</p>
                  </div>
                  <div className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] p-6 rounded-2xl border border-cyan-500/20">
                    <h4 className="font-bold text-lg mb-2">Enterprise</h4>
                    <p className="text-gray-400">Looking for model evaluation? <Link href="#" className="text-emerald-600 font-semibold hover:underline">Contact Sales</Link></p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right side: Form */}
            <Reveal direction="left">
              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-cyan-500/20 relative overflow-hidden hover:scale-105 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10" />
                <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'sent'}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <><span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> Sending...</>
                    ) : status === 'sent' ? (
                      <>✓ Message Sent!</>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* 3. Dark CTA Section */}
      <section className="relative bg-[#020C09] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="absolute -left-[10%] top-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-[10%] bottom-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="absolute left-0 top-0 opacity-40 pointer-events-none w-1/3 h-full mix-blend-screen">
          <Image src="/images/blog2.png" alt="Orb" fill sizes="33vw" className="object-cover object-left opacity-30" />
        </div>
        <div className="absolute right-0 bottom-0 opacity-40 pointer-events-none w-1/3 h-full mix-blend-screen">
          <Image src="/images/blog4.png" alt="Orb" fill sizes="33vw" className="object-cover object-right opacity-30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Reveal delay={100} direction="scale">
            <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Join the <span className="text-emerald-400">Top 1%</span><br />Global Experts
            </h2>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl text-gray-400 font-light">
              A network of experts training and evaluating AI models.
            </p>
          </Reveal>
          <Reveal delay={300} direction="up" className="pt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] text-white font-medium transition-all group"
            >
              Apply Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
