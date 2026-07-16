import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCharacters } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { CharacterFilters } from "@/types/api";

export function useCharacters(filters: CharacterFilters) {
  return useQuery({
    queryKey: queryKeys.characters(filters),
    queryFn: () => getCharacters(filters),
    // Keep showing the current page while the next one loads,
    // so pagination never flashes a skeleton grid.
    placeholderData: keepPreviousData,
  });
}
