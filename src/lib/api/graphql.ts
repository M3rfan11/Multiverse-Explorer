import { GraphQLClient, gql } from "graphql-request";
import type {
  CharacterGender,
  CharacterStatus,
  CharacterWithEpisodes,
} from "@/types/api";
import { ApiError } from "./client";

// GraphQL for the detail page only: character + episodes in one query
// where REST needs two round-trips. Dashboard stays on REST (see README).

export const graphqlClient = new GraphQLClient(
  "https://rickandmortyapi.com/graphql",
);

const CHARACTER_WITH_EPISODES = gql`
  query CharacterWithEpisodes($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      image
      origin {
        name
      }
      location {
        name
      }
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

/** GraphQL returns ids as strings and status/gender as plain String — narrow them. */
interface RawCharacterResponse {
  character: {
    id: string;
    name: string;
    status: string;
    species: string;
    gender: string;
    image: string;
    origin: { name: string } | null;
    location: { name: string } | null;
    episode: {
      id: string;
      name: string;
      air_date: string;
      episode: string;
    }[];
  } | null;
}

export function toStatus(raw: string): CharacterStatus {
  return raw === "Alive" || raw === "Dead" ? raw : "unknown";
}

function toGender(raw: string): CharacterGender {
  return raw === "Female" || raw === "Male" || raw === "Genderless"
    ? raw
    : "unknown";
}

export async function getCharacterWithEpisodes(
  id: number,
): Promise<CharacterWithEpisodes> {
  let data: RawCharacterResponse;
  try {
    data = await graphqlClient.request<RawCharacterResponse>(
      CHARACTER_WITH_EPISODES,
      { id },
    );
  } catch (error) {
    // The API reports a missing character as a GraphQL error "404: Not Found".
    if (error instanceof Error && error.message.includes("404")) {
      throw new ApiError(`Character ${id} not found`, 404);
    }
    throw error;
  }

  const character = data.character;
  if (!character) {
    throw new ApiError(`Character ${id} not found`, 404);
  }

  return {
    id: Number(character.id),
    name: character.name,
    status: toStatus(character.status),
    species: character.species,
    gender: toGender(character.gender),
    image: character.image,
    origin: { name: character.origin?.name ?? "unknown" },
    location: { name: character.location?.name ?? "unknown" },
    episodes: character.episode.map((episode) => ({
      id: Number(episode.id),
      name: episode.name,
      air_date: episode.air_date,
      episode: episode.episode,
    })),
  };
}
