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

const faqs = [
  { q: "What does an AI Evaluator do?", a: "AI Evaluators interact with frontier language models, providing prompts, rating responses, and checking for factual accuracy, logic, and safety. Your feedback directly updates the model's weights via RLHF." },
  { q: "How much can I earn?", a: "Compensation depends on your domain expertise and the complexity of the tasks. Specialized experts (e.g., Medical, Legal, Senior SWEs) can earn significantly above standard market rates, often $50-$100+/hr." },
  { q: "Do I need a background in AI or Machine Learning?", a: "No. We need domain experts. If you are a doctor, we need your medical knowledge. If you are a lawyer, we need your legal reasoning. The AI handles the algorithms; you provide the ground truth." },
  { q: "Is the schedule flexible?", a: "Yes, 100% flexible. You can log in and claim tasks whenever you have free time. Whether it's 2 hours a week or 40 hours a week, you control your schedule." },
  { q: "How do I get paid?", a: "Payments are processed weekly directly to your linked bank account or PayPal via our secure payment processor." },
  { q: "What is the application process?", a: "Click 'Apply Now', fill out your profile and verify your domain credentials. Once approved, you will complete a short onboarding module and can immediately start evaluating tasks." }
];

function FAQAccordion({ faq, isOpen, onClick }) {
  return (
    <div className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border-emerald-500 shadow-lg' : 'bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border-cyan-500/20 hover:border-emerald-300'}`}>
      <button 
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={onClick}
      >
        <span className="font-bold text-lg text-white pr-8">{faq.q}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-500 border-emerald-500 text-white rotate-45' : 'border-cyan-500/30 text-gray-400'}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6 px-6' : 'max-h-0 opacity-0 px-6'}`}>
        <p className="text-gray-400 leading-relaxed border-t pt-4">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FaqsPage() {
  const [openIdx, setOpenIdx] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

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
              Frequently Asked Questions
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto mb-10">
              Everything you need to know about working with AgentForge.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto">
          
          <Reveal direction="up">
            <div className="relative max-w-2xl mx-auto mb-16 -mt-36">
              <input 
                type="text" 
                placeholder="Search for answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border border-cyan-500/20 rounded-full px-8 py-5 text-lg shadow-2xl focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white placeholder:text-gray-400"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </Reveal>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <Reveal key={i} delay={i * 50} direction="up">
                  <FAQAccordion 
                    faq={faq} 
                    isOpen={openIdx === i} 
                    onClick={() => setOpenIdx(openIdx === i ? -1 : i)} 
                  />
                </Reveal>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No FAQs found matching your search.</p>
              </div>
            )}
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
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/5 hover:bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all/10 border border-white/10 text-white font-medium transition-all group"
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
