import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import {
  CollectionType,
  getCollectionUrlFromType,
  getPokeApiBaseUrl,
  getPokedexApiBaseUrl,
} from "./Collections";
import { BaseSyntheticEvent, useState } from "react";
import { IApiError, IBatchFetchResult, IPokemonResult } from "./services/api";
import api from "./services/api";

import "./App.css";

function App() {
  const [baseListUrl, setBaseListUrl] = useState<string>(getPokeApiBaseUrl);
  const [collectionType, setCollectionType] = useState<CollectionType>(
    CollectionType.Wild
  );
  const [pokemons, setPokemons] = useState<[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<
    IPokemonResult | undefined
  >(undefined);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<IApiError | undefined>(undefined);

  const onPokeClicked = async (url: string | null) => {
    if (!url) return;
    let pokemonResult = await api.fetchSinglePokemonDetail(url);
    if (api.isPokemonResult(pokemonResult)) setSelectedPokemon(pokemonResult);
    if (api.isError(pokemonResult)) setError(pokemonResult);
  };

  const onCollectionClicked = async (e: BaseSyntheticEvent) => {
    let collectionUrl = getCollectionUrlFromType(e.target.value);
    setCollectionType(e.target.value);
    setBaseListUrl(collectionUrl);
    refreshList(collectionUrl);
  };

  const onListInternalUpdate = async (offset: number, limit: number) => {
    let result = await api.fetchPokemons(baseListUrl, offset, limit);
    refreshListFromResult(result);
  };

  const refreshList = async (url: string) => {
    let result = await api.fetchPokemons(url);
    refreshListFromResult(result);
    setSelectedPokemon(undefined);
  };

  const refreshListFromResult = (result: IBatchFetchResult | IApiError) => {
    if (api.isBatchFetchResult(result)) {
      setPokemons(result.results);
      setTotal(result.total);
    }
    if (api.isError(result)) {
      setError(result.error);
      clearList();
    }
  };

  const onCatch = async () => {
    if (selectedPokemon) {
      await api.postPokemonToPokedex(getPokedexApiBaseUrl(), selectedPokemon);
    } else {
      console.error("Pokemon was not set from list before attempting to POST.");
    }
  };

  const onRelease = async () => {
    if (selectedPokemon) {
      await api.deletePokemonFromPokedex(
        getPokedexApiBaseUrl(),
        selectedPokemon.id
      );
      refreshList(baseListUrl);
    } else {
      console.error("Pokemon was not set from list before attempting to POST.");
    }
  };

  const clearList = () => {
    setPokemons([]);
    setTotal(0);
    setSelectedPokemon(undefined);
  };

  return (
    <div className="container">
      <div style={{ backgroundColor: "#301934", color: "white" }}>
        <h2>Pokemons</h2>
        <input
          type="radio"
          name="collection"
          className="form-check-input"
          value={CollectionType.Wild}
          id="wild"
          checked={collectionType === CollectionType.Wild}
          onChange={onCollectionClicked}
        />
        <label className="form-check-label" htmlFor="wild">
          Wild
        </label>
        <input
          type="radio"
          name="collection"
          className="form-check-input"
          style={{ marginLeft: "5px" }}
          value={CollectionType.Boxes}
          id="boxes"
          checked={collectionType === CollectionType.Boxes}
          onChange={onCollectionClicked}
        />
        <label className="form-check-label" htmlFor="boxes">
          Boxes
        </label>
      </div>
      <div className="row">
        <div className="col">
          <PokemonList
            pokemons={pokemons}
            totalPokemons={total}
            onPokemonSelected={onPokeClicked}
            onListInternalUpdate={onListInternalUpdate}
            collectionType={collectionType}
            error={error}
          />
        </div>
        <div className="col">
          {selectedPokemon && (
            <PokemonDisplay
              pokemon={selectedPokemon}
              collectionType={collectionType}
              onCatch={onCatch}
              onRelease={onRelease}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
