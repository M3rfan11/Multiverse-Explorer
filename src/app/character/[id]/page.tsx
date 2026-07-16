import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CharacterDetail } from "@/components/characters/character-detail";
import { ApiError } from "@/lib/api/client";
import { getCharacterWithEpisodes } from "@/lib/api/graphql";
import { queryKeys } from "@/lib/api/query-keys";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// GraphQL requests are POSTs, which Next's fetch memoization doesn't dedupe.
// React's cache() does the same job: generateMetadata and the page prefetch
// below share one request per render.
const getCharacterCached = cache(getCharacterWithEpisodes);

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const characterId = parseId(id);
  if (!characterId) return { title: "Not found · Multiverse Explorer" };

  try {
    const character = await getCharacterCached(characterId);
    return {
      title: `${character.name} · Multiverse Explorer`,
      description: `${character.name} — ${character.status} ${character.species} from ${character.origin.name}.`,
    };
  } catch {
    return { title: "Not found · Multiverse Explorer" };
  }
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const characterId = parseId(id);
  if (!characterId) notFound();

  // Prefetch on the server so the character arrives as HTML —
  // the client's useCharacterWithEpisodes(id) hydrates from this cache.
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: queryKeys.characterWithEpisodes(characterId),
      queryFn: () => getCharacterCached(characterId),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-8">
        <CharacterDetail id={characterId} />
      </main>
    </HydrationBoundary>
  );
}
