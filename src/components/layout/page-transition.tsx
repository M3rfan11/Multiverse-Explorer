"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

// Route entrance, mounted via app/template.tsx (templates remount per
// navigation). No exit animations on purpose — the App Router unmounts
// the old page immediately and the workarounds are fragile. See README.
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
