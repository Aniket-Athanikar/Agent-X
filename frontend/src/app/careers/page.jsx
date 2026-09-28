"use client";
import Background3D from '@/components/Background3D';


import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Star, Send, Cpu,
  ShieldCheck, Terminal, Award, Globe, Users, Heart, X, FileCode
} from "lucide-react";

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

export default function CareersPage() {
  const [activeJobId, setActiveJobId] = useState("role_ai_arch");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "AI Systems Architect",
    resumeLink: "",
    portfolio: ""
  });

  const jobsList = [
    {
      id: "role_ai_arch",
      title: "AI Systems Architect",
      team: "Core Platform Systems",
      location: "Pune, India (Hybrid)",
      type: "Full-Time",
      salary: "₹34L - ₹50L",
      description: "Build high-throughput distributed message logs, Raft consensus engines, and local model inference layers to power company-wide AI operations.",
      responsibilities: [
        "Optimize distributed heartbeat RPC synchronization latency under 15ms.",
        "Integrate local LLM pipeline caches with Postgres partitioning strategies.",
        "Implement secure KMS storage vaults and OAuth session credentials."
      ],
      requirements: [
        "4+ years experience with Golang, Rust, or C++ in high-load settings.",
        "Expert knowledge of consensus architectures (Raft, Paxos).",
        "Experience with Next.js state management engines is a plus."
      ]
    },
    {
      id: "role_fullstack",
      title: "Full Stack Engineer",
      team: "Developer Tools & UI",
      location: "Pune, India (Hybrid)",
      type: "Full-Time",
      salary: "₹24L - ₹38L",
      description: "Forge gorgeous interactive dashboards, collaborative canvas boards, and real-time streaming interfaces using Next.js 16 and Tailwind.",
      responsibilities: [
        "Build premium interactive charts, carousels, and console terminals.",
        "Ensure seamless Next.js server-side streaming features.",
        "Collaborate with designers to deliver state-of-the-art responsive components."
      ],
      requirements: [
        "3+ years experience with React, Next.js, and modern CSS guidelines.",
        "Strong familiarity with Framer Motion, HSL tailored schemes, and responsive grid layouts.",
        "Passionate about creating premium, sleek dark mode visuals."
      ]
    },
    {
      id: "role_security",
      title: "Security & Compliance Lead",
      team: "Enterprise Trust",
      location: "Remote (India)",
      type: "Full-Time",
      salary: "₹30L - ₹45L",
      description: "Own SOC2 audit certifications, data encryption bounds, Okta verification interceptors, and security compliance logging.",
      responsibilities: [
        "Conduct threat modeling scans across Kubernetes consensus nodes.",
        "Ensure active databases comply with security policy encryption layers.",
        "Implement automated role-based access validation scripts."
      ],
      requirements: [
        "Deep familiarity with SOC2 Type II audit pipelines and compliance grids.",
        "Experience with Okta authentication mechanisms and secure JWT architectures.",
        "Familiarity with GCP Cloud KMS tools and secret store APIs."
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
    }
  };

  const activeJob = jobsList.find(j => j.id === activeJobId);

  return (
    <div className="relative min-h-screen font-sans flex flex-col bg-[#020C09] text-white">
      <Background3D />

      {/* 1. Dark Hero Section (Matching About Story Theme Pattern) */}
      <section className="relative pt-28 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-b-0">
        <Navbar />

        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] border-t-[1.5px] border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[150%] h-full rounded-[100%] shadow-[0_-50px_150px_rgba(16,185,129,0.15)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 sm:mt-20 space-y-6">
          <Reveal delay={100} direction="up">
            <div className="flex justify-center">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-widest uppercase border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                Careers &amp; Openings
              </span>
            </div>
          </Reveal>
          <Reveal delay={200} direction="up">
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight leading-tight">
              Join the Mission
            </h1>
          </Reveal>
          <Reveal delay={300} direction="up">
            <p className="text-xl sm:text-2xl text-gray-300 font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
              Onboarding the top 1% of global engineering talent to align artificial intelligence with enterprise safety
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. White Content Section (Matching About Story Theme Pattern) */}
      <section className="relative bg-[#0b1221] text-white border-t border-cyan-500/20 shadow-[0_-20px_50px_rgba(6,182,212,0.15)] py-24 px-4 sm:px-6 lg:px-8 z-20 -mt-1 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto space-y-24">

          {/* AI Office Image Grid */}
          <Reveal direction="scale">
            <section className="relative rounded-[3rem] overflow-hidden border border-cyan-500/20 shadow-2xl">
              <img
                src="/careers_team.png"
                alt="Agent-X Futuristic Office Space"
                className="w-full h-80 sm:h-96 object-cover opacity-95 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
              <div className="absolute bottom-6 left-6 sm:left-10 space-y-1 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] font-black tracking-wider text-emerald-400 uppercase bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/20">AGENT-X HQ</span>
                <h2 className="text-sm font-black text-white">Innovation Sandbox, Hinjawadi Pune</h2>
              </div>
            </section>
          </Reveal>

          {/* Dynamic Core Sub-Openings Details */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Roles Selector list */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2">Open Opportunities</h3>
              <div className="space-y-2">
                {jobsList.map(job => (
                  <div
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`p-5 rounded-[2rem] border transition cursor-pointer flex flex-col justify-between h-28 text-left ${activeJobId === job.id ? "bg-black text-white border-black" : "bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border-cyan-500/20 text-gray-400 hover:border-cyan-500/30 hover:bg-[#0b1221] border border-cyan-500/30/50"}`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-emerald-500 uppercase font-black">{job.team}</span>
                      <h4 className="text-xs font-bold leading-normal truncate">{job.title}</h4>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                      <span>{job.location}</span>
                      <span className="font-mono">{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Details Card Panel (Click to sub-like view details) */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJob.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-xl"
                >
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-cyan-500/20">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black text-white">{activeJob.title}</h2>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {activeJob.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-500" /> {activeJob.type}</span>
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-mono shrink-0">{activeJob.salary}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role Overview</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">{activeJob.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Responsibilities</h4>
                      <ul className="space-y-2">
                        {activeJob.responsibilities.map((resp, i) => (
                          <li key={i} className="text-xs text-gray-400 leading-relaxed font-medium flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Requirements</h4>
                      <ul className="space-y-2">
                        {activeJob.requirements.map((req, i) => (
                          <li key={i} className="text-xs text-gray-400 leading-relaxed font-medium flex items-start gap-2">
                            <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </section>

          {/* Culture & Perks */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-center text-gray-400">Why Work With Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Cpu className="w-6 h-6 text-emerald-500" />, title: "Bleeding Edge Tech", desc: "Contribute to distributed state evaluation algorithms, Next.js 16 structures, and high scalability APIs." },
                { icon: <Users className="w-6 h-6 text-amber-500" />, title: "Top-Tier Mentorship", desc: "Collaborate daily with industry founders to elevate architecture standards and promotion cycles." },
                { icon: <Heart className="w-6 h-6 text-rose-500" />, title: "Dynamic Wellness", desc: "Flexible hybrid working schemes, standard health provisions, and performance bonuses." }
              ].map(perk => (
                <div key={perk.title} className="p-6 bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 rounded-[2rem] space-y-3 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center border border-cyan-500/20 shadow-sm hover:scale-105 hover:-translate-y-2">{perk.icon}</div>
                  <h4 className="text-xs font-bold text-white">{perk.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Fast Apply Form */}
          <section className="max-w-xl mx-auto bg-[#030712]/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-500/20 p-6 md:p-8 rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">Join the Agent-X Team</h3>
              <p className="text-[10px] text-gray-400">Submit your details and we will schedule an introductory mapping call</p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs text-center rounded-[2rem] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold">Application Received successfully!</p>
                <p className="text-[10px] text-gray-400">We have logged your application under active hiring tracks. Check your email for next steps</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Aniket Athanikar"
                      className="w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border border-cyan-500/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="expert@agentforge.ai"
                      className="w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border border-cyan-500/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Desired Opening</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border border-cyan-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 transition"
                  >
                    <option>AI Systems Architect</option>
                    <option>Full Stack Engineer</option>
                    <option>Security & Compliance Lead</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Resume Link (PDF/Drive)</label>
                  <input
                    type="url"
                    value={formData.resumeLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, resumeLink: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all border border-cyan-500/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-cyan-500/20 bg-cyan-950/20 text-white placeholder-gray-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Send Application</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </section>

        </div>
      </section>

      <Footer />
    </div>
  );
}
