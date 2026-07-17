"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { fadeUp } from "@/lib/motion";
import type { Character } from "@/types/api";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <motion.li variants={fadeUp} className="group list-none">
      <Link
        href={`/character/${character.id}`}
        className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
      >
        <article
          className="relative overflow-hidden rounded-card border border-white/5 bg-space-900/60 backdrop-blur
            transition-all duration-300
            group-hover:-translate-y-1 group-hover:border-portal-500/40 group-hover:shadow-glow-md
            group-focus-within:-translate-y-1 group-focus-within:border-portal-500/40
            group-active:scale-[0.98] group-active:border-portal-500/40"
        >
          <span
            aria-hidden
            className="absolute inset-x-4 top-0 z-10 h-px bg-gradient-to-r from-transparent via-portal-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={character.image}
              alt={character.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:saturate-[1.25]"
            />
            <span className="absolute right-2 top-2 rounded-md bg-space-950/70 px-1.5 py-0.5 font-mono text-[10px] text-portal-300 backdrop-blur">
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
          </div>
        </article>
      </Link>
    </motion.li>
  );
}
