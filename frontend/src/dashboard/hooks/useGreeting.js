"use client";
import { useState, useEffect } from 'react';

export function useGreeting() {
  const [greeting, setGreeting] = useState('Good Morning');
  const [emoji, setEmoji] = useState('☀️');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) { setGreeting('Good Morning'); setEmoji('☀️'); }
    else if (hour < 17) { setGreeting('Good Afternoon'); setEmoji('🌤️'); }
    else if (hour < 21) { setGreeting('Good Evening'); setEmoji('🌆'); }
    else { setGreeting('Working Late'); setEmoji('🌙'); }
  }, []);
  
  return { greeting, emoji };
}
