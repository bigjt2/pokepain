import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import CollectionMenu from "./components/CollectionMenu";
import { Alert } from "./components/Alert";
import {
  CollectionType,
  getCollectionUrlFromType,
  getPokeApiBaseUrl,
  getPokedexApiBaseUrl,
} from "./Collections";
import { BaseSyntheticEvent, useState, useRef } from "react";
import { IApiError, IBatchFetchResult, IPokemonResult } from "./services/api";
import api from "./services/api";
import { capitalize } from "./utils";

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

  const alertRef = useRef<any>();

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
      let result = await api.postPokemonToPokedex(
        getPokedexApiBaseUrl(),
        selectedPokemon
      );
      if (typeof result === "number") {
        switch (result) {
          case 201:
            alertRef.current.showAlert(
              `Gotcha ${capitalize(selectedPokemon.name)}!`,
              "success"
            );
            break;
          case 303:
            alertRef.current.showAlert(
              `${capitalize(
                selectedPokemon.name
              )} is already in your boxes. Find another Pokemon.`,
              "warning"
            );
        }
      } else {
        alertRef.current.showAlert(
          `Oh no! ${capitalize(
            selectedPokemon.name
          )} ran away! (check the logs foo)`,
          "danger"
        );
      }
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
      alertRef.current.showAlert(
        `So long, ${capitalize(selectedPokemon.name)}.`,
        "success"
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
        <CollectionMenu
          collectionType={collectionType}
          onCollectionClicked={onCollectionClicked}
        />
      </div>
      <Alert ref={alertRef} />
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
