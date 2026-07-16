"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Entrance animation for route changes, mounted via app/template.tsx
 * (a template remounts on every navigation, unlike a layout).
 *
 * Deliberate trade-off: exit animations are skipped. The App Router
 * unmounts the outgoing page immediately, and the workarounds (freezing
 * router context) are fragile. A clean entrance is worth more than a
 * hacky exit.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
