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

export const isBatchFetchResult = (
  result: IApiResult
): result is IBatchFetchResult => {
  return "results" in result;
};

export const isPokemonResult = (
  result: IApiResult
): result is IPokemonResult => {
  return "name" in result;
};

export const isError = (result: IApiResult): result is IApiError => {
  return "error" in result;
};
