"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAuth } from '@/services/authContext';
import { 
  toggleSidebar, 
  setActiveNavItem, 
  selectChat,
  createChat,
  pinChat,
  unpinChat,
  deleteChat,
  renameChat,
  attachFileToActiveChat 
} from '../store/dashboardSlice';
import { 
  Terminal, 
  FolderKanban, 
  BookOpen, 
  Workflow, 
  GraduationCap, 
  Plus, 
  Search, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCode,
  FolderOpen,
  Pin,
  PinOff,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  Filter
} from 'lucide-react';

function SidebarWireframe() {
  const meshRef = React.useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <torusKnotGeometry args={[2.5, 0.8, 64, 16]} />
      <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const sidebarCollapsed = useSelector((state) => state.dashboard?.sidebarCollapsed ?? false);
  const activeNavItem = useSelector((state) => state.dashboard?.activeNavItem || 'AI Console');
  const chats = useSelector((state) => state.dashboard?.chats || []);
  const activeChatId = useSelector((state) => state.dashboard?.activeChatId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const menuItems = [
    { id: 'AI Console', label: 'AI Console', icon: Terminal, href: '/dashboard' },
    { id: 'Projects', label: 'Projects', icon: FolderKanban, href: '/project' },
    { id: 'Knowledge Base', label: 'Knowledge Base', icon: BookOpen, href: '/faqs' },
    { id: 'Architecture', label: 'Architecture', icon: Workflow, href: '/workspace' },
    { id: 'Learning Center', label: 'Learning Center', icon: GraduationCap, href: '/benefits' },
  ];

  const workspaceFiles = [
    { name: 'layout.jsx', path: 'src/app/layout.jsx', type: 'code' },
    { name: 'globals.css', path: 'src/app/globals.css', type: 'css' },
    { name: 'Dashboard.js', path: 'src/dashboard/Dashboard.js', type: 'code' },
    { name: 'DashboardContent.js', path: 'src/dashboard/components/DashboardContent.js', type: 'code' },
    { name: 'Sidebar.js', path: 'src/dashboard/layout/Sidebar.js', type: 'code' },
    { name: 'WorkspaceLayout.js', path: 'src/dashboard/layout/WorkspaceLayout.js', type: 'code' },
    { name: 'dashboardSlice.js', path: 'src/dashboard/store/dashboardSlice.js', type: 'code' },
    { name: 'useDashboard.js', path: 'src/dashboard/hooks/useDashboard.js', type: 'code' },
    { name: 'package.json', path: 'package.json', type: 'json' },
    { name: 'next.config.js', path: 'next.config.js', type: 'code' }
  ];

  // Get dynamic initials & name details
  const userName = user ? user.fullName : 'Guest User';
  const userDomain = user ? user.domain : 'Developer';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Keyboard shortcut: ⌘B / Ctrl+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        dispatch(toggleSidebar());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleNewChat = () => {
    dispatch(createChat());
    dispatch(setActiveNavItem('AI Console'));
  };

  const handleAttachFile = (fileName) => {
    dispatch(attachFileToActiveChat({ name: fileName, size: '4.8 KB', type: 'code' }));
  };

  const togglePin = (e, chatId, isPinned) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPinned) {
      dispatch(unpinChat(chatId));
    } else {
      dispatch(pinChat(chatId));
    }
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(deleteChat(chatId));
  };

  const startRename = (e, chat) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const saveRename = (chatId) => {
    if (editTitle.trim()) {
      dispatch(renameChat({ id: chatId, title: editTitle }));
    }
    setEditingChatId(null);
  };

  // Filtered lists
  const pinnedChats = chats.filter(c => c.pinned && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const recentChats = chats.filter(c => !c.pinned && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFiles = workspaceFiles.filter(f => f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()));

  return (
    <motion.aside 
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full bg-[#030712]/60 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col shrink-0 select-none text-white overflow-hidden relative"
    >
      
      {/* 3D Sidebar Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <SidebarWireframe />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
      {/* ── Top Header Dropdown / Expand Toggle ── */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-cyan-500/20 shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 font-bold text-sm text-[#F3F4F6] hover:text-white cursor-pointer transition-colors"
            >
              <span>AgentForge Console</span>
              <span className="text-[10px] text-primary">▼</span>
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto text-primary font-bold text-base"
            >
              AF
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Action Buttons & Search ── */}
      <div className="p-4 space-y-3 border-b border-white/[0.02] shrink-0">
        {/* + New Chat capsule */}
        <button 
          onClick={handleNewChat}
          className={`flex items-center justify-center gap-2 border border-cyan-500/30 hover:border-primary/40 hover:bg-white/[0.02] py-2 rounded-full text-xs font-semibold text-[#F3F4F6] transition-all cursor-pointer ${
            sidebarCollapsed ? 'w-10 h-10 px-0 rounded-full' : 'w-full px-4'
          }`}
          title="New Chat"
        >
          <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
          {!sidebarCollapsed && <span>New chat</span>}
        </button>

        {/* Search Input */}
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex items-center bg-cyan-950/20 backdrop-blur-md/50 border border-cyan-500/20 focus-within:border-primary/30 rounded-lg px-3 py-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#94A3B8]/60 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/40 focus:outline-none"
            />
          </motion.div>
        )}
      </div>

      {/* ── Sidebar Scrollable Area ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        
        {/* Core Navigation Items */}
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;

            return (
              <div
                key={item.id}
                onClick={() => dispatch(setActiveNavItem(item.id))}
                className="block cursor-pointer"
                title={sidebarCollapsed ? item.label : ""}
              >
                <div className={`flex items-center gap-3 rounded-lg py-2 transition-all duration-150 ${
                  sidebarCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive 
                    ? 'bg-cyan-500/10 text-white border-l-2 border-cyan-400 shadow-[inset_2px_0_0_rgba(6,182,212,0.5)] shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'text-[#94A3B8] hover:bg-white/[0.02] hover:text-white'
                }`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-[#94A3B8]'}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pinned Sub-section */}
        {!sidebarCollapsed && pinnedChats.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <div className="text-[10px] font-bold tracking-widest text-[#94A3B8]/40 uppercase px-3 flex items-center justify-between">
              <span>Pinned</span>
            </div>
            <div className="space-y-0.5">
              {pinnedChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => dispatch(selectChat(chat.id))}
                  className={`w-full flex items-center justify-between rounded-lg py-1.5 px-3 text-xs text-[#94A3B8] hover:bg-white/[0.02] hover:text-white text-left transition-all group relative cursor-pointer ${
                    activeChatId === chat.id ? 'bg-cyan-950/20 backdrop-blur-md text-white font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-grow mr-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {editingChatId === chat.id ? (
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveRename(chat.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename(chat.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="bg-cyan-900/30 text-white text-xs px-1.5 py-0.5 rounded outline-none border border-primary/30 w-full"
                      />
                    ) : (
                      <span className="truncate">{chat.title}</span>
                    )}
                  </div>
                  
                  {/* CRUD Actions Panel */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {editingChatId === chat.id ? (
                      <button onClick={(e) => { e.stopPropagation(); saveRename(chat.id); }} className="p-0.5 hover:bg-white/10 rounded text-emerald-400">
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <>
                        <button onClick={(e) => startRename(e, chat)} className="p-0.5 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300" title="Rename">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => togglePin(e, chat.id, true)} className="p-0.5 hover:bg-white/10 rounded text-amber-400 hover:text-amber-300" title="Unpin">
                          <Pin className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => handleDelete(e, chat.id)} className="p-0.5 hover:bg-white/10 rounded text-red-400 hover:text-red-300" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Chats Sub-section */}
        {!sidebarCollapsed && recentChats.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <div className="text-[10px] font-bold tracking-widest text-[#94A3B8]/40 uppercase px-3">
              Recent Chats
            </div>
            <div className="space-y-0.5">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => dispatch(selectChat(chat.id))}
                  className={`w-full flex items-center justify-between rounded-lg py-1.5 px-3 text-xs text-[#94A3B8] hover:bg-white/[0.02] hover:text-white text-left transition-all group relative cursor-pointer ${
                    activeChatId === chat.id ? 'bg-cyan-950/20 backdrop-blur-md text-white font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-grow mr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                    {editingChatId === chat.id ? (
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveRename(chat.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename(chat.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="bg-cyan-900/30 text-white text-xs px-1.5 py-0.5 rounded outline-none border border-primary/30 w-full"
                      />
                    ) : (
                      <span className="truncate">{chat.title}</span>
                    )}
                  </div>

                  {/* CRUD Actions Panel */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {editingChatId === chat.id ? (
                      <button onClick={(e) => { e.stopPropagation(); saveRename(chat.id); }} className="p-0.5 hover:bg-white/10 rounded text-emerald-400">
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <>
                        <button onClick={(e) => startRename(e, chat)} className="p-0.5 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300" title="Rename">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => togglePin(e, chat.id, false)} className="p-0.5 hover:bg-white/10 rounded text-amber-400 hover:text-amber-300" title="Pin">
                          <PinOff className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => handleDelete(e, chat.id)} className="p-0.5 hover:bg-white/10 rounded text-red-400 hover:text-red-300" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workspace Files Explorer Tab (with GitHub-style search filter) */}
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-[10px] font-bold tracking-widest text-[#94A3B8]/40 uppercase px-3 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Workspace Files</span>
            </div>

            {/* GitHub-style File Search Filter input */}
            <div className="px-3">
              <div className="relative flex items-center bg-cyan-950/20 backdrop-blur-md/30 border border-cyan-500/20 focus-within:border-primary/20 rounded px-2 py-1 transition-all">
                <Filter className="w-3 h-3 text-[#94A3B8]/40 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  placeholder="Go to file..."
                  className="bg-transparent text-[10px] text-white placeholder-[#94A3B8]/30 focus:outline-none w-full"
                />
                {fileSearchQuery && (
                  <button onClick={() => setFileSearchQuery('')} className="p-0.5 hover:bg-white/10 rounded">
                    <X className="w-2.5 h-2.5 text-[#94A3B8]/40" />
                  </button>
                )}
              </div>
            </div>

            {/* File List */}
            <div className="space-y-0.5 max-h-[160px] overflow-y-auto scrollbar-none border-l border-white/[0.03] ml-4">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAttachFile(file.name)}
                    className="w-full flex items-center gap-2 rounded-lg py-1 px-3 text-[11px] text-[#94A3B8] hover:bg-[#10B981]/10 hover:text-white text-left transition-all cursor-pointer group"
                    title={file.path}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#10B981] opacity-75 group-hover:opacity-100 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-[10px] text-[#94A3B8]/30 px-3 py-1 italic">
                  No files found
                </div>
              )}
            </div>
          </motion.div>
        )}

      </nav>

      {/* ── User Profile at Bottom ── */}
      <div className="border-t border-cyan-500/20 p-4 bg-[#030712]/60 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center font-bold text-black text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0">
            {initials}
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#F3F4F6] truncate">{userName}</span>
              <span className="text-[9px] font-bold text-emerald-400 truncate">{userDomain}</span>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <button 
            onClick={handleLogout}
            className="text-[#94A3B8] hover:text-red-400 transition-colors p-1.5 hover:bg-white/[0.02] rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
      </div>
    </motion.aside>
  );
}
