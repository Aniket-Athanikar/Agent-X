"use client";
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleCopilot, toggleCommandPalette, toggleNotifications, addMessageToActiveChat, addRecentPrompt, selectTask, selectRepo } from '../store/dashboardSlice';
import { useCallback, useEffect } from 'react';

export function useDashboard() {
  const dispatch = useDispatch();
  const state = useSelector(s => s.dashboard);
  
  return {
    ...state,
    toggleSidebar: useCallback(() => dispatch(toggleSidebar()), [dispatch]),
    toggleCopilot: useCallback(() => dispatch(toggleCopilot()), [dispatch]),
    toggleCommandPalette: useCallback(() => dispatch(toggleCommandPalette()), [dispatch]),
    toggleNotifications: useCallback(() => dispatch(toggleNotifications()), [dispatch]),
    sendMessage: useCallback(async (content) => {

      // Show user message immediately
      dispatch(addMessageToActiveChat({
          role: "user",
          content,
      }));

      dispatch(addRecentPrompt(content));

      try {

          const response = await fetch(
              "http://localhost:8000/ai/chat/test",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      question: content,
                  }),
              }
          );

          const data = await response.json();

          dispatch(
              addMessageToActiveChat({
                  role: "assistant",
                  content: data.answer,
              })
          );

      } catch (error) {

          dispatch(
              addMessageToActiveChat({
                  role: "assistant",
                  content: "Failed to contact Agent-X AI.",
              })
          );

          console.error(error);
      }

  }, [dispatch]),
    selectTask: useCallback((task) => dispatch(selectTask(task)), [dispatch]),
    selectRepo: useCallback((repo) => dispatch(selectRepo(repo)), [dispatch]),
  };
}

export function useKeyboardShortcuts() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); dispatch(toggleCommandPalette()); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); dispatch(toggleSidebar()); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') { e.preventDefault(); dispatch(toggleCopilot()); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);
}
