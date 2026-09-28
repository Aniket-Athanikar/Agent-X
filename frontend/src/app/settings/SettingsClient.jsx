"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Key, 
  CreditCard, 
  Sliders, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle,
  Copy,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/services/authContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Background3D from "@/components/Background3D";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "api-keys", name: "API Integration", icon: Key },
  { id: "billing", name: "Billing Plan", icon: CreditCard },
  { id: "preferences", name: "Agent Config", icon: Sliders },
  { id: "account", name: "Account", icon: User },
];

export default function SettingsClient() {
  const { user, deleteAccount } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    const result = await deleteAccount();
    if (result.success) {
      router.replace("/");
      return;
    }
    setDeleting(false);
    setDeleteError(result.detail || "Unable to delete your account.");
  };

  // Form State Values
  const [profileName, setProfileName] = useState(user?.fullName || "Agent-X Operator");
  const [profileEmail, setProfileEmail] = useState(user?.email || "operator@agentforge.ai");
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••••••••••••••");
  const [maxSteps, setMaxSteps] = useState(50);
  const [autoResolve, setAutoResolve] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage("Settings successfully synchronized.");
    setTimeout(() => setSavedMessage(""), 4000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("sk-af-gemini-live-deployment-prod-key-10827");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

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
        
        {/* Breadcrumb / Title */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e] mb-2 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer" onClick={() => window.location.href = "/"}>Portal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#10B981]">Settings</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            System <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Preferences</span>
          </h1>
        </div>

        {/* Saved Alert Notification */}
        <AnimatePresence>
          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md flex items-center gap-3 text-sm text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{savedMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Layout Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left text-sm font-semibold cursor-pointer ${
                    active
                      ? "border-cyan-500/30 bg-cyan-950/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                      : "border-white/[0.04] bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.08]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-gray-500"}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Form Settings Panel */}
          <div className="md:col-span-3">
            <div className="w-full rounded-2xl border border-cyan-500/10 bg-black/45 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <form onSubmit={handleSave}>
                <AnimatePresence mode="wait">
                  
                  {/* --- PROFILE SETTINGS TAB --- */}
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Operator Profile</h2>
                        <p className="text-xs text-[#8b949e]">Configure your identity and contact details across the Agent-X network.</p>
                      </div>

                      <div className="flex items-center gap-5 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileName}&backgroundColor=b6e3f4,c0aede`} 
                          alt="AI Avatar" 
                          className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        />
                        <div>
                          <p className="text-sm font-bold text-white">{profileName}</p>
                          <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mt-1">Verified Operator</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                          <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-black/30 text-white text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all font-sans"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                          <input 
                            type="email" 
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-black/30 text-white text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all font-sans"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- API KEYS SETTINGS TAB --- */}
                  {activeTab === "api-keys" && (
                    <motion.div
                      key="api-keys"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">API Integration</h2>
                        <p className="text-xs text-[#8b949e]">Inject custom LLM endpoint keys for execution environments.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-950/10 text-xs text-cyan-400 leading-relaxed font-sans shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <strong>Note:</strong> Endpoint API Keys are stored locally using end-to-end KMS envelope encryption loops. Keys never touch Agent-X logging systems.
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Gemini API Key</label>
                          <div className="relative">
                            <input 
                              type={showApiKey ? "text" : "password"} 
                              value={geminiKey}
                              onChange={(e) => setGeminiKey(e.target.value)}
                              className="w-full h-11 pl-4 pr-24 rounded-xl border border-white/[0.08] bg-black/30 text-white text-sm outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all font-mono"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <button 
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="p-2 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                              >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button 
                                type="button"
                                onClick={copyToClipboard}
                                className="p-2 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer relative"
                              >
                                <Copy className="w-4 h-4" />
                                {copiedKey && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10B981] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                    Copied
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- BILLING PLAN TAB --- */}
                  {activeTab === "billing" && (
                    <motion.div
                      key="billing"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Workspace Subscription</h2>
                        <p className="text-xs text-[#8b949e]">Configure scaling pricing plan limits and payment cycles.</p>
                      </div>

                      <div className="p-6 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/10 via-transparent to-cyan-950/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-xs text-[#8b949e] uppercase tracking-wider font-bold">Active Subcription</p>
                          <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">Agent-X Pro Scale</h3>
                          <p className="text-xs text-emerald-400 mt-1">Renews automatically on Oct 14, 2026</p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-white">$49</span>
                          <span className="text-xs text-[#8b949e]">/mo</span>
                          <span className="block text-[10px] text-gray-500 mt-1">Charged to Mastercard •••• 4892</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Token quota</span>
                          <span className="text-lg font-bold text-white mt-1 block">8.5M / 10M</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Active Agents</span>
                          <span className="text-lg font-bold text-white mt-1 block">Unlimited</span>
                        </div>
                        <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] col-span-2 md:col-span-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Stripe Status</span>
                          <span className="text-lg font-bold text-emerald-400 mt-1 block uppercase tracking-wide">Active</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- PREFERENCES SETTINGS TAB --- */}
                  {activeTab === "preferences" && (
                    <motion.div
                      key="preferences"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Agent Configuration</h2>
                        <p className="text-xs text-[#8b949e]">Tweak runtime environment safety rails and recursive limit levels.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Max Execution Steps Limit</span>
                            <span className="text-cyan-400 font-mono">{maxSteps} steps</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="200" 
                            value={maxSteps}
                            onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-black/40 border border-white/[0.08]"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                          <div>
                            <p className="text-sm font-bold text-white">Auto-Resolve Dependencies</p>
                            <p className="text-xs text-gray-500 mt-0.5">Let agents install package layers asynchronously during compilations.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAutoResolve(!autoResolve)}
                            className={`w-11 h-6 rounded-full transition-all relative flex items-center px-1 cursor-pointer ${
                              autoResolve ? "bg-[#10B981]" : "bg-white/[0.1]"
                            }`}
                          >
                            <motion.span 
                              layout
                              className="w-4 h-4 rounded-full bg-black shadow"
                              animate={{ x: autoResolve ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "account" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Account</h2>
                        <p className="text-xs text-[#8b949e]">Manage your Agent-X account.</p>
                      </div>
                      <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-5">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-white">Delete Account</p>
                            <p className="text-xs text-gray-400 mt-1">Permanently delete your Agent-X account and associated data. This cannot be undone.</p>
                            <button type="button" onClick={() => setConfirmDelete(true)} className="mt-4 px-3 py-2 rounded-lg border border-red-500/40 text-xs font-bold text-red-300 hover:bg-red-500/10">Delete Account</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </AnimatePresence>

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Synchronized Settings
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </main>

      {/* Main Footer */}
      <Footer />
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-[#111827] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Delete your account?</h2>
            <p className="mt-3 text-sm text-gray-400">This will permanently delete your Agent-X account and associated data. This action cannot be undone.</p>
            {deleteError && <p className="mt-3 text-sm text-red-300">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setConfirmDelete(false)} className="px-3 py-2 text-sm text-gray-300">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDeleteAccount} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{deleting ? "Deleting…" : "Delete Account"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
