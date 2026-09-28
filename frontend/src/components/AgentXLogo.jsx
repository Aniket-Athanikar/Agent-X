"use client";

import React, { useId } from "react";

/**
 * AgentXLogo - Official Brand Monogram (Fused A + X)
 * Precision geometric vector construction with luminous cyan-teal gradients & subtle neon aura.
 */
export default function AgentXLogo({ 
  className = "w-10 h-10", 
  size, 
  glow = true,
  ...props 
}) {
  const uniqueId = useId().replace(/:/g, "_");
  const tealGradId = `ax_teal_${uniqueId}`;
  const blueGradId = `ax_blue_${uniqueId}`;
  const centerGradId = `ax_center_${uniqueId}`;
  const apexGradId = `ax_apex_${uniqueId}`;
  const glowFilterId = `ax_glow_${uniqueId}`;

  return (
    <svg 
      viewBox="0 0 110 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Agent-X Logo"
      role="img"
      {...props}
    >
      <defs>
        {/* Left Leg Gradient: Apex Cyan into Turquoise / Emerald */}
        <linearGradient id={tealGradId} x1="40%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38f9d7" />
          <stop offset="25%" stopColor="#00f2fe" />
          <stop offset="65%" stopColor="#00c9a7" />
          <stop offset="100%" stopColor="#009e86" />
        </linearGradient>

        {/* Right Leg Gradient: Cyan into Electric/Deep Blue */}
        <linearGradient id={blueGradId} x1="30%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38f9d7" />
          <stop offset="30%" stopColor="#00d8f6" />
          <stop offset="70%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#034d75" />
        </linearGradient>

        {/* Central Fused X Gradient: Vibrant Electric Cyan */}
        <linearGradient id={centerGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#70f5ff" />
          <stop offset="45%" stopColor="#00e1ff" />
          <stop offset="80%" stopColor="#00aee8" />
          <stop offset="100%" stopColor="#0077b6" />
        </linearGradient>

        {/* Apex Top Highlight Gradient */}
        <linearGradient id={apexGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#cffafe" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>

        {/* Subtle, Crisp Neon Glow Filter */}
        {glow && (
          <filter id={glowFilterId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${glowFilterId})` : undefined}>
        {/* Top Chevron (Apex of A) */}
        <polygon 
          points="55,5 86,48.5 73,48.5 55,33.5 37,48.5 24,48.5" 
          fill={`url(#${tealGradId})`} 
        />
        
        {/* Top Apex Glint / Highlight */}
        <polygon 
          points="55,5 64,22 55,27 46,22" 
          fill={`url(#${apexGradId})`} 
          opacity="0.95" 
        />

        {/* Left Leg (Lower Left Wing of A) */}
        <polygon 
          points="22.5,52 31.5,52 24,93.5 4,93.5" 
          fill={`url(#${tealGradId})`} 
        />

        {/* Right Leg (Lower Right Wing of A) */}
        <polygon 
          points="87.5,52 78.5,52 86,93.5 106,93.5" 
          fill={`url(#${blueGradId})`} 
        />

        {/* Central Fused X Monogram */}
        <polygon 
          points="
            36,52 46.5,52 55,61.5 63.5,52 74,52 
            64,66.5 82,93.5 67,93.5 55,78 43,93.5 28,93.5 
            46,66.5
          " 
          fill={`url(#${centerGradId})`} 
        />
      </g>
    </svg>
  );
}
