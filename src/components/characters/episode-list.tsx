"use client";

import cn from "classnames";
import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import type { EpisodeSummary } from "@/types/api";

/**
 * Purely presentational — episodes arrive with the character in one
 * GraphQL query, so this component has no loading or error states.
 */
export function EpisodeList({ episodes }: { episodes: EpisodeSummary[] }) {
  const reducedMotion = useReducedMotion();

  const scrollable = episodes.length > 10;

  return (
    <motion.ol
      variants={staggerContainer}
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      className={cn(
        "flex flex-col gap-1 rounded-card border border-white/10 bg-space-900 p-2",
        scrollable &&
          "max-h-96 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)]",
      )}
    >
      {episodes.map((episode) => (
        <motion.li
          key={episode.id}
          variants={fadeIn}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-space-800"
        >
          <span className="shrink-0 rounded-md bg-portal-500/10 px-2 py-0.5 font-mono text-xs text-portal-300">
            {episode.episode}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
            {episode.name}
          </span>
          <span className="shrink-0 text-xs text-slate-500">
            {episode.air_date}
          </span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
