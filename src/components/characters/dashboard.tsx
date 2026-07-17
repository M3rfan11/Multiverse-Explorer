"use client";

import cn from "classnames";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { CountUp } from "@/components/ui/count-up";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PortalRing } from "@/components/ui/portal-ring";
import { useCharacters } from "@/lib/hooks/use-characters";
import {
  toCharacterFilters,
  useDashboardFilters,
} from "@/lib/hooks/use-dashboard-filters";
import { usePointerParallax } from "@/lib/hooks/use-pointer-parallax";
import { CharacterGrid, CharacterGridSkeleton } from "./character-grid";
import { FilterBar } from "./filter-bar";
import { Pagination } from "./pagination";

export function Dashboard() {
  const { filters, setFilters, setPage, clearFilters } = useDashboardFilters();
  const { data, isPending, isError, isFetching, refetch } = useCharacters(
    toCharacterFilters(filters),
  );
  // Unfiltered count for the hero. Shares a cache entry with the default
  // dashboard view (identical query key), so it usually costs no request.
  const { data: totals } = useCharacters({ page: 1 });
  const { data: aliveTotals } = useCharacters({ status: "Alive", page: 1 });
  const reducedMotion = useReducedMotion();

  // The hero's portal ring drifts opposite the cursor for depth.
  const pointer = usePointerParallax();
  const ringX = useTransform(pointer.x, (v) => v * -30);
  const ringY = useTransform(pointer.y, (v) => v * -20);

  // Scroll back to the top when the page changes (not on filter changes —
  // the user is already at the filter bar when filtering).
  const previousPage = useRef(filters.page);
  useEffect(() => {
    if (previousPage.current !== filters.page) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
    previousPage.current = filters.page;
  }, [filters.page, reducedMotion]);

  // Remember the current view so the detail page's back link can
  // restore the exact filter/page state.
  useEffect(() => {
    sessionStorage.setItem("dashboard-search", window.location.search);
  }, [filters]);

  const hasActiveFilters = Boolean(
    filters.name || filters.status || filters.species,
  );

  return (
    <>
      {/* Indeterminate progress bar during background refetches */}
      {isFetching && !isPending ? (
        <div
          aria-hidden
          className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
        >
          <div className="h-full w-1/4 animate-progress bg-portal-500" />
        </div>
      ) : null}

      <section className="relative py-12 md:py-16">
        <motion.span
          style={{ x: ringX, y: ringY }}
          className="pointer-events-none absolute -right-12 -top-2 md:-right-8 md:-top-6"
        >
          <PortalRing className="size-44 opacity-10 md:size-64 lg:size-72" />
        </motion.span>
        <h1 className="font-logo text-5xl tracking-wide text-white md:text-6xl">
          Multiverse <span className="text-portal-400">Explorer</span>
        </h1>
        <p className="mt-4 max-w-xl text-slate-400">
          {totals ? (
            <>
              <span className="font-semibold text-portal-300">
                <CountUp value={totals.info.count} />
              </span>{" "}
              beings catalogued across infinite realities
              {aliveTotals
                ? `. ${aliveTotals.info.count.toLocaleString()} still alive — for now.`
                : "."}
            </>
          ) : (
            "Beings catalogued across infinite realities."
          )}
        </p>
      </section>

      <FilterBar
        filters={filters}
        resultCount={data?.info.count}
        onChange={setFilters}
        onClear={clearFilters}
      />

      <div className="mt-6">
        {isPending ? (
          <CharacterGridSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.results.length === 0 ? (
          <EmptyState
            title="No characters found in this dimension"
            description="Try a different name, or clear the filters to start over."
            actionLabel={hasActiveFilters ? "Clear filters" : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <div
            className={cn(
              "transition-opacity duration-300",
              isFetching && "opacity-60",
            )}
          >
            <CharacterGrid
              characters={data.results}
              filterKey={`${filters.name}|${filters.status ?? ""}|${filters.species}`}
            />
            <Pagination
              page={filters.page}
              totalPages={data.info.pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
