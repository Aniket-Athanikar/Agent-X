import fs from 'fs';
import path from 'path';

const outDir = 'c:/Users/mruna/Downloads/AgentForge/AgentForge/frontend/src/landing/layouts';
const uiDir = 'c:/Users/mruna/Downloads/AgentForge/AgentForge/frontend/src/components/ui';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

const revealCode = `"use client";
import React, { useState, useEffect, useRef } from "react";

export default function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { 
        if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } 
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  const dirs = { up: 'translate-y-10', left: '-translate-x-10', right: 'translate-x-10', scale: 'scale-95' };
  return (
    <div ref={ref} className={\`\${className} transition-all duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] \${visible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : \`opacity-0 \${dirs[direction] || dirs.up}\`}\`} style={{ transitionDelay: \`\${delay}ms\` }}>
        {children}
    </div>
  );
}`;
fs.writeFileSync(path.join(uiDir, 'Reveal.js'), revealCode);

const counterCode = `"use client";
import React, { useState, useEffect, useRef } from "react";

export default function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count}</span>;
}`;
fs.writeFileSync(path.join(uiDir, 'AnimatedCounter.js'), counterCode);

console.log("UI components created.");
