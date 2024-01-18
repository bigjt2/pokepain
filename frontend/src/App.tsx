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

  const ranAwayAlert = () => {
    let pokemon = selectedPokemon !== undefined ? selectedPokemon.name : "it";
    alertRef.current.showAlert(
      `Oh no! ${capitalize(pokemon)} ran away! (check the logs foo)`,
      "danger"
    );
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
            break;
          default:
            ranAwayAlert();
        }
      } else ranAwayAlert();
    } else {
      console.error("Pokemon was not set from list before attempting to POST.");
    }
  };

  const onRelease = async () => {
    if (selectedPokemon) {
      let result = await api.deletePokemonFromPokedex(
        getPokedexApiBaseUrl(),
        selectedPokemon.id
      );
      if (typeof result === "number") {
        switch (result) {
          case 204:
            alertRef.current.showAlert(
              `So long, ${capitalize(selectedPokemon.name)}.`,
              "success"
            );
            refreshList(baseListUrl);
            break;
          default:
            ranAwayAlert();
        }
      } else ranAwayAlert();
    } else {
      console.error(
        "Pokemon was not set from list before attempting to DELETE."
      );
    }
  };

  const clearList = () => {
    setPokemons([]);
    setTotal(0);
    setSelectedPokemon(undefined);
  };

  return (
    <div className="container">
      <div
        className="row"
        style={{ backgroundColor: "#301934", color: "white" }}
      >
        <h2 style={{ marginLeft: "1vw" }}>Pokemons</h2>
        <CollectionMenu
          collectionType={collectionType}
          onCollectionClicked={onCollectionClicked}
        />
      </div>
      <Alert ref={alertRef} />
      <div id="mainDisplayRow" className="row">
        <div className="col" style={{ width: "50%" }}>
          <PokemonList
            pokemons={pokemons}
            totalPokemons={total}
            onPokemonSelected={onPokeClicked}
            onListInternalUpdate={onListInternalUpdate}
            collectionType={collectionType}
            error={error}
          />
        </div>
        <div className="col" style={{ width: "50%" }}>
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
