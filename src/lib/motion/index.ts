import type { Variants } from "framer-motion";

/**
 * Central motion vocabulary. Components import from here and never
 * hand-roll durations/easings, so the whole app moves consistently.
 * Everything animates transform/opacity only (compositor-friendly).
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  micro: 0.15,
  standard: 0.3,
  entrance: 0.5,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.standard } },
};

/** Parent wrapper that staggers its children's `fadeUp`/`fadeIn`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const scaleEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.entrance, ease: EASE },
  },
};
