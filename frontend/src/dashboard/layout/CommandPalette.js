"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleCommandPalette } from '../store/dashboardSlice';
import {
  Search,
  Sparkles,
  GitBranch,
  CheckSquare,
  Settings,
  FileText,
  Video,
  BarChart3,
  ArrowRight,
  Command,
  CornerDownLeft,
} from 'lucide-react';

const commandItems = [
  { id: 'ai', label: 'Ask AI', description: 'Chat with Agent-X AI Copilot', icon: Sparkles, shortcut: '⌘ I', color: 'text-primary' },
  { id: 'repos', label: 'Go to Repositories', description: 'Browse all repositories', icon: GitBranch, shortcut: '⌘ R', color: 'text-cyan-400' },
  { id: 'task', label: 'Create Task', description: 'Create a new task or ticket', icon: CheckSquare, shortcut: '⌘ T', color: 'text-amber-400' },
  { id: 'settings', label: 'Open Settings', description: 'App preferences & config', icon: Settings, shortcut: '⌘ ,', color: 'text-slate-400' },
  { id: 'docs', label: 'Search Docs', description: 'Search documentation & guides', icon: FileText, shortcut: '⌘ D', color: 'text-violet-400' },
  { id: 'meeting', label: 'Start Meeting', description: 'Create or join a meeting', icon: Video, shortcut: '⌘ M', color: 'text-pink-400' },
  { id: 'analytics', label: 'View Analytics', description: 'Open analytics dashboard', icon: BarChart3, shortcut: '⌘ A', color: 'text-teal-400' },
];

export default function CommandPalette() {
  const dispatch = useDispatch();
  const commandPaletteOpen = useSelector((state) => state.dashboard.commandPaletteOpen);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandItems;
    const lower = query.toLowerCase();
    return commandItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
    );
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredItems, selectedIndex, dispatch]);

  const handleSelect = (item) => {
    dispatch(toggleCommandPalette());
    // Navigation/action handling can be extended here
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(toggleCommandPalette());
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-xl rounded-2xl bg-black/60 border border-cyan-500/20 shadow-[0_25px_80px_rgba(6,182,212,0.15)] overflow-hidden relative"
          >
            {/* Dotted Grid Pattern Overlay */}
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(6,182,212,0.2) 1px, transparent 0)",
                backgroundSize: "24px 24px"
              }}
            />

            {/* Ambient glows inside command palette */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#6D5DFB]/10 rounded-full blur-[40px] pointer-events-none z-0" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#06B6D4]/10 rounded-full blur-[40px] pointer-events-none z-0" />

            <div className="relative z-10 w-full h-full flex flex-col">
              {/* ── Search Input ── */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-cyan-500/10">
                <Search className="w-5 h-5 text-cyan-400/70 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-[14px] text-white placeholder-gray-500 outline-none"
                />
                <kbd className="flex items-center px-2 py-1 rounded-md bg-white/[0.04] border border-cyan-500/25 text-[10px] text-cyan-400 font-mono shrink-0">
                  ESC
                </kbd>
              </div>

              {/* ── Results ── */}
              <div className="max-h-[360px] overflow-y-auto py-2 px-2 scrollbar-none">
                {filteredItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-1.5 flex items-center">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-400/60 font-bold font-mono">
                        Commands
                      </span>
                    </div>
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      const isSelected = index === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 cursor-pointer group border
                            ${isSelected
                              ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                              : 'border-transparent hover:bg-white/[0.02]'
                            }
                          `}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-cyan-500/20' : 'bg-white/[0.03]'} transition-colors`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>

                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-gray-200'}`}>
                              {item.label}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-cyan-500/20 text-[10px] text-gray-500 font-mono">
                              {item.shortcut}
                            </kbd>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                              </motion.div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-cyan-500/10 bg-black/30">
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1 font-mono">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-cyan-500/25 text-[9px]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <CornerDownLeft className="w-2.5 h-2.5" />
                    Select
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-cyan-500/25 text-[9px]">ESC</kbd>
                    Close
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/50 uppercase tracking-widest font-bold font-mono">
                  <Command className="w-2.5 h-2.5" />
                  <span>Agent-X Engine</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
