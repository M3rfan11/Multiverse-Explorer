"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { AnalyticsResponse } from "@/types/analytics";
import { CastSizeTimeline, SpeciesBars, StatusDoughnut } from "./charts";

export function InsightsDashboard({
  analytics,
}: {
  analytics: AnalyticsResponse;
}) {
  const reducedMotion = useReducedMotion();
  const { totals } = analytics;

  const kpis: { label: string; value: number; hint?: string }[] = [
    { label: "Characters", value: totals.characters },
    {
      label: "Alive",
      value: totals.alive,
      hint: `${Math.round((totals.alive / totals.characters) * 100)}% of all`,
    },
    { label: "Dead", value: totals.dead },
    { label: "Locations", value: totals.locations },
    { label: "Episodes", value: totals.episodes },
    { label: "Species", value: totals.species },
    { label: "Dimensions", value: totals.dimensions },
    {
      label: "Travellers",
      value: totals.travellers,
      hint: "moved from their origin",
    },
  ];

  const maxAppearances = analytics.topCharacters[0]?.appearances ?? 1;
  const maxResidents = analytics.topLocations[0]?.residents ?? 1;

  // Top of the page animates on mount; chart sections reveal on scroll.
  const reveal = reducedMotion
    ? {}
    : {
        variants: fadeUp,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-60px" },
      };

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.section variants={fadeUp} className="py-12 md:py-16">
        <p className="font-mono text-xs tracking-[0.35em] text-portal-400">
          MULTIVERSE ANALYTICS
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
          Multiverse{" "}
          <span className="animate-sheen bg-[linear-gradient(90deg,#4ADE80,#38BDF8,#4ADE80)] bg-[length:200%_auto] bg-clip-text text-transparent">
            Insights
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-slate-400">
          Who exists in the multiverse, where they move, and how often they
          appear.
        </p>
      </motion.section>

      <motion.section
        variants={fadeUp}
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {kpi.label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              <CountUp value={kpi.value} />
            </p>
            {kpi.hint ? (
              <p className="mt-0.5 text-xs text-slate-500">{kpi.hint}</p>
            ) : null}
          </Card>
        ))}
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section {...reveal}>
          <Card className="h-full p-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Character status
            </h2>
            <div className="mt-3">
              <StatusDoughnut data={analytics.charactersByStatus} />
            </div>
          </Card>
        </motion.section>

        <motion.section {...reveal}>
          <Card className="h-full p-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Species
            </h2>
            <div className="mt-4">
              <SpeciesBars data={analytics.topSpecies} />
            </div>
          </Card>
        </motion.section>
      </div>

      <motion.section {...reveal}>
        <Card className="p-5">
          <h2 className="font-display text-lg font-semibold text-white">
            Cast size per episode
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Characters appearing in each episode, in airing order.
          </p>
          <div className="mt-3">
            <CastSizeTimeline data={analytics.episodeCastSizes} />
          </div>
        </Card>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section {...reveal}>
          <Card className="h-full p-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Appearance leaderboard
            </h2>
            <ol className="mt-4 flex flex-col gap-2">
              {analytics.topCharacters.map((character, index) => (
                <li key={character.id}>
                  <Link
                    href={`/character/${character.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-space-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
                  >
                    <span className="w-5 text-right font-mono text-xs text-slate-500">
                      {index + 1}
                    </span>
                    <Image
                      src={character.image}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                      {character.name}
                    </span>
                    <span
                      aria-hidden
                      className="h-1.5 rounded-full bg-portal-500/60"
                      style={{
                        width: `${(character.appearances / maxAppearances) * 96}px`,
                      }}
                    />
                    <span className="w-8 text-right font-mono text-xs text-portal-300">
                      {character.appearances}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Card>
        </motion.section>

        <motion.section {...reveal}>
          <Card className="h-full p-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Most populated locations
            </h2>
            <ol className="mt-4 flex flex-col gap-2">
              {analytics.topLocations.map((location) => (
                <li
                  key={location.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">
                      {location.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {location.type} · {location.dimension}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="h-1.5 rounded-full bg-rick-blue/60"
                    style={{
                      width: `${(location.residents / maxResidents) * 96}px`,
                    }}
                  />
                  <span className="w-8 text-right font-mono text-xs text-sky-300">
                    {location.residents}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}
