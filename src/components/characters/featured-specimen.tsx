"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCharacterWithEpisodes } from "@/lib/hooks/use-character-with-episodes";

// Daily pick, deterministic (same for everyone, no hydration mismatch).
// Uses the detail-page query so clicking through hits a warm cache.
const DAY = Math.floor(Date.now() / 86_400_000);

export function FeaturedSpecimen({ totalCount }: { totalCount: number }) {
  const id = (DAY % totalCount) + 1;
  const { data: character, isError } = useCharacterWithEpisodes(id);

  if (isError) return null;

  return (
    <div className="w-60">
      <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
        Specimen of the day
      </p>
      {character ? (
        <Link
          href={`/character/${character.id}`}
          className="group mt-2 block rounded-card border border-white/10 bg-space-900 p-3 transition-colors hover:border-portal-500/60 hover:bg-space-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
        >
          <div className="relative aspect-square overflow-hidden rounded-sm">
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="240px"
              className="object-cover"
            />
            {character.status === "Dead" ? (
              <span
                aria-hidden
                className="absolute left-2 top-3 -rotate-12 rounded-sm border-2 border-red-400/80 bg-space-950/40 px-1.5 py-0.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-400"
              >
                Deceased
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              title={character.name}
              className="truncate font-display font-semibold text-white"
            >
              {character.name}
            </span>
            <StatusBadge status={character.status} />
          </div>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-slate-500">
            #{String(character.id).padStart(3, "0")} · {character.episodes.length} eps
          </p>
        </Link>
      ) : (
        <Skeleton className="mt-2 h-72 w-full" />
      )}
    </div>
  );
}
