"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  Bot,
  Send,
  Paperclip,
  CreditCard,
  GitBranch,
  FileCode,
  X,
  ChevronDown,
} from "lucide-react";
import {
  addMessageToActiveChat,
  attachFileToActiveChat,
  removeAttachedFileFromActiveChat,
  setShowBillingPanel,
} from "../store/dashboardSlice";
import ProjectImportGate from "./ProjectImportGate";
import { askAgent } from "@/services/aiApi";

const suggestionChips = [
  "Explain this code",
  "Generate tests",
  "Review architecture",
  "Find documentation",
];

const simulatedResponses = [
  "I've reviewed the selected file. The structure follows standard patterns — AI analysis will connect here once the backend agent is wired.",
  "Based on the project context, here are suggested next steps for your codebase.",
  "I can help refactor, document, or test this module once the AI pipeline is connected.",
];

function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (err) {}
}

export default function CenterChat() {
  const dispatch = useDispatch();
  const projectLoaded = useSelector((s) => s.dashboard?.projectLoaded ?? false);
  const selectedFile = useSelector((s) => s.dashboard?.selectedFile);
  const activeBranch = useSelector((s) => s.dashboard?.activeBranch ?? "main");
  const projectName = useSelector((s) => s.dashboard?.projectName ?? "");

  const aiMessages = useSelector((state) => {
    const activeChatId = state.dashboard?.activeChatId;
    const chat = state.dashboard?.chats?.find((c) => c.id === activeChatId);
    return chat?.messages || [];
  }, shallowEqual);

  const attachedFiles = useSelector((state) => {
    const activeChatId = state.dashboard?.activeChatId;
    const chat = state.dashboard?.chats?.find((c) => c.id === activeChatId);
    return chat?.attachedFiles || [];
  }, shallowEqual);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const prevProjectLoadedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isTyping]);

  useEffect(() => {
    if (projectLoaded && !prevProjectLoadedRef.current) {
      setToast({
        id: Date.now(),
        message: `🎉 Welcome! "${projectName || "Project"}" mapped successfully. Let's build something epic! 🚀`,
      });
      playChime();
      setTimeout(() => setToast(null), 5000);
    }
    prevProjectLoadedRef.current = projectLoaded;
  }, [projectLoaded, projectName]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [inputValue]);

  const handleSubmit = useCallback(async (message) => {

    const text = message || inputValue.trim();

    if (!text) return;

    dispatch(
        addMessageToActiveChat({
            role: "user",
            content: text,
        })
    );

    setInputValue("");
    setIsTyping(true);

    try {

        const result = await askAgent(text, {
          workspaceId: projectName || "default",
          activeFile: selectedFile,
        });

        dispatch(
            addMessageToActiveChat({
                role: "assistant",
                content: result.answer,
            })
        );

    } catch (error) {

        dispatch(
            addMessageToActiveChat({
                role: "assistant",
                content: error.message || "Agent-X AI is temporarily unavailable.",
            })
        );

        console.error(error);

    } finally {

        setIsTyping(false);

    }

  }, [inputValue, dispatch, projectName, selectedFile]);
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const fileData = e.dataTransfer.getData("application/agent-x-file");
    if (fileData) {
      try {
        const node = JSON.parse(fileData);
        dispatch(attachFileToActiveChat({ name: node.name, path: node.path, type: "code" }));
        return;
      } catch {
        /* fall through */
      }
    }

    const files = Array.from(e.dataTransfer.files);
    files.forEach((f) => {
      dispatch(
        attachFileToActiveChat({
          name: f.name,
          path: f.name,
          type: f.type || "file",
          size: `${(f.size / 1024).toFixed(1)} KB`,
        })
      );
    });
  };

  const handleFileInput = (e) => {
    Array.from(e.target.files || []).forEach((f) => {
      dispatch(
        attachFileToActiveChat({
          name: f.name,
          path: f.name,
          type: f.type || "file",
          size: `${(f.size / 1024).toFixed(1)} KB`,
        })
      );
    });
    e.target.value = "";
  };

  if (!projectLoaded) {
    return <ProjectImportGate />;
  }

  const hasMessages = aiMessages.length > 0;

  return (
    <div
      className="flex-1 flex flex-col h-full bg-transparent relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-[toast-in_0.25s_ease-out]">
          <div className="cursor-pointer rounded-xl px-5 py-3.5 text-xs font-mono font-bold shadow-[0_0_30px_rgba(6,182,212,0.15)] border border-[#22C55E]/30 bg-black/80 backdrop-blur-md text-[#22C55E] flex items-center gap-2" onClick={() => setToast(null)}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {toast.message}
          </div>
        </div>
      )}

      {isDragging && (
        <div className="absolute inset-0 z-20 bg-[#10B981]/5 border-2 border-dashed border-[#10B981]/40 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-[#10B981] font-medium">Drop files here to attach</p>
        </div>
      )}

      {/* Header — ChatGPT-style */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button className="flex items-center gap-1.5 text-sm font-medium text-[#e6edf3] hover:bg-white/[0.04] px-2 py-1 rounded-lg transition-colors cursor-pointer">
            Agent-X AI
            <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
          </button>
          {projectName && (
            <span className="text-xs text-[#8b949e] truncate hidden sm:inline">
              · {projectName}
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(setShowBillingPanel(true))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Billing
        </button>
      </header>

      {/* Context bar — selected file + branch */}
      <div className="px-4 py-2 border-b border-white/[0.06] flex flex-wrap items-center gap-2 shrink-0">
          {selectedFile && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#21262d] text-[11px] text-[#8b949e]">
              <FileCode className="w-3 h-3 text-[#10B981]" />
              Using: {selectedFile.name}
            </span>
          )}
          {!selectedFile && <span className="text-[11px] text-[#8b949e]">No file selected</span>}
          {selectedFile && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#21262d] text-[11px] text-[#8b949e]">
              <GitBranch className="w-3 h-3" />
              {activeBranch}
            </span>
          )}
          {attachedFiles.map((f) => (
            <span
              key={f.name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#21262d] text-[11px] text-[#8b949e]"
            >
              <FileCode className="w-3 h-3" />
              {f.name}
              <button
                onClick={() => dispatch(removeAttachedFileFromActiveChat(f.name))}
                className="hover:text-red-400 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
      </div>

      {/* Messages — centered ChatGPT layout */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center px-4 pb-8">
            <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-[#10B981]" />
            </div>
            <h2 className="text-xl font-medium text-[#e6edf3] mb-2">
              How can I help with your project?
            </h2>
            <p className="text-sm text-[#8b949e] text-center max-w-md mb-6">
              Select a file from the sidebar, drag files here, or ask a question.
              The selected file is sent as the primary context for your question.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSubmit(chip)}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#161b22] text-xs text-[#8b949e] hover:text-[#e6edf3] hover:border-[#10B981]/30 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#10B981]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] text-[14px] leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#21262d] text-[#e6edf3] rounded-2xl px-4 py-2.5"
                      : "text-[#e6edf3]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex gap-1 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e] animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e] animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input — ChatGPT-style bottom bar */}
      <div className="p-4 border-t border-white/[0.06] shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-[#161b22] focus-within:border-[#10B981]/30 px-3 py-2 transition-colors">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors shrink-0 cursor-pointer"
              title="Attach from local storage"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Agent-X AI..."
              rows={1}
              className="flex-1 bg-transparent text-[14px] text-[#e6edf3] placeholder-[#8b949e] resize-none outline-none max-h-[160px] py-1.5"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-lg transition-colors shrink-0 cursor-pointer ${
                inputValue.trim()
                  ? "bg-[#10B981] text-black hover:bg-[#0d9668]"
                  : "text-[#8b949e]/30"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#8b949e]/50 text-center mt-2">
            Drag files from the sidebar or attach from local storage
          </p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInput} />
    </div>
  );
}
