"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/services/authContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import {
  Search, ShieldAlert, Cpu, ArrowRight, User, Terminal, Folder, Settings,
  LayoutDashboard, MessageSquare, BookOpen, Layers, BarChart, Plus, Play,
  Info, Sparkles, Send, Mic, Paperclip, CheckCircle, Clock, Database,
  GitBranch, Github, Lock, HardDrive, RefreshCw, X, ChevronRight, ChevronLeft,
  Minimize2, Maximize2, Star, Target, Compass, Award, Calendar, Radio,
  Bell, HelpCircle, Activity, ClipboardList, Briefcase, Zap, Flame, Check,
  Laptop, ShieldCheck, Heart, UserPlus, Users, FileText, ChevronDown, Monitor,
  Volume2, Split, HelpCircle as HelpIcon, FileCode, PlayCircle, Eye, GitPullRequest,
  CheckCircle2, Compass as RoadmapIcon, BarChart2, Trash, Pin, Copy, RefreshCcw,
  Share2, ShoppingBag, ListTodo, Server, Network, ShieldCheck as SecurityIcon, Settings2,
  Kanban, LogOut, CornerDownLeft, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkspacePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamic user data
  const displayName = user?.fullName || user?.email || user?.username || "Developer";
  const userInitials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "D";

  // Panel sizing & collapsing states
  const [copilotOpen, setCopilotOpen] = useState(true);

  // Tab Manager (VS Code/Cursor Style)
  const [activeTab, setActiveTab] = useState("Home");
  const [openedTabs, setOpenedTabs] = useState(["Home"]);

  // Search & Quick Create dialogs
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Chat Conversation mode state
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  // File Upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Kanban Tasks for Project Workspace Application
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: "t1", title: "Write Leader candidate election logic", status: "In Progress", priority: "High" },
    { id: "t2", title: "KMS Secret Access Key rotation", status: "Blocked", priority: "Critical" },
    { id: "t3", title: "SQL partitioning test script", status: "Todo", priority: "Medium" },
    { id: "t4", title: "Okta authorization middleware", status: "Completed", priority: "Low" }
  ]);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showAddCardStatus, setShowAddCardStatus] = useState(null);

  // Selected file context for Repository Explorer
  const [selectedRepoFile, setSelectedRepoFile] = useState("raft/consensus.go");
  const repoFiles = [
    { name: "raft/consensus.go", language: "go", size: "12 KB", lines: 250 },
    { name: "okta/middleware.js", language: "javascript", size: "4 KB", lines: 80 },
    { name: "db/partition_logs.sql", language: "sql", size: "2 KB", lines: 45 }
  ];

  // Dynamic right-side AI Copilot Context
  const [copilotContext, setCopilotContext] = useState({
    project: "Raft Consensus Engine",
    sprint: "Sprint 42 (Q2 Core)",
    repository: "github.com/agentforge/raft-core",
    module: "raft/consensus.go",
    relatedTickets: ["AF-821: Fix deadlock in candidate conversion"]
  });

  const suggestedPrompts = [
    "Explain Authentication Architecture",
    "Summarize Yesterday's Sprint",
    "Show My Assigned Tasks",
    "Generate SQL Query",
    "Explain Payment Service",
    "Find API Documentation"
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Adjust active AI Context dynamically based on tab transitions
  useEffect(() => {
    if (activeTab === "Projects") {
      setCopilotContext(prev => ({
        ...prev,
        module: "kanban/board_core.go",
        relatedTickets: ["AF-902: Write sprint retro templates", "AF-821: Fix candidate converted deadlocks"]
      }));
    } else if (activeTab === "Knowledge Base") {
      setCopilotContext(prev => ({
        ...prev,
        module: "wiki/knowledge_graph.md",
        relatedTickets: ["AF-404: Audit knowledge documents"]
      }));
    } else {
      setCopilotContext(prev => ({
        ...prev,
        module: "raft/consensus.go",
        relatedTickets: ["AF-821: Fix deadlock in candidate conversion"]
      }));
    }
  }, [activeTab]);

  // Keybindings listener (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!user) return null;

  // Open/jump to tab
  const handleOpenTab = (tabId) => {
    if (!openedTabs.includes(tabId)) {
      setOpenedTabs(prev => [...prev, tabId]);
    }
    setActiveTab(tabId);
    if (tabId !== "AI Mentor") setChatMode(false);
  };

  // Close tab
  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    if (openedTabs.length === 1) return;
    const filtered = openedTabs.filter(t => t !== tabId);
    setOpenedTabs(filtered);
    if (activeTab === tabId) {
      setActiveTab(filtered[filtered.length - 1]);
    }
  };

  // File Upload Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => {
      const isImage = file.type.startsWith("image/");
      return {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type,
        raw: file,
        previewUrl: isImage ? URL.createObjectURL(file) : null
      };
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simulated Typewriter response stream
  const runTypewriterStream = (fullResponse) => {
    setIsGenerating(true);
    setStreamedText("");
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < fullResponse.length) {
        setStreamedText(prev => prev + fullResponse.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setChatMessages(prev => [...prev, { sender: "ai", text: fullResponse }]);
        setStreamedText("");
      }
    }, 10);
  };

  // Start chat conversation flow
  const handleSendPrompt = (promptText) => {
    const text = promptText.trim();
    if (!text && uploadedFiles.length === 0) return;

    setChatMode(true);
    setActiveTab("AI Mentor");
    const userMsg = {
      sender: "user",
      text: text,
      files: [...uploadedFiles]
    };
    setChatMessages(prev => [...prev, userMsg]);
    setUploadedFiles([]);

    let responseText = `I have audited your staging metrics. Raft components compile clean with 100% test coverage.`;

    if (userMsg.files.length > 0) {
      const filesDesc = userMsg.files.map(f => `**${f.name}**`).join(", ");
      responseText = `### Uploaded File Review\n\nI have parsed context from attached files: ${filesDesc}.\n\nBelow is the mapped codebase hierarchy parsed from active logs:\n\n\`\`\`\nAgentForge/\n├── frontend/\n│   ├── package.json\n│   ├── public/\n│   └── src/\n│       ├── app/\n│       │   ├── page.jsx (Landing layout config)\n│       │   ├── workspace/ (VS Code panel manager)\n│       └── components/\n\`\`\`\n\nNo compilation warnings or security risks detected. Staging tests passing.`;
    } else if (text.toLowerCase().includes("auth") || text.toLowerCase().includes("architecture")) {
      responseText = `### Okta & KMS Middleware Authentication specs\n\nAuthentication uses local secure verified sessions:\n\n\`\`\`javascript\nexport const verifySession = (token) => {\n  if (!token) throw new Error('Token payload missing');\n  return jwt.verify(token, process.env.KMS_SECRET_KEY);\n};\n\`\`\`\n\nValidates keys against active KMS logs.`;
    } else if (text.toLowerCase().includes("sql") || text.toLowerCase().includes("query")) {
      responseText = `### Mapped Partition SQL query\n\nRun index verification partitions:\n\n\`\`\`sql\nSELECT term, COUNT(*) AS logs_count \nFROM consensus_logs \nGROUP BY term \nORDER BY logs_count DESC;\n\`\`\``;
    }

    runTypewriterStream(responseText);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() && uploadedFiles.length === 0) return;
    handleSendPrompt(inputValue);
    setInputValue("");
  };

  // Kanban tasks methods
  const handleAddKanbanCard = (status) => {
    if (!newCardTitle.trim()) return;
    const newCard = {
      id: `task_${Date.now()}`,
      title: newCardTitle,
      status: status,
      priority: "Medium"
    };
    setKanbanTasks(prev => [...prev, newCard]);
    setNewCardTitle("");
    setShowAddCardStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#040e0b] text-[#e3e3e3] flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Aurora Radial layer matching project theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-[#040e0b] to-black -z-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDE2LDE4NSwxMjksMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+PHBvbHlnb24gcG9pbnRzPSI0MCwwIDQwLDQwIDAsNDAiLz48L2c+PC9zdmc+')] opacity-20 -z-10" />

      {/* Top Navbar */}
      <Navbar />

      {/* Hidden file input element */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple
        className="hidden" 
      />

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden pt-16">

        {/* ──────────────────────────────────────────────────────── */}
        {/* CENTER CONSOLE WORKSPACE (DYNAMIC TAB CONTENT ROUTING) */}
        {/* ──────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#040e0b]/40 relative">
          
          {/* Header Workspace Tabs (Cursor Style tab switcher) */}
          <header className="h-14 flex items-center px-4 border-b border-emerald-500/10 justify-between bg-[#040e0b]/30 backdrop-blur-md overflow-x-auto scrollbar-none shrink-0">
            <div className="flex items-center gap-2 w-full">
              {openedTabs.map(tabId => (
                <div 
                  key={tabId}
                  onClick={() => handleOpenTab(tabId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 border ${activeTab === tabId ? "bg-[#091f17] border-emerald-500/25 text-white" : "bg-[#030d0a]/50 border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                  <span>{tabId}</span>
                  {openedTabs.length > 1 && (
                    <button 
                      onClick={(e) => handleCloseTab(e, tabId)}
                      className="p-0.5 rounded hover:bg-white/10 text-gray-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setCopilotOpen(!copilotOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#091f17] border border-emerald-500/20 text-xs text-white hover:bg-emerald-500/10 transition"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copilotOpen ? "Hide Context" : "Show Context"}</span>
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Switch tab contents dynamically */}
            <div className="flex-grow p-8 overflow-y-auto">
              {activeTab === "Home" && (
                // 1. HOME WORKSPACE (GREETINGS, Prompt Library & Dashboard Widgets)
                <div className="space-y-8">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black text-white">Good Morning, {displayName.split(" ")[0]} 👋</h1>
                    <p className="text-xs text-gray-400">Welcome back to AgentForge Enterprise AI OS.</p>
                  </div>

                  {/* Central AI prompt input area */}
                  <div className="bg-[#091f17]/80 border border-emerald-500/25 rounded-2xl p-5 shadow-2xl space-y-4">
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-2">
                        {uploadedFiles.map(file => (
                          <div key={file.name} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-lg text-[10px] text-emerald-400">
                            <FileCode className="w-3 h-3" />
                            <span>{file.name}</span>
                            <button onClick={() => removeUploadedFile(file.name)} className="hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleInputSubmit} className="flex gap-2">
                      <div className="relative flex-1 flex items-center bg-[#030d0a] border border-emerald-500/20 rounded-xl px-3 py-2">
                        <button 
                          type="button"
                          onClick={triggerFileDialog}
                          className="p-1 rounded text-gray-400 hover:text-white mr-2"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask anything about consensus code files, database logs, API explorer..." 
                          className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                       <button type="submit" className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black px-4 rounded-xl flex items-center justify-center font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 duration-200">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Suggestion prompt tags list */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                      {suggestedPrompts.map(prompt => (
                        <div 
                          key={prompt}
                          onClick={() => handleSendPrompt(prompt)}
                          className="p-3 bg-[#030d0a] border border-emerald-500/10 rounded-xl text-[10px] text-gray-400 hover:border-emerald-500/25 hover:text-white cursor-pointer transition flex flex-col justify-between h-20"
                        >
                          <span className="leading-relaxed font-semibold">{prompt}</span>
                          <CornerDownLeft className="w-3 h-3 text-emerald-500/30 ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard Widgets grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#030d0a] border border-emerald-500/10 p-5 rounded-2xl space-y-3">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Sprint Goal Burndown</span>
                      <p className="text-lg font-black text-white">Sprint 42 Consensus Core</p>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[84%]" />
                      </div>
                      <span className="text-[10px] text-emerald-400 block font-bold">84% task units complete</span>
                    </div>

                    <div className="bg-[#030d0a] border border-emerald-500/10 p-5 rounded-2xl space-y-3">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Telemetry Status</span>
                      <p className="text-lg font-black text-rose-400">2 Incident alerts active</p>
                      <span className="text-[10px] text-gray-500 block">Candidate convergence deadlocks check</span>
                    </div>

                    <div className="bg-[#030d0a] border border-emerald-500/10 p-5 rounded-2xl space-y-3">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Active branch telemetry</span>
                      <p className="text-xs font-mono text-gray-300">raft/consensus.go • 12 KB</p>
                      <span className="text-[10px] text-gray-500 block">Last commit integrated 2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "AI Mentor" && (
                // 2. AI MENTOR CONSOLE (CHAT SESSION)
                <div className="space-y-6 max-w-3xl mx-auto w-full">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                    <h3 className="font-bold text-sm text-white">Interactive Mentorship session</h3>
                    <button onClick={() => setChatMessages([])} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <RefreshCcw className="w-3.5 h-3.5" /> Clear chat
                    </button>
                  </div>

                  <div className="space-y-6 min-h-[300px]">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-xs text-gray-500 py-10">Start writing prompts or select options to load workspace context.</div>
                    ) : (
                      chatMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${msg.sender === "user" ? "bg-emerald-500 text-black" : "bg-[#0c261c] border border-emerald-500/10 text-emerald-400"}`}>
                            {msg.sender === "user" ? userInitials : "AI"}
                          </div>
                          <div className="p-4 rounded-xl text-xs leading-relaxed max-w-[85%] space-y-3 bg-[#091f17]/90 border border-emerald-500/10 text-gray-300">
                            {msg.files && msg.files.length > 0 && (
                              <div className="flex flex-wrap gap-2 pb-2 border-b border-emerald-500/10">
                                {msg.files.map(f => (
                                  <div key={f.name} className="flex items-center gap-1.5 bg-[#030d0a] px-2.5 py-1 rounded border border-emerald-500/10">
                                    <FileCode className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[10px] text-white font-mono">{f.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}

                    {isGenerating && streamedText && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0c261c] border border-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs shrink-0 animate-pulse">AI</div>
                        <div className="p-4 rounded-xl text-xs leading-relaxed max-w-[85%] bg-[#091f17]/90 border border-emerald-500/10 text-gray-300">
                          <p className="whitespace-pre-line font-medium leading-relaxed">{streamedText}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleInputSubmit} className="flex gap-2 pt-4 border-t border-emerald-500/10">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask follow up questions..." 
                      className="flex-1 bg-[#091f17] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <button type="submit" className="bg-[#091f17] hover:bg-gradient-to-r hover:from-emerald-500 hover:to-amber-500 hover:text-black text-white px-4 rounded-xl flex items-center justify-center border border-emerald-500/20 transition-all duration-200">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "Projects" && (
                // 3. KANBAN BOARD (PROJECTS TAB)
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Sprint task matrix</h3>
                    <button 
                      onClick={() => setShowAddCardStatus("Todo")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Ticket</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {["Todo", "In Progress", "Blocked", "Completed"].map(status => (
                      <div key={status} className="bg-[#030d0a] border border-emerald-500/10 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-white uppercase font-mono">{status}</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded-full">
                              {kanbanTasks.filter(t => t.status === status).length}
                            </span>
                          </div>

                          {showAddCardStatus === status && (
                            <div className="space-y-2 bg-[#091f17] p-2 rounded-xl border border-emerald-500/25">
                              <input 
                                type="text" 
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Ticket name..."
                                className="w-full bg-[#030d0a] border border-white/10 text-xs text-white p-1.5 rounded focus:outline-none focus:border-emerald-400"
                                onKeyDown={(e) => e.key === "Enter" && handleAddKanbanCard(status)}
                              />
                              <div className="flex gap-1.5 justify-end">
                                <button onClick={() => setShowAddCardStatus(null)} className="text-[10px] text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={() => handleAddKanbanCard(status)} className="text-[10px] text-emerald-400 font-bold">Add</button>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            {kanbanTasks.filter(t => t.status === status).map(task => (
                              <div key={task.id} className="p-3 bg-[#091f17]/40 border border-emerald-500/5 hover:border-emerald-500/20 rounded-xl space-y-2 transition">
                                <p className="text-xs text-gray-200 leading-normal font-semibold">{task.title}</p>
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className={`px-1.5 py-0.5 rounded font-mono uppercase ${task.priority === "Critical" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>{task.priority}</span>
                                  <button 
                                    onClick={() => setKanbanTasks(prev => prev.filter(t => t.id !== task.id))}
                                    className="text-gray-500 hover:text-red-400"
                                  >
                                    <Trash className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Knowledge Base" && (
                // 4. KNOWLEDGE BASE (DOCUMENT STORAGE)
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Repository documentation registry</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Raft Architecture Specifications", file: "raft_spec.pdf", type: "PDF specification", link: "Raft V2 specs" },
                      { title: "KMS Secret Access Middleware", file: "okta_kms.go", type: "Security mapping", link: "Okta oauth KMS client configs" },
                      { title: "Consensus Log database schema setup", file: "schema.sql", type: "Database script", link: "Postgres schema creation logs" }
                    ].map(doc => (
                      <div key={doc.file} className="p-4 bg-[#030d0a] border border-emerald-500/10 rounded-2xl flex justify-between items-center hover:border-emerald-500/30 transition">
                        <div className="flex items-center gap-3">
                          <FileCode className="w-8 h-8 text-emerald-400" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                            <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">{doc.file} ({doc.type})</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSendPrompt(`Summarize and explain the file: ${doc.link}`)}
                          className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Analyze</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Repositories" && (
                // 5. REPOSITORY EXPLORER
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Active Repository Workspace</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* File tree */}
                    <div className="bg-[#030d0a] border border-emerald-500/10 rounded-2xl p-4 space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase block font-black mb-2">Branches / Files</span>
                      {repoFiles.map(file => (
                        <div 
                          key={file.name}
                          onClick={() => setSelectedRepoFile(file.name)}
                          className={`p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${selectedRepoFile === file.name ? "bg-[#091f17] border border-emerald-500/25 text-white" : "text-gray-400 hover:bg-[#091f17]/50"}`}
                        >
                          <FileCode className="w-4 h-4 text-emerald-400" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Code preview details */}
                    <div className="md:col-span-2 bg-[#030d0a] border border-emerald-500/10 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-white font-mono">{selectedRepoFile}</span>
                        <button 
                          onClick={() => handleSendPrompt(`Explain the files code context for ${selectedRepoFile}`)}
                          className="text-[10px] text-emerald-400 font-bold hover:underline"
                        >
                          Explain file code context
                        </button>
                      </div>
                      <div className="p-4 bg-[#040e0b] border border-white/5 rounded-xl font-mono text-[10px] text-gray-300 overflow-x-auto min-h-[150px]">
                        {selectedRepoFile.endsWith(".go") ? (
                          <p className="whitespace-pre">
                            {`package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Consensus raft engine active")\n}`}
                          </p>
                        ) : selectedRepoFile.endsWith(".js") ? (
                          <p className="whitespace-pre">
                            {`export const verifyAuth = (req) => {\n  return token !== null;\n}`}
                          </p>
                        ) : (
                          <p className="whitespace-pre">
                            {`CREATE TABLE consensus_logs (\n  id SERIAL PRIMARY KEY,\n  term INT NOT NULL\n);`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Database Explorer" && (
                // 6. DATABASE EXPLORER
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Workspace DB Explorer</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Table Lists */}
                    <div className="bg-[#030d0a] border border-emerald-500/10 rounded-2xl p-4 space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase block font-black">Active Database tables</span>
                      {[
                        { name: "consensus_logs", fields: 4 },
                        { name: "raft_states", fields: 3 }
                      ].map(tb => (
                        <div 
                          key={tb.name}
                          onClick={() => handleSendPrompt(`Explain the database table layout: ${tb.name}`)}
                          className="p-3 bg-[#091f17]/40 hover:bg-[#091f17]/80 rounded-xl text-xs font-semibold cursor-pointer transition flex justify-between"
                        >
                          <span>{tb.name}</span>
                          <span className="text-[10px] text-gray-500">{tb.fields} columns</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "API Explorer" && (
                // 7. API EXPLORER
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Dynamic API route explorer</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { method: "POST", path: "/api/v1/raft/heartbeat", status: "200 OK", latency: "15ms" },
                      { method: "GET", path: "/api/v1/raft/state", status: "200 OK", latency: "22ms" }
                    ].map(api => (
                      <div key={api.path} className="p-4 bg-[#030d0a] border border-emerald-500/10 rounded-2xl flex justify-between items-center hover:border-emerald-500/30 transition">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded font-black text-[10px] ${api.method === "POST" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"}`}>{api.method}</span>
                          <div>
                            <p className="text-xs font-bold text-white font-mono">{api.path}</p>
                            <span className="text-[10px] text-gray-500">{api.latency} response</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSendPrompt(`Explain and test endpoint: ${api.method} ${api.path}`)}
                          className="text-[10px] text-emerald-400 font-bold hover:underline"
                        >
                          Send Request
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Architecture" && (
                // 8. ARCHITECTURE TOPOLOGY DIAGRAM
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Raft Node Topology Explorer</h3>
                  </div>

                  <div className="p-6 bg-[#030d0a] border border-emerald-500/10 rounded-3xl flex justify-center items-center relative overflow-hidden min-h-[300px]">
                    <div className="grid grid-cols-3 gap-12 text-center text-xs w-full max-w-lg z-10">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                        <p className="font-bold text-emerald-400 font-mono">NODE A (Leader)</p>
                        <span className="text-[10px] text-gray-400">Heartbeats synced</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                        <p className="font-bold text-gray-200 font-mono">NODE B (Follower)</p>
                        <span className="text-[10px] text-gray-400">Index log: 421</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                        <p className="font-bold text-gray-200 font-mono">NODE C (Follower)</p>
                        <span className="text-[10px] text-gray-400">Index log: 421</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] -z-1" />
                  </div>
                </div>
              )}

              {activeTab === "Learning Center" && (
                // 9. LEARNING PROGRESS MATRIX
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-white">Interactive Training Matrix</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { skill: "Consensus Algorithms", desc: "Raft leader timeout and logs partition configurations.", progress: 84 },
                      { skill: "Okta OAuth Authentication", desc: "KMS encryption schemas and verify session middleware.", progress: 50 },
                      { skill: "High volume SQL partition mapping", desc: "Postgres schema creation and performance audit.", progress: 100 }
                    ].map(sk => (
                      <div key={sk.skill} className="bg-[#030d0a] border border-emerald-500/10 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white leading-normal">{sk.skill}</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed">{sk.desc}</p>
                        </div>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[9px] font-mono text-gray-500">
                            <span>Status</span>
                            <span className="text-emerald-400">{sk.progress}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${sk.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* RIGHT AI CONTEXT PANEL */}
            {/* ──────────────────────────────────────────────────────── */}
            <AnimatePresence>
              {copilotOpen && (
                <motion.aside 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 340, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-emerald-500/10 bg-[#030d0a] flex flex-col p-5 shrink-0 z-20 h-full overflow-y-auto scrollbar-thin space-y-6"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                    <span className="font-bold text-xs uppercase tracking-wider text-white">AI Context</span>
                    <button onClick={() => setCopilotOpen(false)} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Active Context elements */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-black">Active Project</span>
                      <p className="text-xs font-bold text-white mt-1">{copilotContext.project}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-black">Active Module</span>
                      <p className="text-xs font-mono text-emerald-400 mt-1">{copilotContext.module}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-black">Assigned Tickets</span>
                      <div className="space-y-1.5 mt-1">
                        {copilotContext.relatedTickets.map(t => (
                          <p key={t} className="text-xs text-gray-300 leading-normal">• {t}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions / Prompt Library */}
                  <div className="space-y-3 pt-4 border-t border-emerald-500/10">
                    <span className="text-[9px] text-gray-500 uppercase font-black block">Quick Actions</span>
                    <button 
                      onClick={() => handleSendPrompt("Explain repository architecture")}
                      className="w-full text-left py-2 px-3 bg-[#091f17] border border-emerald-500/10 hover:bg-emerald-500/20 text-gray-300 rounded-lg transition"
                    >
                      Explain Repository Architecture
                    </button>
                    <button 
                      onClick={() => handleSendPrompt("Generate SQL query")}
                      className="w-full text-left py-2 px-3 bg-[#091f17] border border-emerald-500/10 hover:bg-emerald-500/20 text-gray-300 rounded-lg transition"
                    >
                      Generate SQL Query
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer at the very bottom (full width of screen!) */}
      <div className="shrink-0 z-40 border-t border-emerald-500/10 bg-[#030d0a]">
        <Footer />
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* COMMAND PALETTE (CTRL+K OVERLAY) */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-[#071a14] border border-emerald-500/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-4 h-4 text-emerald-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type a command or query..."
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setShowSearch(false)} className="text-xs text-gray-500 hover:text-white">ESC</button>
              </div>

              <div className="p-4 max-h-72 overflow-y-auto space-y-4 scrollbar-thin text-xs text-gray-400">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Category Jumps</span>
                <div className="space-y-1">
                  <div 
                    onClick={() => { handleOpenTab("Projects"); setShowSearch(false); }}
                    className="p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer flex justify-between"
                  >
                    <span>Open Projects Board</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                  <div 
                    onClick={() => { handleOpenTab("Knowledge Base"); setShowSearch(false); }}
                    className="p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer flex justify-between"
                  >
                    <span>Open Knowledge Base</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
