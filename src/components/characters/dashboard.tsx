"use client";

import cn from "classnames";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CountUp } from "@/components/ui/count-up";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCharacters } from "@/lib/hooks/use-characters";
import {
  toCharacterFilters,
  useDashboardFilters,
} from "@/lib/hooks/use-dashboard-filters";
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
  const reducedMotion = useReducedMotion();

  // Scroll back to the top when the page changes (not on filter changes —
  // the user is already at the filter bar when filtering).
  const previousPage = useRef(filters.page);
  useEffect(() => {
    if (previousPage.current !== filters.page) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
    previousPage.current = filters.page;
  }, [filters.page, reducedMotion]);

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

      <section className="py-10 md:py-14">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          Multiverse{" "}
          <span className="bg-gradient-to-r from-portal-400 to-rick-blue bg-clip-text text-transparent">
            Explorer
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-slate-400">
          {totals ? (
            <>
              Browse{" "}
              <span className="font-semibold text-portal-300">
                <CountUp value={totals.info.count} />
              </span>{" "}
              characters across every dimension of the Rick and Morty universe.
            </>
          ) : (
            "Browse characters across every dimension of the Rick and Morty universe."
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
