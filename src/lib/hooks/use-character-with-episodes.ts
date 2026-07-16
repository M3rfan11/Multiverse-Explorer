import { useQuery } from "@tanstack/react-query";
import { getCharacterWithEpisodes } from "@/lib/api/graphql";
import { queryKeys } from "@/lib/api/query-keys";

export function useCharacterWithEpisodes(id: number) {
  return useQuery({
    queryKey: queryKeys.characterWithEpisodes(id),
    queryFn: () => getCharacterWithEpisodes(id),
  });
}
