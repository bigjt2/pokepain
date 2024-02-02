const pokeApiBasuUrl =
  import.meta.env.VITE_POKE_API_URL || "https://pokeapi.co/api/v2/pokemon/";
import {
  IBatchFetchResult,
  IPokemonResult,
  IApiError,
} from "../models/ApiResults";
import axios, { AxiosError } from "axios";

//TODO: move all console.log to some kind of file logging.

const fetchPokemonsFromWild = async (
  offset?: number,
  limit?: number
): Promise<IBatchFetchResult | IApiError> => {
  try {
    const { data } = await axios.get(pokeApiBasuUrl, {
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
        `Failed to retrieve records from ${pokeApiBasuUrl}, error returned: ${e.message}`
      );
    }
    let result: IApiError = {
      error: e,
    };
    return result;
  }
};

const fetchSinglePokemonDetail = async (
  url: string
): Promise<IPokemonResult | IApiError> => {
  try {
    const { data } = await axios.get(url);
    return data as IPokemonResult;
  } catch (e: any) {
    console.log(
      `Failed to retrieve records from ${url}, error returned: ${e.message}`
    );
    let error: IApiError = {
      error: e,
    };
    return error;
  }
};

const pokeApiService = {
  fetchPokemonsFromWild,
  fetchSinglePokemonDetail,
};

export default pokeApiService;
