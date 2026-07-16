"use client";

import cn from "classnames";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCharacter } from "@/lib/hooks/use-character";
import { fadeUp, scaleEntrance, staggerContainer } from "@/lib/motion";
import type { Character } from "@/types/api";
import { EpisodeList } from "./episode-list";

export function CharacterDetail({ id }: { id: number }) {
  const { data: character, isPending, isError, refetch } = useCharacter(id);

  // The dashboard saves its query string on every filter change, so
  // "back" returns to the exact filtered/paged view. Set after mount
  // to avoid a server/client hydration mismatch.
  const [backHref, setBackHref] = useState("/");
  useEffect(() => {
    const saved = sessionStorage.getItem("dashboard-search");
    if (saved) setBackHref(`/${saved}`);
  }, []);

  if (isPending) return <DetailSkeleton />;
  if (isError || !character) return <ErrorState onRetry={() => refetch()} />;

  return (
    <>
      <Link
        href={backHref}
        className="mt-6 inline-flex items-center gap-1.5 rounded-md text-sm text-slate-400 transition-colors hover:text-portal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
      >
        ← All characters
      </Link>

      <DetailHero character={character} />

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-white">
          Episodes{" "}
          <span className="text-slate-500">({character.episode.length})</span>
        </h2>
        <div className="mt-4">
          <EpisodeList episodeUrls={character.episode} />
        </div>
      </section>
    </>
  );
}

function DetailHero({ character }: { character: Character }) {
  const reducedMotion = useReducedMotion();

  const meta: { label: string; value: string }[] = [
    { label: "Species", value: character.species },
    { label: "Gender", value: character.gender },
    { label: "Origin", value: character.origin.name },
    { label: "Last known location", value: character.location.name },
  ];

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[320px,1fr]">
      <motion.div
        variants={scaleEntrance}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        className="relative aspect-square overflow-hidden rounded-card ring-1 ring-portal-500/30"
      >
        <Image
          src={character.image}
          alt={character.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            {character.name}
          </h1>
          <StatusBadge status={character.status} size="md" />
        </motion.div>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {meta.map((item) => (
            <motion.div key={item.label} variants={fadeUp}>
              <dt className="text-xs uppercase tracking-wide text-slate-500">
                {item.label}
              </dt>
              <dd
                className={cn(
                  "mt-1 text-sm",
                  item.value === "unknown"
                    ? "italic text-slate-500"
                    : "text-slate-200",
                )}
              >
                {item.value === "unknown" ? "Unknown" : item.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-14 grid gap-8 md:grid-cols-[320px,1fr]">
      <Skeleton className="aspect-square w-full rounded-card" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </div>
  );
}
