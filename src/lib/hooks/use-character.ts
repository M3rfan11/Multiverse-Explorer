import { useQuery } from "@tanstack/react-query";
import { getCharacter } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

export function useCharacter(id: number) {
  return useQuery({
    queryKey: queryKeys.character(id),
    queryFn: () => getCharacter(id),
  });
}
