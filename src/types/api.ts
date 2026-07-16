/**
 * Types mirror the REST API payloads exactly
 * (verified against live responses from rickandmortyapi.com).
 * The API capitalizes "Alive"/"Dead" but lowercases "unknown".
 */

export type CharacterStatus = "Alive" | "Dead" | "unknown";

export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

export interface LocationRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  /** Sub-species, often an empty string. */
  type: string;
  gender: CharacterGender;
  origin: LocationRef;
  location: LocationRef;
  image: string;
  /** URLs of the episodes this character appears in. */
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  /** Episode code, e.g. "S01E01". */
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  /** URLs of characters last seen at this location. */
  residents: string[];
  url: string;
  created: string;
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  info: PaginationInfo;
  results: T[];
}

/** The filters our dashboard supports. All optional; page defaults to 1. */
export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  page?: number;
}

/** Episode fields the detail page needs (GraphQL lets us ask for exactly these). */
export interface EpisodeSummary {
  id: number;
  name: string;
  air_date: string;
  /** Episode code, e.g. "S01E01". */
  episode: string;
}

/** Detail-page shape: character plus its episodes from one GraphQL query. */
export interface CharacterWithEpisodes {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  gender: CharacterGender;
  image: string;
  origin: { name: string };
  location: { name: string };
  episodes: EpisodeSummary[];
}
