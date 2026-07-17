"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { fadeUp } from "@/lib/motion";
import type { Character } from "@/types/api";

interface CharacterCardProps {
  character: Character;
}

const MAX_TILT_DEG = 5;

export function CharacterCard({ character }: CharacterCardProps) {
  const reducedMotion = useReducedMotion();

  // 3D tilt is desktop-only: touch devices fire synthetic mouse events
  // on tap, which would jolt the card. Checked after mount (SSR-safe).
  const [canTilt, setCanTilt] = useState(false);
  useEffect(() => {
    setCanTilt(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 18 });

  const handleMouseMove = (event: MouseEvent<HTMLLIElement>) => {
    if (!canTilt || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * MAX_TILT_DEG * 2);
    tiltX.set(-py * MAX_TILT_DEG * 2);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.li
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group list-none"
    >
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
