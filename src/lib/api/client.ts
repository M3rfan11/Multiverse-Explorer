import type {
  Character,
  CharacterFilters,
  Episode,
  PaginatedResponse,
} from "@/types/api";

const BASE_URL = "https://rickandmortyapi.com/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | undefined>;

async function apiFetch<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      // Skip empty values so "?name=" never ends up in the request.
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

const EMPTY_PAGE: PaginatedResponse<Character> = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

/**
 * The API answers 404 when a filter combination matches nothing.
 * That's an empty result for us, not a failure — normalize it here
 * so the UI never has to know about this quirk.
 */
export async function getCharacters(
  filters: CharacterFilters,
): Promise<PaginatedResponse<Character>> {
  try {
    return await apiFetch<PaginatedResponse<Character>>("/character", {
      name: filters.name,
      status: filters.status,
      species: filters.species,
      page: filters.page,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return EMPTY_PAGE;
    }
    throw error;
  }
}

export function getCharacter(id: number): Promise<Character> {
  return apiFetch<Character>(`/character/${id}`);
}

/**
 * Batch-fetches episodes in a single request: /episode/1,2,3.
 * The API returns a bare object (not an array) when only one id
 * is requested — normalize to an array.
 */
export async function getEpisodesByUrls(
  episodeUrls: string[],
): Promise<Episode[]> {
  const ids = episodeUrls
    .map((url) => Number(url.split("/").at(-1)))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (ids.length === 0) return [];

  const data = await apiFetch<Episode | Episode[]>(`/episode/${ids.join(",")}`);
  return Array.isArray(data) ? data : [data];
}
