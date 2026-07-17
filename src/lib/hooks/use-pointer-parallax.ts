"use client";

import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

/**
 * Normalized cursor position (-0.5 … 0.5 from viewport center), smoothed
 * with springs. Only activates on hover-capable pointer devices and when
 * the user hasn't asked for reduced motion — on touch/reduced it stays
 * at 0 and consumers render exactly as before.
 */
export function usePointerParallax(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });
  const y = useSpring(rawY, { stiffness: 50, damping: 18 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const handleMove = (event: globalThis.MouseEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY, reducedMotion]);

  return { x, y };
}
