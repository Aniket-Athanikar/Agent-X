"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Premium FadeIn animation component using Framer Motion.
 * Triggers when the element scrolled into view.
 */
export function FadeIn({ children, className = "", delay = 0, duration = 0.8, direction = "up", distance = 40 }) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Sleek ease-out cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrap list items in this component to stagger their entrance.
 */
export function StaggerContainer({ children, className = "", delay = 0, staggerChildren = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside a StaggerContainer.
 */
export function StaggerItem({ children, className = "", duration = 0.8, direction = "up", distance = 30 }) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        show: { opacity: 1, x: 0, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
