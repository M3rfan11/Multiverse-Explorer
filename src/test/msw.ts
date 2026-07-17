import { graphql, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { Character, PaginatedResponse } from "@/types/api";

export const CHARACTERS_URL = "https://rickandmortyapi.com/api/character";

export function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: "" },
    location: { name: "Citadel of Ricks", url: "" },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: ["https://rickandmortyapi.com/api/episode/1"],
    url: "",
    created: "2017-11-04T18:48:46.250Z",
    ...overrides,
  };
}

export const handlers = [
  http.get(CHARACTERS_URL, ({ request }) => {
    const url = new URL(request.url);

    // Mirror the real API: a filter miss answers 404.
    if (url.searchParams.get("name") === "nothing") {
      return HttpResponse.json(
        { error: "There is nothing here" },
        { status: 404 },
      );
    }

    const page = Number(url.searchParams.get("page") ?? "1");
    const body: PaginatedResponse<Character> = {
      info: { count: 2, pages: 2, next: null, prev: null },
      results: [
        makeCharacter({ id: page * 10, name: `Character page ${page}` }),
      ],
    };
    return HttpResponse.json(body);
  }),

  // Detail page + featured specimen (GraphQL). Raw shape mirrors the real
  // endpoint: string ids, plain-string status.
  graphql.query("CharacterWithEpisodes", ({ variables }) =>
    HttpResponse.json({
      data: {
        character: {
          id: String(variables.id),
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          gender: "Male",
          image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          origin: { name: "Earth (C-137)" },
          location: { name: "Citadel of Ricks" },
          episode: [
            { id: "1", name: "Pilot", air_date: "December 2, 2013", episode: "S01E01" },
            { id: "2", name: "Lawnmower Dog", air_date: "December 9, 2013", episode: "S01E02" },
          ],
        },
      },
    }),
  ),
];

export const server = setupServer(...handlers);
