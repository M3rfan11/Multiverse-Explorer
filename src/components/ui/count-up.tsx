"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
}

/** Animates 0 → value once. Reduced motion renders the final value directly. */
export function CountUp({ value }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasPlayed = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (hasPlayed.current || reducedMotion) {
      el.textContent = value.toLocaleString();
      return;
    }

    hasPlayed.current = true;
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [value, reducedMotion]);

  return <span ref={ref} />;
}
