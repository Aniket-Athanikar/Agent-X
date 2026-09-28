"use client";
import Background3D from '@/components/Background3D';


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";

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

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function AboutPage() {
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
              Our Story
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              We believe the future of artificial intelligence depends entirely on the quality of human intelligence guiding it
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Dark Content Section */}
      <section className="relative bg-[#0b1221] text-white py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(6,182,212,0.15)] border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto space-y-32">

          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal direction="right">
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src="/images/blog1.png" alt="Mission" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal direction="left">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white mb-6">The Alignment Problem is a Human Problem</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  In 24 June 2026, as frontier models scaled to trillion-parameter sizes, a stark reality emerged: algorithms were no longer the bottleneck. High-quality human data was Models were hallucinating legal precedents, misdiagnosing medical edge cases, and producing subtly flawed code because they were trained by gig workers lacking deep domain expertise
                </p>
                <p className="text-gray-400 text-lg leading-relaxed">
                  AgentForge was founded to solve this. We built an exclusive network that connects the world's leading foundational models with the top 1% of global experts across law, medicine, engineering, linguistics, and finance. We don't just label data; we shape the reasoning of tomorrow's AI
                </p>
              </div>
            </Reveal>
          </div>

          {/* Stats */}
          <div className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 rounded-[3rem] p-12 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: 2026, prefix: "Est. ", label: "Founded" },
                { value: 50, suffix: "+", label: "Countries Represented" },
                { value: 10, suffix: "M+", label: "Tasks Completed" },
                { value: 100, suffix: "%", label: "Human Evaluated" }
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 100} direction="scale">
                  <div>
                    <h4 className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      {stat.prefix}<AnimatedCounter value={stat.value} duration={2500} />{stat.suffix}
                    </h4>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div>
            <Reveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Our Core Values</h2>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Uncompromising Quality", desc: "We prioritize precision over speed. A single bad evaluation can taint a model's reasoning indefinitely." },
                { title: "Expert Empowerment", desc: "We compensate our network at the top of the market. True expertise deserves true compensation." },
                { title: "Safe Trajectories", desc: "We are deeply committed to AI safety, focusing heavily on adversarial red-teaming and harmlessness evaluations." }
              ].map((val, i) => (
                <Reveal key={i} delay={i * 100} direction="up">
                  <motion.div whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2 }} className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/50 transition-all cursor-pointer">
                    <h3 className="text-xl font-bold text-white mb-4">{val.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{val.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
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
              A AgentForge of experts training and evaluating AI models
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
