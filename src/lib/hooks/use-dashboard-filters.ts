"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { CharacterFilters, CharacterStatus } from "@/types/api";

/**
 * The URL is the single source of truth for dashboard state.
 * `?name=rick&status=alive&page=2` is shareable, survives refresh,
 * and works with the back button. Components never hold filter state.
 */

export const SPECIES_OPTIONS = [
  "Human",
  "Alien",
  "Humanoid",
  "Robot",
  "Animal",
  "Mythological Creature",
  "unknown",
] as const;

const STATUS_FROM_PARAM: Partial<Record<string, CharacterStatus>> = {
  alive: "Alive",
  dead: "Dead",
  unknown: "unknown",
};

export interface DashboardFilters {
  name: string;
  status: CharacterStatus | undefined;
  species: string;
  page: number;
}

/** Parse + sanitize: garbage params (status=banana, page=-1) fall back to defaults. */
function parseFilters(params: URLSearchParams): DashboardFilters {
  const rawPage = Number(params.get("page") ?? "1");
  const rawSpecies = params.get("species") ?? "";

  return {
    name: params.get("name") ?? "",
    status: STATUS_FROM_PARAM[params.get("status")?.toLowerCase() ?? ""],
    species: (SPECIES_OPTIONS as readonly string[]).includes(rawSpecies)
      ? rawSpecies
      : "",
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
  };
}

/** Map dashboard state to the API client's filter shape. */
export function toCharacterFilters(filters: DashboardFilters): CharacterFilters {
  return {
    name: filters.name || undefined,
    status: filters.status,
    species: filters.species || undefined,
    page: filters.page,
  };
}

export function useDashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const navigate = useCallback(
    (next: DashboardFilters, mode: "replace" | "push") => {
      const params = new URLSearchParams();
      if (next.name) params.set("name", next.name);
      if (next.status) params.set("status", next.status.toLowerCase());
      if (next.species) params.set("species", next.species);
      if (next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      // replace: typing/filtering shouldn't spam history.
      // push: page changes are deliberate steps the back button should undo.
      if (mode === "push") {
        router.push(url, { scroll: false });
      } else {
        router.replace(url, { scroll: false });
      }
    },
    [pathname, router],
  );

  const setFilters = useCallback(
    (update: Partial<Omit<DashboardFilters, "page">>) => {
      // Any filter change resets to page 1 — page 7 of a new search doesn't exist.
      navigate({ ...filters, ...update, page: 1 }, "replace");
    },
    [filters, navigate],
  );

  const setPage = useCallback(
    (page: number) => navigate({ ...filters, page }, "push"),
    [filters, navigate],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, setFilters, setPage, clearFilters };
}
