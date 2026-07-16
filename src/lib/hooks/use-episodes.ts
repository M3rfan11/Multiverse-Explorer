import { useQuery } from "@tanstack/react-query";
import { getEpisodesByUrls } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

export function useEpisodes(episodeUrls: string[]) {
  return useQuery({
    queryKey: queryKeys.episodes(episodeUrls),
    queryFn: () => getEpisodesByUrls(episodeUrls),
    // Nothing to fetch until we know which episodes we need.
    enabled: episodeUrls.length > 0,
  });
}
