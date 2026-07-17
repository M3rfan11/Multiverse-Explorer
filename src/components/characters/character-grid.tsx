"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import type { Character } from "@/types/api";
import { CharacterCard } from "./character-card";
import { CharacterCardSkeleton } from "./character-card-skeleton";

const GRID_CLASSES =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

interface CharacterGridProps {
  characters: Character[];
  /**
   * Changes when filters (not page) change, remounting the list so the
   * stagger entrance replays for a new result set but not on pagination.
   */
  filterKey: string;
}

export function CharacterGrid({ characters, filterKey }: CharacterGridProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <ul className={GRID_CLASSES}>
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            priority={index < 4}
          />
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      key={filterKey}
      className={GRID_CLASSES}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          priority={index < 4}
        />
      ))}
    </motion.ul>
  );
}

export function CharacterGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <ul className={GRID_CLASSES}>
      {Array.from({ length: count }, (_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </ul>
  );
}
