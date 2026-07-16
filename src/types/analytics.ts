import type { CharacterStatus } from "./api";

/**
 * The single aggregated payload the insights page renders from.
 * Computed server-side so the client never sees the ~52 paginated
 * requests behind it.
 */
export interface AnalyticsResponse {
  totals: {
    characters: number;
    alive: number;
    dead: number;
    locations: number;
    episodes: number;
    species: number;
    dimensions: number;
    /** Characters whose last-known location differs from their origin. */
    travellers: number;
  };
  charactersByStatus: { status: CharacterStatus; count: number }[];
  /** Top species by character count; the tail is folded into "Other". */
  topSpecies: { species: string; count: number }[];
  /** In airing order. */
  episodeCastSizes: { code: string; name: string; characterCount: number }[];
  topCharacters: {
    id: number;
    name: string;
    image: string;
    appearances: number;
  }[];
  topLocations: {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: number;
  }[];
}
