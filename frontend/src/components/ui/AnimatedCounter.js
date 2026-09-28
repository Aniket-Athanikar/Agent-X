"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AnimatedCounter({ 
  value, 
  duration = 2000, 
  prefix = "", 
  suffix = "", 
  decimals = 0 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(([entry]) => { 
      if (entry.isIntersecting) {
        setIsVisible(true);
        obs.unobserve(el);
      } 
    }, { threshold: 0.1 });
    
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp = null;
    const numericValue = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^0-9.]/g, "")) || 0;
    
    // Smooth deceleration easing function (easeOutExpo)
    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easeOutExpo(progress);
      const currentCount = easedProgress * numericValue;
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isVisible, value, duration]);

  // Format count with commas and correct decimal digits
  const formatNumber = (num) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}