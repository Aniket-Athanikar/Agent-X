"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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

// Same mock data for the individual post page
const blogPosts = {
  "1": {
    title: "The AI Got It Right Yesterday. Ask Again Tomorrow.",
    excerpt: "Zillow lost 500 million dollars. Air Canada was sued. A lawyer was fined for fake citations. All three failures share one cause that most AI users still misunderstand.",
    image: "/images/blog1.png",
    content: "When businesses integrate Large Language Models (LLMs) into their workflows, they often treat them like deterministic software. If a calculator says 2+2=4 today, it will say 4 tomorrow. But generative AI does not work this way.\n\nBecause these models are probabilistic, asking the exact same question twice can yield entirely different answers. A model might generate a flawless legal summary on Monday, but hallucinate a non-existent court case on Tuesday.\n\nThe solution isn't to stop using AI, but to stop treating it like traditional software. This requires a robust evaluation framework, constant human oversight (RLHF), and a deep understanding of the model's confidence thresholds. Without these, you are essentially rolling the dice with your company's reputation every time an API call is made."
  },
  "2": {
    title: "The Freelancers Who Will Thrive in an AI World All Have One Thing in Common",
    excerpt: "Prompting is the easy part. The future belongs to experts who design how AI learns, evolves, and handles the messy edge cases nobody talks about.",
    image: "/images/blog3.png",
    content: "The era of the 'prompt engineer' is already fading. As models become more intelligent and intuitive, the ability to write a clever prompt is no longer a moat. What matters now is domain expertise.\n\nThe most valuable freelancers in the AI economy aren't those who know how to talk to the AI; they are the experts who know how the AI should think. Whether it's a doctor evaluating a medical diagnostic model, or a senior engineer rating code generation outputs, the true bottleneck in AI advancement is high-quality human data.\n\nThose who adapt their freelance careers to become elite model trainers, evaluators, and edge-case hunters will find themselves in incredibly high demand. It is no longer about using the tool; it is about teaching the tool how to be perfect."
  },
  "3": {
    title: "Why the AI Model You Trust is Only as Good as Who Trained It",
    excerpt: "Every AI evaluation leaves a permanent trace in how the model reasons. The standards a few people held quietly become the defaults for the next million users. A closer look at where that trust is actually built.",
    image: "/images/blog2.png",
    content: "Trust in AI is a deeply human issue. When an AI model refuses to answer a dangerous question, or when it provides a perfectly balanced summary of a controversial topic, it is doing so because a human evaluator told it to.\n\nThis process, known as Reinforcement Learning from Human Feedback (RLHF), is the hidden foundation of modern AI alignment. But who are these humans? If the training data is evaluated by people who lack deep expertise, the model will inherit their blind spots. It will confidently produce mediocre or factually incorrect answers because it was rewarded for doing so during training.\n\nThis is why we focus on curating the top 1% of global experts. The intelligence of the AI is fundamentally capped by the intelligence and diligence of the humans who train it."
  },
  "4": {
    title: "The Human Blueprint Behind Every AI Breakthrough",
    excerpt: "Every AI breakthrough rests on six invisible steps that turn raw human judgment into machine intelligence. Here is the journey your AI tool never tells you about.",
    image: "/images/blog4.png",
    content: "We celebrate the parameter counts and the massive GPU clusters, but the actual intelligence of a frontier model is forged in the grueling, meticulous work of human data annotation and evaluation.\n\nThere are six critical steps: Data Curation, Instruction Fine-Tuning, Reward Modeling, RLHF, Red Teaming, and Continuous Evaluation. At every single one of these steps, human judgment is the bottleneck. A model cannot learn to write a brilliant essay if it has never been shown what a brilliant essay looks like, nor can it learn to avoid subtle logical fallacies if its evaluators cannot spot them.\n\nThe future of AI is not just about compute; it is about capturing the nuances of human genius at scale and translating them into mathematical weights."
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const id = params?.id || "1";
  const post = blogPosts[id] || blogPosts["1"];

  return (
    <div className="relative min-h-screen font-sans flex flex-col">
      {/* 1. Dark Hero Section */}
      <section className="relative bg-[#081a14] pt-32 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />
        
        {/* Giant glowing arc effect */}
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(6,182,212,0.15)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-24">
          <Reveal delay={100} direction="up">
            <Link href="/blog" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors">
              <span className="mr-2">←</span> Back to all blogs
            </Link>
          </Reveal>
          <Reveal delay={200} direction="up">
            <h1 className="text-4xl sm:text-6xl font-medium text-white tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex-1">
        <div className="max-w-4xl mx-auto">
          <Reveal delay={100} direction="up">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-16 -mt-32 border-8 border-white">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={200} direction="up">
            <div className="prose prose-lg sm:prose-xl max-w-none prose-emerald">
              <p className="text-xl sm:text-2xl font-light text-gray-400 leading-relaxed mb-12">
                {post.excerpt}
              </p>
              
              {post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-200 leading-loose mb-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Dark CTA Section */}
      <section className="relative bg-[#081a14] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="absolute -left-[10%] top-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-[10%] bottom-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
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
