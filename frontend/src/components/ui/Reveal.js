"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Reveal({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 900,
  direction = "up", 
  threshold = 0.1 
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(([entry]) => { 
      if (entry.isIntersecting) {
        setVisible(true);
        obs.unobserve(el);
      } 
    }, { threshold });
    
    obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, [threshold]);

  const directions = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    scale: "scale-95 opacity-0",
    fade: "opacity-0"
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-all [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible 
          ? "translate(0, 0) scale(1)" 
          : directions[direction] || directions.up
      }}
    >
      {children}
    </div>
  );
}