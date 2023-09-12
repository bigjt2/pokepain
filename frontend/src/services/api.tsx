import { AxiosError } from "axios";
import axios from "axios";

export interface BatchFetchResult {
  total: number;
  results: [];
  error?: any;
}

const fetchPokemons = async (url: string, offset?: number, limit?: number) => {
  try {
    const { data } = await axios.get(url, {
      params: { offset: offset, limit: limit },
    });
    let result: BatchFetchResult = {
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
    let result: BatchFetchResult = {
      total: 0,
      results: [],
      error: e,
    };
    return result;
  }
};

const api = {
  fetchPokemons: fetchPokemons,
};

export default api;
