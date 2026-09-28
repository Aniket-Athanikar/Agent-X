"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/services/authContext";
import {
  Plus, Search, Terminal, Folder, Calendar, Layers,
  Cpu, Award, Star, Edit2, Pin, Trash, X, ChevronDown, ChevronRight, ChevronLeft,
  Mic, ArrowRight, ShoppingBag, Send, RefreshCcw, Copy, LogOut, FileCode, Check,
  BookOpen, Image, Activity, ShieldCheck, Heart, UserPlus, Users, FileText,
  Monitor, Volume2, Split, Kanban, Network, Settings, User
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const displayName = user?.fullName || user?.email || user?.username || "Developer";
  const userInitials = displayName
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "D";

  const links = [
    { href: "/dashboard", label: "AI Console", icon: <Terminal className="w-4 h-4 text-emerald-400" /> },
    { href: "/workspace", label: "Workspace", icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { href: "/project", label: "Projects", icon: <Kanban className="w-4 h-4 text-[#8b5cf6]" /> },
    { href: "/profile", label: "Profile", icon: <User className="w-4 h-4 text-rose-400" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="w-4 h-4 text-amber-400" /> }
  ];

  return (
    <aside 
      className={`border-r border-emerald-500/10 bg-[#030d0a] flex flex-col justify-between p-3.5 transition-all duration-300 z-30 shrink-0 min-h-[calc(100vh-64px)] ${sidebarCollapsed ? "w-16 items-center" : "w-64"}`}
    >
      <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-100px)] w-full scrollbar-none">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between w-full">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-black text-xs shadow-[0_0_10px_rgba(16,185,129,0.35)]">
                AF
              </span>
              <span className="text-xs font-black tracking-wider uppercase text-white font-albert">
                Agent<span className="text-emerald-400 font-bold">Forge</span>
              </span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 mx-auto"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* New Session Shortcut */}
        <div className="flex gap-2">
          <Link 
            href="/dashboard"
            className={`flex items-center hover:bg-[#091f17] rounded-lg text-xs font-semibold text-white transition border border-emerald-500/20 ${sidebarCollapsed ? "p-2.5 justify-center w-full" : "flex-1 justify-between py-2 px-3"}`}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              {!sidebarCollapsed && <span>New Session</span>}
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          {links.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition ${sidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"} ${isActive ? "bg-[#091f17] text-white border border-emerald-500/10" : "text-[#c5c5d2] hover:bg-[#091f17]/60"}`}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User profile bottom details */}
      <div className="pt-4 border-t border-emerald-500/10 flex flex-col gap-2 w-full">
        {sidebarCollapsed ? (
          <div 
            onClick={logout}
            className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-red-500 transition mx-auto"
          >
            {userInitials}
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded hover:bg-[#091f17] transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                {userInitials}
              </div>
              <div className="flex flex-col text-left">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{displayName}</p>
                <span className="text-[10px] text-gray-500 -mt-0.5">Go</span>
              </div>
            </div>
            <button onClick={logout} className="text-red-400 hover:text-red-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
