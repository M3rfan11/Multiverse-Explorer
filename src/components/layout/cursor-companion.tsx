"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * UFO cursor. Original SVG (not show art). Fine pointers only,
 * disabled under prefers-reduced-motion — see globals.css for the
 * cursor:none gating.
 */
export function CursorCompanion() {
  const [active, setActive] = useState(false);
  const hasActivated = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  // stiff enough to aim with, since this replaces the real cursor
  const x = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.5 });

  const velocityX = useVelocity(x);
  const rotate = useTransform(velocityX, [-1500, 1500], [-16, 16], {
    clamp: true,
  });

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reducedMotion) return;

    const handleMove = (event: globalThis.MouseEvent) => {
      if (!hasActivated.current) {
        hasActivated.current = true;
        setActive(true);
        // Hiding the native cursor is gated on this class, so it only
        // ever applies when the replacement is actually rendering.
        document.documentElement.classList.add("cursor-companion");
      }
      // Center the ship on the real pointer so aiming stays accurate.
      mouseX.set(event.clientX - 20);
      mouseY.set(event.clientY - 15);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("cursor-companion");
    };
  }, [mouseX, mouseY]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, rotate }}
      className="pointer-events-none fixed left-0 top-0 z-50"
    >
      {/* Subtle idle bob — small, since the ship is now the aim point */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="40" height="30" viewBox="0 0 64 48" fill="none">
          {/* tractor-beam glow */}
          <ellipse cx="32" cy="40" rx="13" ry="4" fill="rgb(74 222 128 / 0.3)" />
          {/* glass dome */}
          <ellipse
            cx="32"
            cy="16"
            rx="11"
            ry="9"
            fill="rgb(125 211 252 / 0.4)"
            stroke="rgb(186 230 253 / 0.7)"
            strokeWidth="1.5"
          />
          {/* saucer body */}
          <ellipse
            cx="32"
            cy="26"
            rx="23"
            ry="8"
            fill="#CBD5E1"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          {/* running lights */}
          <circle cx="14" cy="26" r="1.8" fill="#4ADE80" />
          <circle cx="23" cy="29" r="1.8" fill="#4ADE80" />
          <circle cx="32" cy="30" r="1.8" fill="#4ADE80" />
          <circle cx="41" cy="29" r="1.8" fill="#4ADE80" />
          <circle cx="50" cy="26" r="1.8" fill="#4ADE80" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
