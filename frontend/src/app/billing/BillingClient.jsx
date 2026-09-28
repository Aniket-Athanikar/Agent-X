"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, DollarSign, Loader2, ArrowRight, CreditCard, ChevronRight } from "lucide-react";
import { useAuth } from "@/services/authContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Background3D from "@/components/Background3D";
import {
  getBillingStatus,
  listBillingPlans,
  subscribeToPlan,
  createStripeCheckout,
} from "@/services/workspaceApi";

export default function BillingClient() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submittingPlanId, setSubmittingPlanId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getBillingStatus(), listBillingPlans()])
      .then(([billingData, plansData]) => {
        setBilling(billingData);
        setPlans(plansData);
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planId) => {
    setMessage("");
    setSubmittingPlanId(planId);
    try {
      if (planId === "free") {
        await subscribeToPlan(planId);
        const updated = await getBillingStatus();
        setBilling(updated);
        setMessage("Switched to Free plan.");
        return;
      }
      const checkout = await createStripeCheckout(planId);
      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmittingPlanId(null);
    }
  };

  const activePlanId = billing?.plan || "free";

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col justify-between">
      {/* 3D Background Canvas Layer */}
      <Background3D />

      {/* Dotted Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.15) 2px, transparent 0)",
          backgroundSize: "36px 36px"
        }}
      />

      {/* Ambient Auroras */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-[#6D5DFB]/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-32 relative z-10">
        
        {/* Title Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e] mb-2 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer" onClick={() => window.location.href = "/"}>Portal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#10B981]">Billing</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            Workspace <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Subscription</span>
          </h1>
          <p className="text-xs text-[#8b949e] mt-2">Manage billing details, limits, and select subscription scales.</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md text-sm text-cyan-400 font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-emerald-400 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.2)]" />
            <span className="text-xs font-mono tracking-widest text-[#8b949e] uppercase animate-pulse">Synchronizing Plans...</span>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Active Plan Detail Box */}
            <div className="p-6 rounded-2xl border border-cyan-500/10 bg-black/45 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active Subcription</p>
                <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                  {plans.find((p) => p.id === activePlanId)?.name || "AgentForge Free"}
                </h3>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Active session quota active
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-3xl font-black text-white">
                    ${plans.find((p) => p.id === activePlanId)?.price_monthly || 0}
                  </span>
                  <span className="text-xs text-[#8b949e]">/mo</span>
                </div>
                <div className="h-10 w-px bg-white/[0.06]" />
                <button 
                  onClick={() => window.location.href = "/settings"}
                  className="h-10 px-4 rounded-xl border border-white/[0.08] hover:border-cyan-500/30 hover:bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-300 transition-all cursor-pointer"
                >
                  Configure billing
                </button>
              </div>
            </div>

            {/* Pricing Tiers Grid */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {plans.map((plan) => {
                const isCurrent = activePlanId === plan.id;
                const isPro = plan.id === "pro" || plan.id === "enterprise";
                const isSubmitting = submittingPlanId === plan.id;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: isCurrent ? 1 : 1.02, y: isCurrent ? 0 : -4 }}
                    className={`relative flex flex-col rounded-2xl border p-6 bg-black/45 backdrop-blur-xl transition-all shadow-[0_0_40px_rgba(0,0,0,0.3)] ${
                      isCurrent
                        ? "border-[#10B981]/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-emerald-950/5"
                        : isPro
                        ? "border-[#10B981]/20 hover:border-[#10B981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-white/[0.08] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    }`}
                  >
                    {isPro && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#10B981] text-[9px] font-bold text-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10">
                        <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                        Popular Choice
                      </span>
                    )}

                    <h3 className="text-lg font-black text-white uppercase tracking-wider">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-sans">
                      {plan.id === "free" ? "AST code analysis" : plan.id === "pro" ? "Scale team pipelines" : "Dedicated isolation"}
                    </p>

                    <div className="mt-6 mb-6">
                      <span className="text-4xl font-black text-white tracking-tight">
                        ${plan.price_monthly}
                      </span>
                      <span className="text-xs text-[#8b949e]"> / seat / mo</span>
                    </div>

                    <ul className="space-y-3.5 flex-1 mb-8 font-sans">
                      <li className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        {plan.uploads_limit < 0 ? "Unlimited" : plan.uploads_limit} project uploads
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        {plan.storage_mb < 0 ? "Unlimited" : `${plan.storage_mb} MB`} network storage
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        Interactive AI chat sessions
                      </li>
                      {isPro && (
                        <li className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          Priority node execution
                        </li>
                      )}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCurrent || isSubmitting}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? "bg-white/[0.04] text-[#8b949e] border border-white/[0.04] cursor-default"
                          : isPro
                          ? "bg-[#10B981] text-black hover:bg-[#0d9668] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          : "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30"
                      }`}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isCurrent ? (
                        "Current Active Plan"
                      ) : (
                        <>
                          Subscribe <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
