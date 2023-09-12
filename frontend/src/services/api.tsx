import { AxiosError } from "axios";
import axios from "axios";

interface IApiResult {}

export interface IBatchFetchResult extends IApiResult {
  total: number;
  results: [];
}

export interface IPokemonResult extends IApiResult {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
  types: any[];
  stats: any[];
  moves: any[];
  abilities: any[];
}

export interface IApiError extends IApiResult {
  error: any;
}

const isBatchFetchResult = (
  result: IApiResult
): result is IBatchFetchResult => {
  return "results" in result;
};

const isPokemonResult = (result: IApiResult): result is IPokemonResult => {
  return "name" in result;
};

const isError = (result: IApiResult): result is IApiError => {
  return "error" in result;
};

const fetchPokemons = async (
  url: string,
  offset?: number,
  limit?: number
): Promise<IBatchFetchResult | IApiError> => {
  try {
    const { data } = await axios.get(url, {
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
        //TODO: move to file logging.
        `Failed to retrieve records from ${url}, error returned: ${e.message}`
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
      //TODO: move to file logging.
      `Failed to retrieve records from ${url}, error returned: ${e.message}`
    );
    let error: IApiError = {
      error: e,
    };
    return error;
  }
};

const postPokemonToPokedex = async (url: string, pokemon: IPokemonResult) => {
  try {
    const result = await axios.post(url, pokemon);
    console.log(result);
  } catch (e: any) {
    //TODO: move to file logging.
    console.log(`${e.message}`);
  }
};

const deletePokemonFromPokedex = async (url: string, pokemonId: number) => {
  try {
    const result = await axios.delete(`${url}/${pokemonId}`);
    console.log(result);
  } catch (e: any) {
    //TODO: move to file logging.
    console.log(`${e.message}`);
  }
};

const api = {
  fetchPokemons: fetchPokemons,
  fetchSinglePokemonDetail: fetchSinglePokemonDetail,
  postPokemonToPokedex: postPokemonToPokedex,
  deletePokemonFromPokedex: deletePokemonFromPokedex,
  isBatchFetchResult: isBatchFetchResult,
  isPokemonResult: isPokemonResult,
  isError: isError,
};

export default api;
