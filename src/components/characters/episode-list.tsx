"use client";

import cn from "classnames";
import { motion, useReducedMotion } from "framer-motion";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useEpisodes } from "@/lib/hooks/use-episodes";
import { fadeIn, staggerContainer } from "@/lib/motion";

export function EpisodeList({ episodeUrls }: { episodeUrls: string[] }) {
  const { data: episodes, isPending, isError, refetch } =
    useEpisodes(episodeUrls);
  const reducedMotion = useReducedMotion();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: Math.min(episodeUrls.length, 6) }, (_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load episodes"
        description="The episode list failed to fetch."
        onRetry={() => refetch()}
      />
    );
  }

  const scrollable = episodes.length > 10;

  return (
    <motion.ol
      variants={staggerContainer}
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      className={cn(
        "flex flex-col gap-1 rounded-card border border-white/5 bg-space-900/40 p-2",
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
