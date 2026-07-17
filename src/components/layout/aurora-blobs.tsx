"use client";

import { motion, useTransform } from "framer-motion";
import { usePointerParallax } from "@/lib/hooks/use-pointer-parallax";

/**
 * The two background glow blobs, drifting a few pixels opposite the
 * cursor. Parallax lives on the outer wrapper; the inner div keeps the
 * CSS aurora animation — they'd fight over `transform` on one element.
 */
export function AuroraBlobs() {
  const pointer = usePointerParallax();
  const greenX = useTransform(pointer.x, (v) => v * -36);
  const greenY = useTransform(pointer.y, (v) => v * -24);
  const blueX = useTransform(pointer.x, (v) => v * 28);
  const blueY = useTransform(pointer.y, (v) => v * 20);

  return (
    <>
      <motion.div
        style={{ x: greenX, y: greenY }}
        className="absolute -top-40 left-1/4 size-[480px]"
      >
        <div className="size-full animate-aurora rounded-full bg-portal-500/10 blur-3xl" />
      </motion.div>
      <motion.div
        style={{ x: blueX, y: blueY }}
        className="absolute right-1/5 top-32 size-[420px]"
      >
        <div className="size-full animate-aurora-slow rounded-full bg-rick-blue/10 blur-3xl" />
      </motion.div>
    </>
  );
}
