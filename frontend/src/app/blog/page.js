"use client";
import Background3D from '@/components/Background3D';


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
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

const blogPosts = [
  {
    id: 1,
    title: "The AI Got It Right Yesterday. Ask Again Tomorrow.",
    excerpt: "Zillow lost 500 million dollars. Air Canada was sued. A lawyer was fined for fake citations. All three failures share one cause that most AI users still misunderstand.",
    image: "/images/blog1.png",
  },
  {
    id: 2,
    title: "The Freelancers Who Will Thrive in an AI World All Have One Thing in Common",
    excerpt: "Prompting is the easy part. The future belongs to experts who design how AI learns, evolves, and handles the messy edge cases nobody talks about.",
    image: "/images/blog3.png",
  },
  {
    id: 3,
    title: "Why the AI Model You Trust is Only as Good as Who Trained It",
    excerpt: "Every AI evaluation leaves a permanent trace in how the model reasons. The standards a few people held quietly become the defaults for the next million users. A closer look at where that trust is actually built.",
    image: "/images/blog2.png",
  },
  {
    id: 4,
    title: "The Human Blueprint Behind Every AI Breakthrough",
    excerpt: "Every AI breakthrough rests on six invisible steps that turn raw human judgment into machine intelligence. Here is the journey your AI tool never tells you about.",
    image: "/images/blog4.png",
  }
];

export default function BlogPage() {
  return (
    <div className="relative min-h-screen font-sans flex flex-col">
      <Background3D />
      {/* 1. Dark Hero Section */}
      <section className="relative bg-[#081a14] pt-32 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />
        
        {/* Giant glowing arc effect at the bottom of the hero */}
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(16,185,129,0.15)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-24">
          <Reveal delay={100} direction="up">
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight mb-6">
              Blogs
            </h1>
          </Reveal>
          <Reveal delay={200} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              A lot gets lost in the noise around AI. We try to bring some of it back into focus
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Blog List Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto space-y-20">
          {blogPosts.map((post, idx) => (
            <Reveal key={post.id} delay={100} direction="up">
              <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                {/* Image Side */}
                <div className="w-full md:w-5/12 shrink-0">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                
                {/* Text Side */}
                <div className="w-full md:w-7/12 flex flex-col items-start">
                  <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight leading-[1.15] mb-5">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#115e59] hover:bg-[#0f4c47] text-white font-medium transition-colors"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Dark CTA Section matching the last screenshot */}
      <section className="relative bg-[#081a14] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        {/* Abstract floating glass orbs */}
        <div className="absolute -left-[10%] top-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-[10%] bottom-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        {/* Image placeholders for the actual 3D orbs seen in the screenshot */}
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
