import api from "./api";
import {
  IBatchFetchResult,
  IPokemonResult,
  IApiError,
} from "../models/ApiResults";
import { AxiosError } from "axios";

//TODO: move all console.log to some kind of file logging.

const pokedexEndpoint = "/api/pokedex/";

const fetchPokemonsFromPokedex = async (
  offset?: number,
  limit?: number
): Promise<IBatchFetchResult | IApiError> => {
  try {
    const { data } = await api.get(pokedexEndpoint, {
      params: { offset: offset, limit: limit },
    });
    let result: IBatchFetchResult = {
      total: data.count,
      results: data.results,
    };
    return result;
  } catch (e: any) {
    if (e instanceof AxiosError) {
      console.log(
        `Failed to retrieve records from ${pokedexEndpoint}, error returned: ${e.message}`
      );
    }
    let result: IApiError = {
      error: e,
    };
    return result;
  }
};

const fetchPokedexEntry = async (
  url: string
): Promise<IPokemonResult | IApiError> => {
  try {
    const { data } = await api.get(url);
    return data as IPokemonResult;
  } catch (e: any) {
    console.log(
      //TODO: move to file logging.
      `Failed to retrieve records from ${url}, error returned: ${e.message}`
    );
    let error: IApiError = {
      error: e,
    };
    return error;
  }
};

const postPokemonToPokedex = async (
  pokemon: IPokemonResult
): Promise<number | any> => {
  try {
    const result = await api.post(pokedexEndpoint, pokemon);
    return result.status;
  } catch (e: any) {
    if (e.response?.status) return e.response.status;
    console.log(`${e.message}`);
    return e;
  }
};

const deletePokemonFromPokedex = async (
  pokemonId: number
): Promise<number | any> => {
  try {
    const result = await api.delete(`${pokedexEndpoint}/${pokemonId}`);
    return result.status;
  } catch (e: any) {
    if (e.response?.status) return e.response.status;
    console.log(`${e.message}`);
    return e;
  }
};

const pokedexService = {
  fetchPokemonsFromPokedex,
  fetchPokedexEntry,
  postPokemonToPokedex,
  deletePokemonFromPokedex,
};

export default pokedexService;
