const pokeApiBasuUrl =
  import.meta.env.VITE_POKE_API_URL || "https://pokeapi.co/api/v2/pokemon/";
const pokedexHost = import.meta.env.VITE_POKEDEX_API_HOST || "http://localhost";
const pokedexPort = import.meta.env.VITE_POKEDEX_API_PORT || "7001";

const pokedexApiBasuUrl = `${pokedexHost}:${pokedexPort}/api/pokedex/`;

export enum CollectionType {
  Wild = "WILD",
  Boxes = "BOXES",
}

export function getCollectionUrlFromType(
  collectionType: CollectionType
): string {
  switch (collectionType) {
    case CollectionType.Wild: {
      return pokeApiBasuUrl;
    }
    case CollectionType.Boxes: {
      return pokedexApiBasuUrl;
    }
    default: {
      return pokeApiBasuUrl;
    }
  }
}

export function getPokeApiBaseUrl(): string {
  console.log(pokeApiBasuUrl);
  return pokeApiBasuUrl;
}

export function getPokedexApiBaseUrl(): string {
  console.log(pokedexApiBasuUrl);
  return pokedexApiBasuUrl;
}
