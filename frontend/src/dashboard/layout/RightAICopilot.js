"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleCopilot, addMessageToActiveChat, addRecentPrompt } from '../store/dashboardSlice';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Sparkles,
  X,
  Bot,
  User,
  Send,
  GitBranch,
  FolderKanban,
  Clock,
  Zap,
  Maximize2,
  Minimize2,
  FileCode,
  Github
} from 'lucide-react';
import { askAgent } from '@/services/aiApi';

const suggestionChips = [
  { label: 'Explain this code', icon: '💡' },
  { label: 'Generate tests', icon: '🧪' },
  { label: 'Find docs', icon: '📚' },
  { label: 'Analyze repository', icon: '🔍' },
];

// --- 3D AI Core Component ---
function DeepAICore({ isTyping }) {
  const groupRef = useRef();
  const speedRef = useRef(0.15);
  
  useFrame(({ clock }, delta) => {
    // Smoothly interpolate speed
    const targetSpeed = isTyping ? 1.5 : 0.15;
    speedRef.current += (targetSpeed - speedRef.current) * delta * 2;
    
    if (groupRef.current) {
      groupRef.current.rotation.y += speedRef.current * delta;
      groupRef.current.rotation.z += (speedRef.current * 0.5) * delta;
      
      // Pulse scale when typing
      const scale = isTyping ? 1 + Math.sin(clock.getElapsedTime() * 15) * 0.05 : 1;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -2]}>
      {/* Outer Shell */}
      <mesh>
        <icosahedronGeometry args={[4, 2]} />
        <meshBasicMaterial color="#06B6D4" wireframe transparent opacity={0.08} />
      </mesh>
      {/* Inner Core */}
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Solid Center */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#10B981" emissive="#06B6D4" emissiveIntensity={isTyping ? 3 : 1.5} />
      </mesh>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06B6D4" />
    </group>
  );
}

export default function RightAICopilot() {
  const dispatch = useDispatch();
  const copilotOpen = useSelector((state) => state.dashboard?.copilotOpen ?? true);
  const aiMessages = useSelector((state) => {
    const activeChatId = state.dashboard?.activeChatId;
    const chat = state.dashboard?.chats?.find(c => c.id === activeChatId);
    return chat?.messages || [];
  }, shallowEqual);
  const recentPrompts = useSelector((state) => state.dashboard?.recentPrompts || []);
  const currentProject = useSelector((state) => state.dashboard?.currentProject || '');
  const currentRepo = useSelector((state) => state.dashboard?.currentRepo || '');
  const selectedFile = useSelector((state) => state.dashboard?.selectedFile || null);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSubmit = useCallback(async (message) => {
    const text = message || inputValue.trim();
    if (!text) return;

    // Add user message
    dispatch(addMessageToActiveChat({ role: 'user', content: text }));
    dispatch(addRecentPrompt(text));
    setInputValue('');

    setIsTyping(true);
    try {
      const result = await askAgent(text, { workspaceId: currentProject || 'default', activeFile: selectedFile });
      dispatch(addMessageToActiveChat({ role: 'assistant', content: result.answer }));
    } catch (error) {
      dispatch(addMessageToActiveChat({ role: 'assistant', content: error.message || 'Agent-X AI is temporarily unavailable.' }));
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, dispatch, currentProject, selectedFile]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {copilotOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isExpanded ? 600 : 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full border-l border-border bg-[#030712]/60 backdrop-blur-xl flex flex-col shrink-0 overflow-hidden z-30 text-white relative"
        >
          {/* Deep AI Core 3D Canvas */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <DeepAICore isTyping={isTyping} />
            </Canvas>
          </div>

          <div className="relative z-10 flex flex-col h-full w-full">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-cyan-500/20 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Agent-X AI</h3>
                <p className="text-[9px] text-primary font-medium -mt-0.5">Online · Ready</p>
              </div>
            </div>

            {/* Expand / Close Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title={isExpanded ? "Collapse Panel Width" : "Expand Panel Width"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => dispatch(toggleCopilot())}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Close AI panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Context Card ── */}
          <div className="px-4 py-3 border-b border-white/[0.03] shrink-0">
            <div className="rounded-lg bg-white/[0.02] border border-cyan-500/20 p-2.5 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px]">
                <FolderKanban className="w-3 h-3 text-primary" />
                <span className="text-[#94A3B8]">Project:</span>
                <span className="text-white font-semibold truncate">{currentProject}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <GitBranch className="w-3 h-3 text-accent-cyan" />
                <span className="text-[#94A3B8]">Repo:</span>
                <span className="text-white font-semibold truncate">{currentRepo}</span>
              </div>
            </div>
          </div>

          {/* ── Chat Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-none">
            {aiMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {msg.role === 'assistant' ? (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse-glow">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0 font-bold text-xs text-accent-cyan">
                    RS
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[80%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-line
                    ${msg.role === 'assistant'
                      ? 'bg-cyan-950/20 backdrop-blur-md/50 border border-cyan-500/20 text-[#94A3B8]'
                      : 'bg-accent-cyan/10 border border-accent-cyan/10 text-white'
                    }
                  `}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-white/[0.03] border border-cyan-500/20 rounded-xl px-4 py-3 flex items-center gap-1">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggestion Chips ── */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {suggestionChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSubmit(chip.label)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/20 backdrop-blur-md border border-cyan-500/20 hover:border-primary/30 hover:bg-primary/5 text-[10px] text-[#94A3B8] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Recent Prompts ── */}
          {recentPrompts.length > 0 && (
            <div className="px-4 pb-2 shrink-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3 h-3 text-[#94A3B8]/30" />
                <span className="text-[10px] text-[#94A3B8]/30 font-medium uppercase tracking-wider">Recent</span>
              </div>
              <div className="space-y-0.5">
                {recentPrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(prompt)}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-[#94A3B8] hover:text-white hover:bg-white/[0.03] transition-all duration-150 truncate cursor-pointer"
                  >
                    <Zap className="w-2.5 h-2.5 inline mr-1.5 text-primary/40" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input Area ── */}
          <div className="border-t border-cyan-500/20 p-3 shrink-0">
            <div className="flex items-end gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] focus-within:border-primary/30 focus-within:shadow-[0_0_12px_rgba(16,185,129,0.08)] transition-all duration-200 px-3 py-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI Copilot..."
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-white placeholder-[#94A3B8]/40 resize-none outline-none max-h-[120px] scrollbar-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-lg transition-all duration-200 shrink-0 cursor-pointer ${
                  inputValue.trim()
                    ? 'bg-primary text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.04] text-[#94A3B8]/20'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
