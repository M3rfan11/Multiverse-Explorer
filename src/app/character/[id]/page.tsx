import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterDetail } from "@/components/characters/character-detail";
import { ApiError, getCharacter } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

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
    // Next.js memoizes identical GET fetches within one request,
    // so this shares the response with the page prefetch below.
    const character = await getCharacter(characterId);
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
  // the client's useCharacter(id) hydrates from this cache, no refetch.
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: queryKeys.character(characterId),
      queryFn: () => getCharacter(characterId),
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
