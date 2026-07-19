import { ClientError } from "graphql-request";
import { unstable_cache } from "next/cache";
import type { AnalyticsResponse } from "@/types/analytics";
import { graphqlClient, toStatus } from "./graphql";

// Server-only analytics. The dataset is ~52 REST pages and bursts that
// size get 429'd by the API's Cloudflare (worst from shared serverless
// IPs). GraphQL aliases collapse each resource's pages into one query,
// so the whole aggregation is 4 requests, cached for an hour below.

const REVALIDATE_SECONDS = 3600;
const RETRY_AFTER_429_MS = 2500;
const TOP_SPECIES = 9;
const TOP_CHARACTERS = 10;
const TOP_LOCATIONS = 8;

interface RawCharacter {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  origin: { name: string } | null;
  location: { name: string } | null;
  episode: { id: string }[];
}

interface RawLocation {
  id: string;
  name: string;
  type: string;
  dimension: string;
  residents: { id: string }[];
}

interface RawEpisode {
  id: string;
  name: string;
  episode: string;
  air_date: string;
  characters: { id: string }[];
}

interface PageInfoResponse {
  characters: { info: { pages: number } };
  locations: { info: { pages: number } };
  episodes: { info: { pages: number } };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimited(error: unknown): boolean {
  return error instanceof ClientError && error.response.status === 429;
}

async function request<T>(query: string, attempt = 1): Promise<T> {
  try {
    return await graphqlClient.request<T>(query);
  } catch (error) {
    if (isRateLimited(error) && attempt === 1) {
      await sleep(RETRY_AFTER_429_MS);
      return request<T>(query, attempt + 1);
    }
    throw error;
  }
}

/** Builds `p1: resource(page: 1) { results { ...fields } } p2: ...` */
function allPagesQuery(
  resource: "characters" | "locations" | "episodes",
  pages: number,
  fields: string,
): string {
  const aliases = Array.from(
    { length: pages },
    (_, i) => `p${i + 1}: ${resource}(page: ${i + 1}) { results { ${fields} } }`,
  );
  return `query { ${aliases.join(" ")} }`;
}

async function fetchAll<T>(
  resource: "characters" | "locations" | "episodes",
  pages: number,
  fields: string,
): Promise<T[]> {
  const data = await request<Record<string, { results: T[] }>>(
    allPagesQuery(resource, pages, fields),
  );
  return Object.values(data).flatMap((page) => page.results);
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

async function computeAnalytics(): Promise<AnalyticsResponse> {
  const info = await request<PageInfoResponse>(
    `query { characters { info { pages } } locations { info { pages } } episodes { info { pages } } }`,
  );

  const characters = await fetchAll<RawCharacter>(
    "characters",
    info.characters.info.pages,
    "id name image status species origin { name } location { name } episode { id }",
  );
  const locations = await fetchAll<RawLocation>(
    "locations",
    info.locations.info.pages,
    "id name type dimension residents { id }",
  );
  const episodes = await fetchAll<RawEpisode>(
    "episodes",
    info.episodes.info.pages,
    "id name episode air_date characters { id }",
  );

  const alive = characters.filter((c) => toStatus(c.status) === "Alive").length;
  const dead = characters.filter((c) => toStatus(c.status) === "Dead").length;

  // "Travellers": last-known location differs from origin.
  // Unknown origins/locations are excluded — we can't claim movement
  // we can't observe.
  const travellers = characters.filter((c) => {
    const origin = c.origin?.name ?? "unknown";
    const location = c.location?.name ?? "unknown";
    return origin !== "unknown" && location !== "unknown" && origin !== location;
  }).length;

  const speciesCounts = [...countBy(characters, (c) => c.species)].sort(
    (a, b) => b[1] - a[1],
  );
  const topSpecies = speciesCounts
    .slice(0, TOP_SPECIES)
    .map(([species, count]) => ({ species, count }));
  const otherCount = speciesCounts
    .slice(TOP_SPECIES)
    .reduce((sum, [, count]) => sum + count, 0);
  if (otherCount > 0) topSpecies.push({ species: "Other", count: otherCount });

  return {
    totals: {
      characters: characters.length,
      alive,
      dead,
      locations: locations.length,
      episodes: episodes.length,
      species: speciesCounts.length,
      dimensions: countBy(locations, (l) => l.dimension).size,
      travellers,
    },
    charactersByStatus: (["Alive", "Dead", "unknown"] as const).map(
      (status) => ({
        status,
        count: characters.filter((c) => toStatus(c.status) === status).length,
      }),
    ),
    topSpecies,
    episodeCastSizes: episodes.map((episode) => ({
      code: episode.episode,
      name: episode.name,
      characterCount: episode.characters.length,
    })),
    topCharacters: [...characters]
      .sort((a, b) => b.episode.length - a.episode.length)
      .slice(0, TOP_CHARACTERS)
      .map((c) => ({
        id: Number(c.id),
        name: c.name,
        image: c.image,
        appearances: c.episode.length,
      })),
    topLocations: [...locations]
      .sort((a, b) => b.residents.length - a.residents.length)
      .slice(0, TOP_LOCATIONS)
      .map((l) => ({
        id: Number(l.id),
        name: l.name,
        type: l.type,
        dimension: l.dimension,
        residents: l.residents.length,
      })),
  };
}

/**
 * The computed result itself is cached for an hour, so the aggregation
 * runs at most once per revalidation window — not once per page view.
 */
export const getAnalytics = unstable_cache(
  computeAnalytics,
  ["multiverse-analytics"],
  { revalidate: REVALIDATE_SECONDS },
);
