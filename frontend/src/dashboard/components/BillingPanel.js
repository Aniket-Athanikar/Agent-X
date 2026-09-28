"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { setShowBillingPanel, setBillingPlan } from "../store/dashboardSlice";
import {
  getBillingStatus,
  listBillingPlans,
  subscribeToPlan,
  createStripeCheckout,
} from "@/services/workspaceApi";

export default function BillingPanel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const showBillingPanel = useSelector((s) => s.dashboard?.showBillingPanel ?? false);
  const currentPlan = useSelector((s) => s.dashboard?.billingPlan ?? "free");

  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!showBillingPanel) return;
    setLoading(true);
    Promise.all([getBillingStatus(), listBillingPlans()])
      .then(([billingData, plansData]) => {
        setBilling(billingData);
        setPlans(plansData);
        dispatch(setBillingPlan(billingData.plan));
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, [showBillingPanel, dispatch]);

  const handleSubscribe = async (planId) => {
    setMessage("");
    try {
      if (planId === "free") {
        await subscribeToPlan(planId);
        const updated = await getBillingStatus();
        setBilling(updated);
        dispatch(setBillingPlan(updated.plan));
        setMessage("Switched to Free plan.");
        return;
      }
      const checkout = await createStripeCheckout(planId);
      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!showBillingPanel) return null;

  const activePlanId = billing?.plan || currentPlan;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Transparent Backdrop Blur with fade animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
          onClick={() => dispatch(setShowBillingPanel(false))}
        />

        {/* Upgrade Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl border border-cyan-500/20 bg-black/45 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col z-10"
        >
          {/* Dotted Background Grid Pattern */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.2) 2px, transparent 0)",
              backgroundSize: "32px 32px"
            }}
          />


          {/* Header */}
          <div className="px-6 py-5 border-b border-cyan-500/10 flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">Upgrade your plan</h2>
              <p className="text-xs text-[#8b949e] mt-1 font-sans">
                Choose the scalability layer that matches your agent workflows
              </p>
            </div>
            <button
              onClick={() => dispatch(setShowBillingPanel(false))}
              className="p-2 rounded-xl text-[#8b949e] hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.04] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {message && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 relative z-10 font-mono">
              {message}
            </div>
          )}

          {/* Plan cards */}
          <div className="p-6 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-[3px] border-cyan-500/10 border-t-emerald-400 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.2)]" />
                <span className="text-[10px] font-mono tracking-widest text-[#8b949e] uppercase animate-pulse">Syncing Plans...</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isCurrent = activePlanId === plan.id;
                  const isPro = plan.id === "pro" || plan.id === "enterprise";

                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: isCurrent ? 1 : 1.02, y: isCurrent ? 0 : -4 }}
                      className={`relative flex flex-col rounded-xl border p-5 transition-all bg-black/35 backdrop-blur-md ${
                        isCurrent
                          ? "border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/5"
                          : isPro
                          ? "border-[#10B981]/30 hover:border-[#10B981]/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]"
                          : "border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)]"
                      }`}
                    >
                      {isPro && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#10B981] text-[9px] font-bold text-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                          <Sparkles className="w-2.5 h-2.5" />
                          Popular
                        </span>
                      )}

                      <h3 className="text-base font-bold text-white uppercase tracking-wider">{plan.name}</h3>

                      <div className="mt-4 mb-5">
                        <span className="text-3xl font-black text-white">
                          ${plan.price_monthly}
                        </span>
                        <span className="text-xs text-[#8b949e]"> / month</span>
                      </div>

                      <ul className="space-y-3 flex-1 mb-6 font-sans">
                        <li className="flex items-start gap-2 text-xs text-[#8b949e]">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          {plan.uploads_limit < 0 ? "Unlimited" : plan.uploads_limit} uploads
                        </li>
                        <li className="flex items-start gap-2 text-xs text-[#8b949e]">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          {plan.storage_mb < 0 ? "Unlimited" : `${plan.storage_mb} MB`} storage
                        </li>
                        <li className="flex items-start gap-2 text-xs text-[#8b949e]">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          AI chat sessions
                        </li>
                        {isPro && (
                          <li className="flex items-start gap-2 text-xs text-[#8b949e]">
                            <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            Priority support
                          </li>
                        )}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-white/[0.04] text-[#8b949e] border border-white/[0.04] cursor-default"
                            : isPro
                            ? "bg-[#10B981] text-black hover:bg-[#0d9668] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            : "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30"
                        }`}
                      >
                        {isCurrent
                          ? "Current Plan"
                          : plan.id === "free"
                          ? "Downgrade"
                          : `Upgrade`}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-cyan-500/10 text-center relative z-10">
            <p className="text-xs text-[#8b949e] font-sans">
              Need scale options?{" "}
              <button 
                onClick={() => {
                  dispatch(setShowBillingPanel(false));
                  router.push("/settings");
                }} 
                className="text-[#10B981] hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                View full settings console
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
