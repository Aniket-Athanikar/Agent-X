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

export default function BenefitsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "Financial Freedom",
      description: "Earn top-tier compensation for your domain expertise. Paid weekly, directly to your account.",
      icon: "💰"
    },
    {
      title: "Absolute Flexibility",
      description: "Work when you want, from wherever you want. Claim tasks that fit your schedule.",
      icon: "⏰"
    },
    {
      title: "Continuous Growth",
      description: "Get early access to frontier models before they are released to the public.",
      icon: "🚀"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen font-sans flex flex-col bg-[#081a14]">
      <Background3D />
      {/* 1. Dark Hero Section */}
      <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />

        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(16,185,129,0.15)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-24">
          <Reveal delay={100} direction="up">
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight mb-6">
              Benefits
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              Join the elite. Earn on your terms while shaping the future of artificial intelligence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto space-y-32">

          {/* Main Benefits Carousel */}
          <div>
            <Reveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Why Work With Us</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">The perks of being a top 1% evaluator.</p>
              </div>
            </Reveal>

            <div className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] rounded-[3rem] p-8 md:p-16 border border-cyan-500/20 shadow-xl relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="space-y-8">
                  {slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`transition-all duration-500 cursor-pointer p-6 rounded-2xl ${activeSlide === idx ? 'bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all shadow-lg border border-cyan-500/20 scale-105' : 'opacity-50 hover:opacity-80'}`}
                      onClick={() => setActiveSlide(idx)}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-3xl">{slide.icon}</span> {slide.title}
                      </h3>
                      {activeSlide === idx && (
                        <p className="text-gray-400 leading-relaxed animate-slide-in-up">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Visual Representation */}
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
                  <div className="relative h-full w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all rounded-full border-[8px] border-emerald-50 shadow-2xl flex items-center justify-center p-12 text-center">
                    <div className="transition-all duration-500" key={activeSlide}>
                      <div className="text-8xl mb-6 animate-bounce">{slides[activeSlide].icon}</div>
                      <h4 className="text-xl font-bold text-white">{slides[activeSlide].title}</h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Dark CTA Section */}
      <section className="relative bg-[#081a14] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
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
              A network of experts training and evaluating AI models
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
