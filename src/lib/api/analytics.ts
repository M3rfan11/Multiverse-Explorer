import { unstable_cache } from "next/cache";
import type {
  Character,
  Episode,
  Location,
  PaginatedResponse,
} from "@/types/api";
import type { AnalyticsResponse } from "@/types/analytics";

/**
 * Server-only analytics service. The full dataset spans ~52 paginated
 * REST requests (42 character + 7 location + 3 episode pages); each is
 * fetched with a 1-hour cache (`next.revalidate`), so after the first
 * render the whole page is served from cached data. The client receives
 * one aggregated payload and never talks to the API itself.
 */

const BASE_URL = "https://rickandmortyapi.com/api";
const REVALIDATE_SECONDS = 3600;
/** The API sits behind Cloudflare rate limiting — fetch in small waves, not one burst. */
const PAGE_CONCURRENCY = 4;
const WAVE_DELAY_MS = 250;
const RETRY_AFTER_429_MS = 2500;
const TOP_SPECIES = 9;
const TOP_CHARACTERS = 10;
const TOP_LOCATIONS = 8;

type Resource = "character" | "location" | "episode";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage<T>(
  resource: Resource,
  page: number,
  attempt = 1,
): Promise<PaginatedResponse<T>> {
  const response = await fetch(`${BASE_URL}/${resource}?page=${page}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  // Rate-limited: back off once before giving up.
  if (response.status === 429 && attempt === 1) {
    await sleep(RETRY_AFTER_429_MS);
    return fetchPage<T>(resource, page, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${resource} page ${page} (${response.status})`,
    );
  }
  return response.json() as Promise<PaginatedResponse<T>>;
}

async function fetchAll<T>(resource: Resource): Promise<T[]> {
  const first = await fetchPage<T>(resource, 1);
  const remaining = Array.from(
    { length: first.info.pages - 1 },
    (_, i) => i + 2,
  );

  const results: T[] = [...first.results];
  for (let i = 0; i < remaining.length; i += PAGE_CONCURRENCY) {
    const wave = remaining.slice(i, i + PAGE_CONCURRENCY);
    const pages = await Promise.all(
      wave.map((page) => fetchPage<T>(resource, page)),
    );
    results.push(...pages.flatMap((page) => page.results));
    if (i + PAGE_CONCURRENCY < remaining.length) await sleep(WAVE_DELAY_MS);
  }
  return results;
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
  // Sequential per resource (each already fetches in waves) to stay
  // well under the API's rate limit.
  const characters = await fetchAll<Character>("character");
  const locations = await fetchAll<Location>("location");
  const episodes = await fetchAll<Episode>("episode");

  const alive = characters.filter((c) => c.status === "Alive").length;
  const dead = characters.filter((c) => c.status === "Dead").length;

  // "Travellers": last-known location differs from origin.
  // Unknown origins/locations are excluded — we can't claim movement
  // we can't observe.
  const travellers = characters.filter(
    (c) =>
      c.origin.name !== "unknown" &&
      c.location.name !== "unknown" &&
      c.origin.name !== c.location.name,
  ).length;

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
        count: characters.filter((c) => c.status === status).length,
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
        id: c.id,
        name: c.name,
        image: c.image,
        appearances: c.episode.length,
      })),
    topLocations: [...locations]
      .sort((a, b) => b.residents.length - a.residents.length)
      .slice(0, TOP_LOCATIONS)
      .map((l) => ({
        id: l.id,
        name: l.name,
        type: l.type,
        dimension: l.dimension,
        residents: l.residents.length,
      })),
  };
}

/**
 * The computed result itself is cached for an hour, so the ~52-request
 * aggregation runs at most once per revalidation window — not once per
 * page view.
 */
export const getAnalytics = unstable_cache(
  computeAnalytics,
  ["multiverse-analytics"],
  { revalidate: REVALIDATE_SECONDS },
);
