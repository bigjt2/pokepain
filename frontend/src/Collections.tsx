const pokeApiBasuUrl = "https://pokeapi.co/api/v2/pokemon/";
//TODO: environment variable
const pokedexApiBasuUrl = "http://localhost:3000/api/pokedex/";

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
  return pokeApiBasuUrl;
}

export function getPokedexApiBaseUrl(): string {
  return pokedexApiBasuUrl;
}
