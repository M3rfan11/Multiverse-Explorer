import type { CharacterFilters } from "@/types/api";

/**
 * Single source of truth for React Query cache keys.
 * Identical filters produce an identical key, so navigating back to a
 * previously seen page/filter combination is an instant cache hit.
 */
export const queryKeys = {
  characters: (filters: CharacterFilters) => ["characters", filters] as const,
  character: (id: number) => ["character", id] as const,
  episodes: (episodeUrls: string[]) => ["episodes", ...episodeUrls] as const,
};
