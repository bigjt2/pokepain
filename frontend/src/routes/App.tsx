import PokemonDisplay from "../components/PokemonDisplay";
import PokemonList from "../components/PokemonList";
import CollectionMenu from "../components/CollectionMenu";
import Alert from "../components/Alert";
import { CollectionType } from "../models/Collections";
import { BaseSyntheticEvent, useState, useRef, useEffect } from "react";
import {
  IBatchFetchResult,
  IApiError,
  IPokemonResult,
  isBatchFetchResult,
  isPokemonResult,
  isError,
} from "../models/ApiResults";
import pokeApiService from "../services/pokeApiService";
import pokedexService from "../services/pokedexService";
import { capitalize } from "../utils";

import "../App.css";

function App() {
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
    let pokemonResult = null;
    if (CollectionType.Wild === collectionType) {
      pokemonResult = await pokeApiService.fetchSinglePokemonDetail(url);
    } else if (CollectionType.Pokedex === collectionType) {
      pokemonResult = await pokedexService.fetchPokedexEntry(url);
    }
    if (pokemonResult && isPokemonResult(pokemonResult))
      setSelectedPokemon(pokemonResult);
    if (pokemonResult && isError(pokemonResult)) setError(pokemonResult);
  };

  const refreshList = async (offset?: number, limit?: number) => {
    let result = null;
    if (CollectionType.Wild === collectionType) {
      result = await pokeApiService.fetchPokemonsFromWild(offset, limit);
    } else if (CollectionType.Pokedex === collectionType) {
      result = await pokedexService.fetchPokemonsFromPokedex(offset, limit);
    }
    if (result) {
      refreshListFromResult(result);
      setSelectedPokemon(undefined);
    }
  };

  const refreshListFromResult = (result: IBatchFetchResult | IApiError) => {
    if (isBatchFetchResult(result)) {
      setPokemons(result.results);
      setTotal(result.total);
    }
    if (isError(result)) {
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
      let result = await pokedexService.postPokemonToPokedex(selectedPokemon);
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
              )} is already in your pokedex. Find another Pokemon.`,
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
      let result = await pokedexService.deletePokemonFromPokedex(
        selectedPokemon.id
      );
      if (typeof result === "number") {
        switch (result) {
          case 204:
            alertRef.current.showAlert(
              `So long, ${capitalize(selectedPokemon.name)}.`,
              "success"
            );
            refreshList();
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

  useEffect(() => {
    refreshList();
  }, [collectionType]);

  return (
    <div className="container">
      <div
        className="row"
        style={{ backgroundColor: "#301934", color: "white" }}
      >
        <h2 style={{ marginLeft: "1vw" }}>Pokemons</h2>
        <CollectionMenu
          collectionType={collectionType}
          onCollectionClicked={(e) => setCollectionType(e.target.value)}
        />
      </div>
      <Alert ref={alertRef} />
      <div id="mainDisplayRow" className="row">
        <div className="col" style={{ width: "50%" }}>
          <PokemonList
            pokemons={pokemons}
            totalPokemons={total}
            onPokemonSelected={onPokeClicked}
            onListInternalUpdate={refreshList}
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