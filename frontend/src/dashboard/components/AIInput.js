"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mic, ImageIcon, Paperclip, Code2, GitBranch, Sparkles } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

const SUGGESTIONS = [
  'Explain the GRPO training architecture',
  'What are the open PRs on core-intelligence-api?',
  'Generate unit tests for reward_model.py',
  "Summarize yesterday's standup notes",
];

const ToolbarButton = ({ icon: Icon, label }) => (
  <button
    type="button"
    aria-label={label}
    className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-200"
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default function AIInput() {
  const [value, setValue] = useState('');
  const [chipIndex, setChipIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const { sendMessage } = useDashboard();

  // Rotate suggestion chips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChipIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectSuggestion = (text) => {
    setValue(text);
    textareaRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Suggestion chips */}
      <div className="flex items-center gap-2 mb-3 min-h-[32px]">
        <Sparkles className="w-3.5 h-3.5 text-primary/60 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={chipIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2 overflow-hidden"
          >
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestion(suggestion)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 cursor-pointer ${
                  idx === chipIndex
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10'
                    : 'bg-white/5 text-text-secondary border-white/5 hover:bg-white/10 hover:text-text-primary'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input container */}
      <form onSubmit={handleSubmit}>
        <div
          className={`relative bg-[#0b1221] border border-cyan-500/30 rounded-2xl min-h-[140px] flex flex-col transition-all duration-300 ${
            isFocused
              ? 'ring-1 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
              : 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          }`}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your project, code, APIs, documentation, Jira, GitHub, meetings, or company..."
            rows={3}
            className="flex-1 w-full bg-transparent text-text-primary placeholder:text-text-secondary/50 text-sm sm:text-base px-5 pt-5 pb-2 resize-none focus:outline-none leading-relaxed"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-0.5">
              <ToolbarButton icon={Mic} label="Voice input" />
              <ToolbarButton icon={ImageIcon} label="Upload image" />
              <ToolbarButton icon={Paperclip} label="Attach file" />
              <ToolbarButton icon={Code2} label="Code snippet" />
              <ToolbarButton icon={GitBranch} label="Reference branch" />
            </div>

            <button
              type="submit"
              disabled={!value.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                value.trim()
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 scale-100'
                  : 'bg-white/5 text-text-secondary cursor-not-allowed scale-95'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}