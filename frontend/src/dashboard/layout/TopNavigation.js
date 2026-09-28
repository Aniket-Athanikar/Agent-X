"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/services/authContext";
import Link from "next/link";
import AgentXLogo from "@/components/AgentXLogo";
import { useRouter } from "next/navigation";
import {
  toggleCommandPalette,
  markNotificationsRead,
  createChat,
  setShowBillingPanel,
  requestWorkspaceSwitch,
  toggleSidebar,
} from "../store/dashboardSlice";
import {
  Search,
  Bell,
  Command,
  Plus,
  LogOut,
  MessageSquarePlus,
  CheckCheck,
  CreditCard,
  Settings,
  FolderKanban,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TopNavigation() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, logout } = useAuth();

  const unreadNotifications = useSelector((s) => s.dashboard?.unreadNotifications ?? 0);
  const projectName = useSelector((s) => s.dashboard?.projectName ?? "");
  const projectLoaded = useSelector((s) => s.dashboard?.projectLoaded ?? false);
  const activeBranch = useSelector((s) => s.dashboard?.activeBranch ?? "main");
  const sidebarCollapsed = useSelector((s) => s.dashboard?.sidebarCollapsed ?? false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const quickCreateRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target)) {
        setShowQuickCreate(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const userName = user ? user.fullName : "Guest User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const notificationList = [
    { id: 1, text: "Code review requested on auth module", time: "10m ago" },
    { id: 2, text: "CI build passed on main branch", time: "45m ago" },
    { id: 3, text: "Sprint goal 68% complete", time: "2h ago" },
  ];

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-[#0b1020] border-b border-white/[0.06] relative">

      {/* Left — Logo + project breadcrumb (GitHub style) */}
      <div className="flex items-center gap-2 min-w-0 text-[13px] relative z-10">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-md text-[#8b949e] hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer shrink-0 border border-transparent hover:border-white/[0.04]"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[#8b949e]/30 font-light select-none">|</span>
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group ml-1">
          <div className="relative flex items-center justify-center">
            <AgentXLogo className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black tracking-tight text-[12px] drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all">AGENT-X</span>
        </Link>

        {projectLoaded && projectName && (
          <>
            <span className="text-[#8b949e]/40 select-none">/</span>
            <span className="text-[#e6edf3] font-bold truncate">{projectName}</span>
            <span className="text-[#8b949e]/40 hidden sm:inline select-none">/</span>
            {/* Styled Active Branch Pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.15)] hidden sm:inline select-none">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              {activeBranch}
            </span>
          </>
        )}
      </div>

      {/* Center — search (VS Code command palette style) */}
      <div className="flex-1 flex justify-center max-w-md mx-4 relative z-10">
        <button
          onClick={() => dispatch(toggleCommandPalette())}
          className="w-full flex items-center gap-2 h-9 px-3.5 rounded-xl bg-black/50 border border-cyan-500/20 hover:border-cyan-400/40 text-[12px] text-gray-300 transition-all cursor-pointer group hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="w-3.5 h-3.5 text-cyan-400/80 group-hover:text-cyan-300 shrink-0 transition-colors" />
          <span className="text-[#8b949e] group-hover:text-[#e6edf3] flex-1 text-left truncate transition-colors">Search or run command</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-[#8b949e] font-mono shrink-0 border border-white/[0.04]">
            <Command className="w-2.5 h-2.5 text-[#8b949e]/80" />K
          </kbd>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0 relative z-10">
        {projectLoaded && (
          <button
            onClick={() => {
              dispatch(requestWorkspaceSwitch());
            }}
            title="Open different project"
            className="p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
        )}

        <div className="relative" ref={quickCreateRef}>
          <button
            onClick={() => setShowQuickCreate(!showQuickCreate)}
            className="p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Quick create"
          >
            <Plus className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {showQuickCreate && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 mt-1 w-44 rounded-lg bg-[#161b22] border border-white/[0.08] shadow-xl p-1 z-50 text-xs"
              >
                <button
                  onClick={() => {
                    dispatch(createChat());
                    setShowQuickCreate(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] text-left cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  New chat
                </button>
                <Link
                  href="/project"
                  onClick={() => setShowQuickCreate(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] text-left"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  Projects
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => dispatch(setShowBillingPanel(true))}
          className="p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer"
          title="Billing"
        >
          <CreditCard className="w-4 h-4" />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 mt-1 w-72 rounded-lg bg-[#161b22] border border-white/[0.08] shadow-xl p-3 z-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-[#e6edf3]">Notifications</span>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={() => dispatch(markNotificationsRead())}
                      className="text-[10px] text-[#10B981] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark read
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {notificationList.map((item) => (
                    <div key={item.id} className="p-2 rounded-md bg-[#21262d] text-[11px] text-[#8b949e]">
                      {item.text}
                      <span className="block text-[9px] text-[#8b949e]/50 mt-0.5">{item.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/settings"
          className="p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        <div className="relative ml-1" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center font-bold text-black text-[10px] cursor-pointer"
          >
            {initials}
          </button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 mt-1 w-44 rounded-lg bg-[#161b22] border border-white/[0.08] shadow-xl p-1 z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-white/[0.06] text-[10px] text-[#8b949e]">
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/5 text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
