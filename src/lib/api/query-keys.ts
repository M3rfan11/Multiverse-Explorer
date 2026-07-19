import type { CharacterFilters } from "@/types/api";

// Single source of truth for cache keys — identical filters, identical key.
export const queryKeys = {
  characters: (filters: CharacterFilters) => ["characters", filters] as const,
  characterWithEpisodes: (id: number) =>
    ["character-with-episodes", id] as const,
};
