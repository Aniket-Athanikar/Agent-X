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

export default function TestimonialsPage() {
  const testimonials = [
    { name: "Dr. Sarah Jenkins", role: "Medical AI Evaluator", text: "AgentForge allows me to use my 15 years of clinical experience to ensure medical AI models are safe and accurate. The compensation is unmatched.", rating: 5, initial: "S", color: "bg-emerald-500 text-white" },
    { name: "Marcus Chen", role: "Senior Software Engineer", text: "Reviewing code generation models has sharpened my own skills. The platform is incredibly slick and the tasks are intellectually stimulating.", rating: 5, initial: "M", color: "bg-cyan-500 text-white" },
    { name: "Elena Rodriguez", role: "Legal AI Consultant", text: "As a practicing attorney, I need absolute flexibility. Here, I can log in, evaluate complex legal reasoning for an hour, and log off. It's the perfect side income.", rating: 5, initial: "E", color: "bg-indigo-500 text-white" },
    { name: "Dr. James Aris", role: "Data Scientist", text: "I've tried multiple annotation platforms. This is the only one that treats you like a true expert rather than a gig worker.", rating: 5, initial: "J", color: "bg-amber-500 text-white" },
    { name: "Aisha Patel", role: "Linguistics Expert", text: "Evaluating the nuances of translation and tone in frontier models is fascinating. The community of experts here is top-notch.", rating: 5, initial: "A", color: "bg-rose-500 text-white" },
    { name: "David Kim", role: "Financial Analyst", text: "Ensuring AI models don't hallucinate financial data is critical work. I'm proud to be part of the red-teaming effort here.", rating: 5, initial: "D", color: "bg-blue-500 text-white" }
  ];

  return (
    <div className="relative min-h-screen font-sans flex flex-col bg-[#020C09]">
      <Background3D />
      {/* 1. Dark Hero Section */}
      <section className="relative pt-28 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />
        
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(6,182,212,0.15)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-24">
          <Reveal delay={100} direction="up">
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight mb-6">
              Testimonials
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              Hear directly from the world-class professionals training the next generation of AI.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-4">What Our Experts Say</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Thousands of professionals rely on AgentForge for flexible, high-paying, intellectually stimulating work.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 100} direction="up">
                <div className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-3xl hover:bg-black/40 hover:border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 h-full flex flex-col hover:scale-105 hover:-translate-y-2">
                  <div className="flex text-emerald-500 mb-6 text-xl">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed flex-1 font-light italic">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-cyan-500/20/60">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${t.color}`}>
                      {t.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{t.name}</h4>
                      <p className="text-sm text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
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
              Join the <span className="text-emerald-400">Top 1%</span><br/>Global Experts
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
