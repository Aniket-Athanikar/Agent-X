"use client";

import { motion } from "framer-motion";
import { Laptop, Clock, CreditCard, BookOpen, Award, Users, TrendingUp, Globe2, DollarSign, Gift, Sparkles } from "lucide-react";

const benefits = [
  { 
    icon: <Laptop className="w-5 h-5" />, 
    title: "100% Remote Workspace", 
    desc: "Work from anywhere in the world. No timezone locks or mandatory office check-ins—just a browser and your expertise.", 
    color: "emerald", 
    glow: "group-hover:from-emerald-500/10 group-hover:to-emerald-500/5", 
    border: "group-hover:border-emerald-500/20" 
  },
  { 
    icon: <Clock className="w-5 h-5" />, 
    title: "True Async Flexibility", 
    desc: "Complete tasks on your own schedule. Log in whenever you choose, work as much or as little as your lifestyle permits.", 
    color: "cyan", 
    glow: "group-hover:from-cyan-500/10 group-hover:to-cyan-500/5", 
    border: "group-hover:border-cyan-500/20" 
  },
  { 
    icon: <CreditCard className="w-5 h-5" />, 
    title: "Weekly Disbursements", 
    desc: "Reliable, weekly payment processing. Your completed and approved tasks are paid out directly with absolute transparency.", 
    color: "violet", 
    glow: "group-hover:from-indigo-500/10 group-hover:to-indigo-500/5", 
    border: "group-hover:border-indigo-500/20" 
  },
  { 
    icon: <BookOpen className="w-5 h-5" />, 
    title: "Advanced AI Academy", 
    desc: "Gain free access to premium learning materials on prompt optimization, reward model tuning, and RLHF methodologies.", 
    color: "emerald", 
    glow: "group-hover:from-emerald-500/10 group-hover:to-emerald-500/5", 
    border: "group-hover:border-emerald-500/20" 
  },
  { 
    icon: <Award className="w-5 h-5" />, 
    title: "Domain Certifications", 
    desc: "Earn verified skill credentials. Boost your ranking on the platform to unlock specialized, higher-paying project boards.", 
    color: "cyan", 
    glow: "group-hover:from-cyan-500/10 group-hover:to-cyan-500/5", 
    border: "group-hover:border-cyan-500/20" 
  },
  { 
    icon: <Users className="w-5 h-5" />, 
    title: "Elite Peer Networks", 
    desc: "Connect directly with leading software engineers, researchers, and domain experts via private channels and forums.", 
    color: "violet", 
    glow: "group-hover:from-indigo-500/10 group-hover:to-indigo-500/5", 
    border: "group-hover:border-indigo-500/20" 
  },
  { 
    icon: <TrendingUp className="w-5 h-5" />, 
    title: "Accelerated Career Paths", 
    desc: "Vetted experts are regularly fast-tracked for full-time internal engineering and product leadership positions.", 
    color: "emerald", 
    glow: "group-hover:from-emerald-500/10 group-hover:to-emerald-500/5", 
    border: "group-hover:border-emerald-500/20" 
  },
  { 
    icon: <Globe2 className="w-5 h-5" />, 
    title: "High-Impact AI Work", 
    desc: "Contribute to cutting-edge model training. The data you label directly influences next-gen foundation models.", 
    color: "cyan", 
    glow: "group-hover:from-cyan-500/10 group-hover:to-cyan-500/5", 
    border: "group-hover:border-cyan-500/20" 
  },
  { 
    icon: <DollarSign className="w-5 h-5" />, 
    title: "USD Payment Security", 
    desc: "Protect your earnings from local currency fluctuations. All rewards are denominated and disbursed in USD value.", 
    color: "violet", 
    glow: "group-hover:from-indigo-500/10 group-hover:to-indigo-500/5", 
    border: "group-hover:border-indigo-500/20" 
  },
  { 
    icon: <Gift className="w-5 h-5" />, 
    title: "Growth Referrals", 
    desc: "Boost your weekly income through our tier-based referral system. Get paid for every active expert you onboard.", 
    color: "emerald", 
    glow: "group-hover:from-emerald-500/10 group-hover:to-emerald-500/5", 
    border: "group-hover:border-emerald-500/20" 
  }
];

export default function Benefits() {
  return (
    <section className="py-16 bg-transparent border-t border-white/5 relative z-10 overflow-hidden">
      {/* Background visual indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-text-secondary uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Perks &amp; Compensation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-albert text-white tracking-tight leading-tight">
            Unmatched Expert Benefits
          </h2>
          <p className="text-sm text-text-secondary">
            We invest in our global network of experts, providing the infrastructure and resources required to train tomorrow's AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2, y: -5 }}
              className={`bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] p-4 rounded-xl flex flex-col justify-between items-start text-left cursor-pointer group relative overflow-hidden transition-all duration-300 min-h-[220px] ${benefit.border}`}
            >
              {/* Dynamic Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${benefit.glow}`} />

              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 mb-4 group-hover:scale-105 group-hover:border-primary/20 group-hover:text-primary transition-all duration-300 relative z-10">
                {benefit.icon}
              </div>
              
              <div className="space-y-1.5 relative z-10 flex-grow">
                <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors">{benefit.title}</h3>
                <p className="text-text-secondary text-[11px] leading-relaxed font-light">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
