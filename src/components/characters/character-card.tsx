"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { fadeUp } from "@/lib/motion";
import type { Character } from "@/types/api";

interface CharacterCardProps {
  character: Character;
  /** Eagerly load above-the-fold images (first row) — helps mobile LCP. */
  priority?: boolean;
}

export function CharacterCard({ character, priority = false }: CharacterCardProps) {
  return (
    <motion.li variants={fadeUp} className="group list-none">
      <Link
        href={`/character/${character.id}`}
        className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
      >
        <article
          className="relative overflow-hidden rounded-card border border-white/10 bg-space-900
            transition-colors duration-150
            group-hover:border-portal-500/60 group-hover:bg-space-800
            group-focus-within:border-portal-500/60
            group-active:bg-space-800"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={character.image}
              alt={character.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
            <span className="absolute right-2 top-2 rounded-sm bg-space-950/80 px-1.5 py-0.5 font-mono text-[10px] text-portal-300">
              #{String(character.id).padStart(3, "0")}
            </span>
          </div>
          <div className="p-4">
            <h3
              title={character.name}
              className="truncate font-display font-semibold text-white"
            >
              {character.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-slate-400">
              {character.species}
            </p>
            <div className="mt-3">
              <StatusBadge status={character.status} />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-white/10 pt-2 font-mono text-[11px] uppercase tracking-wide text-slate-500">
              <span className="shrink-0">{character.episode.length} eps</span>
              <span
                title={character.location.name}
                className="truncate text-right"
              >
                {character.location.name}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.li>
  );
}
