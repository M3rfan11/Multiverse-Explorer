import type {
  Character,
  CharacterFilters,
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

