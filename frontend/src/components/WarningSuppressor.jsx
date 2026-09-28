"use client";

import { useEffect } from "react";

export default function WarningSuppressor() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (typeof args[0] === "string") {
          // Suppress deprecated THREE.Clock warning coming from @react-three/fiber
          if (args[0].includes("THREE.Clock: This module has been deprecated")) return;
          // Suppress internal WebGL/DirectX double precision driver warnings
          if (args[0].includes("THREE.WebGLProgram: Program Info Log") && args[0].includes("cannot be represented accurately in double precision")) return;
        }
        originalWarn(...args);
      };
    }
  }, []);
  
  return null;
}
