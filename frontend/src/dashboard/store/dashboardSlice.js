"use client";

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  copilotOpen: true,
  commandPaletteOpen: false,
  notificationsOpen: false,
  selectedTask: null,
  selectedRepo: null,
  chats: [
    { 
      id: 'chat-1', 
      title: 'New Chat', 
      messages: [], 
      pinned: false,
      attachedFiles: []
    },
    { 
      id: 'chat-2', 
      title: 'Auth Middleware specs', 
      messages: [
        { id: 'm1', role: 'user', content: 'What auth mechanism is implemented?', timestamp: new Date().toISOString() },
        { id: 'm2', role: 'assistant', content: 'Okta identity verification intercepts dashboard access tokens under secure KMS encryption loops.', timestamp: new Date().toISOString() }
      ], 
      pinned: false,
      attachedFiles: []
    },
    { 
      id: 'chat-3', 
      title: 'Raft Consensus Audit', 
      messages: [
        { id: 'r1', role: 'user', content: 'Audit Raft nodes replication log status.', timestamp: new Date().toISOString() },
        { id: 'r2', role: 'assistant', content: 'Raft Consensus Audit indicates stable log replication across all 3 seed nodes, with a current leader election term of 4.', timestamp: new Date().toISOString() }
      ], 
      pinned: true,
      attachedFiles: []
    },
    { 
      id: 'chat-4', 
      title: 'Database Partition Logs', 
      messages: [
        { id: 'd1', role: 'user', content: 'Show partition status.', timestamp: new Date().toISOString() },
        { id: 'd2', role: 'assistant', content: 'Located user credentials tables, active sprint metadata mapping, and task tracking partitions under PostgreSQL layout.', timestamp: new Date().toISOString() }
      ], 
      pinned: true,
      attachedFiles: []
    }
  ],
  activeChatId: 'chat-2',
  recentPrompts: [
    'Review latest PR changes',
    'Generate unit tests for auth module',
    'Explain the deployment pipeline',
  ],
  activeNavItem: 'AI Console',
  currentProject: 'Agent-X Enterprise v2',
  currentRepo: 'core-intelligence-api',
  currentSprint: { name: 'Sprint 18', daysLeft: 4 },
  unreadNotifications: 3,
  recentDocuments: [],
  selectedFile: null,
  activeFile: null,
  expandedFolders: {},
  fileBranches: [],
  activeBranch: 'main',
  sidebarPanel: 'explorer',
  fileTree: [],
  projectLoaded: false,
  projectName: '',
  workspaceLoading: false,
  workspaceError: null,
  workspaceData: null,
  showBillingPanel: false,
  billingPlan: 'free',
  workspaceSwitching: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleCopilot: (state) => {
      state.copilotOpen = !state.copilotOpen;
    },
    setCopilotOpen: (state, action) => {
      state.copilotOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    selectChat: (state, action) => {
      state.activeChatId = action.payload;
    },
    createChat: (state) => {
      const newId = `chat-${Date.now()}`;
      state.chats.unshift({
        id: newId,
        title: 'New Chat',
        messages: [],
        pinned: false,
        attachedFiles: []
      });
      state.activeChatId = newId;
    },
    pinChat: (state, action) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) chat.pinned = true;
    },
    unpinChat: (state, action) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) chat.pinned = false;
    },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(c => c.id !== action.payload);
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats[0]?.id || null;
      }
    },
    renameChat: (state, action) => {
      const chat = state.chats.find(c => c.id === action.payload.id);
      if (chat) chat.title = action.payload.title;
    },
    addMessageToActiveChat: (state, action) => {
      const chat = state.chats.find(c => c.id === state.activeChatId);
      if (chat) {
        chat.messages.push({
          id: Date.now().toString(),
          ...action.payload,
          timestamp: new Date().toISOString(),
        });
        // Auto rename New Chat on first message
        if (chat.title === 'New Chat' && action.payload.role === 'user') {
          chat.title = action.payload.content.slice(0, 24) + (action.payload.content.length > 24 ? '...' : '');
        }
      }
    },
    clearActiveChatMessages: (state) => {
      const chat = state.chats.find(c => c.id === state.activeChatId);
      if (chat) {
        chat.messages = [];
        chat.attachedFiles = [];
      }
    },
    addRecentPrompt: (state, action) => {
      const prompt = action.payload;
      state.recentPrompts = [prompt, ...state.recentPrompts.filter(p => p !== prompt)].slice(0, 5);
    },
    setActiveNavItem: (state, action) => {
      state.activeNavItem = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    setCurrentRepo: (state, action) => {
      state.currentRepo = action.payload;
    },
    markNotificationsRead: (state) => {
      state.unreadNotifications = 0;
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    selectRepo: (state, action) => {
      state.selectedRepo = action.payload;
    },
    attachFileToActiveChat: (state, action) => {
      const chat = state.chats.find(c => c.id === state.activeChatId);
      if (chat) {
        if (!chat.attachedFiles) chat.attachedFiles = [];
        if (!chat.attachedFiles.some(f => f.name === action.payload.name)) {
          chat.attachedFiles.push(action.payload);
        }
      }
    },
    removeAttachedFileFromActiveChat: (state, action) => {
      const chat = state.chats.find(c => c.id === state.activeChatId);
      if (chat && chat.attachedFiles) {
        chat.attachedFiles = chat.attachedFiles.filter(f => f.name !== action.payload);
      }
    },
    clearAttachedFilesFromActiveChat: (state) => {
      const chat = state.chats.find(c => c.id === state.activeChatId);
      if (chat) {
        chat.attachedFiles = [];
      }
    },
    toggleFolderExpanded: (state, action) => {
      const path = action.payload;
      state.expandedFolders[path] = !state.expandedFolders[path];
    },
    selectFile: (state, action) => {
      state.selectedFile = action.payload;
      state.activeFile = action.payload;
    },
    setFileBranches: (state, action) => {
      state.fileBranches = action.payload;
    },
    setActiveBranch: (state, action) => {
      state.activeBranch = action.payload;
    },
    setWorkspaceLoading: (state, action) => {
      state.workspaceLoading = action.payload;
    },
    setWorkspaceError: (state, action) => {
      state.workspaceError = action.payload;
    },
    setWorkspaceData: (state, action) => {
      state.workspaceData = action.payload;
    },
    setSidebarPanel: (state, action) => {
      state.sidebarPanel = action.payload;
    },
    setShowBillingPanel: (state, action) => {
      state.showBillingPanel = action.payload;
    },
    setProjectLoaded: (state, action) => {
      state.projectLoaded = action.payload.loaded;
      state.projectName = action.payload.name;
    },
    setFileTree: (state, action) => {
      state.fileTree = action.payload;
    },
    setExpandedFolders: (state, action) => {
      state.expandedFolders = action.payload;
    },
    setBillingPlan: (state, action) => {
      state.billingPlan = action.payload;
    },
    resetProject: (state) => {
      state.projectLoaded = false;
      state.projectName = '';
      state.fileTree = [];
      state.expandedFolders = {};
      state.selectedFile = null;
      state.activeFile = null;
    },
    resetUserWorkspace: (state) => {
      state.projectLoaded = false;
      state.projectName = '';
      state.fileTree = [];
      state.expandedFolders = {};
      state.selectedFile = null;
      state.activeFile = null;
      state.fileBranches = [];
      state.chats = [{ id: 'chat-1', title: 'New Chat', messages: [], pinned: false, attachedFiles: [] }];
      state.activeChatId = 'chat-1';
    },
    requestWorkspaceSwitch: (state) => { state.workspaceSwitching = true; },
    cancelWorkspaceSwitch: (state) => { state.workspaceSwitching = false; },
    completeWorkspaceSwitch: (state) => {
      state.workspaceSwitching = false;
      state.selectedFile = null;
      state.activeFile = null;
      state.fileBranches = [];
      const id = `chat-${Date.now()}`;
      state.chats.unshift({ id, title: 'New Chat', messages: [], pinned: false, attachedFiles: [] });
      state.activeChatId = id;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleCopilot,
  setCopilotOpen,
  toggleCommandPalette,
  toggleNotifications,
  selectChat,
  createChat,
  pinChat,
  unpinChat,
  deleteChat,
  renameChat,
  addMessageToActiveChat,
  clearActiveChatMessages,
  addRecentPrompt,
  setActiveNavItem,
  setCurrentProject,
  setCurrentRepo,
  markNotificationsRead,
  selectTask,
  selectRepo,
  attachFileToActiveChat,
  removeAttachedFileFromActiveChat,
  clearAttachedFilesFromActiveChat,
  toggleFolderExpanded,
  selectFile,
  setFileBranches,
  setActiveBranch,
  setWorkspaceLoading,
  setWorkspaceError,
  setWorkspaceData,
  setSidebarPanel,
  setShowBillingPanel,
  setProjectLoaded,
  setFileTree,
  setExpandedFolders,
  setBillingPlan,
  resetProject,
  requestWorkspaceSwitch,
  cancelWorkspaceSwitch,
  completeWorkspaceSwitch,
  resetUserWorkspace,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
