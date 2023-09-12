import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import {
  CollectionType,
  getCollectionUrlFromType,
  getPokeApiBaseUrl,
} from "./Collections";
import { BaseSyntheticEvent, useState } from "react";
import { BatchFetchResult } from "./services/api";
import api from "./services/api";

import "./App.css";

function App() {
  const [baseListUrl, setBaseListUrl] = useState<string>(getPokeApiBaseUrl);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState<string | null>(
    null
  );
  const [collectionType, setCollectionType] = useState<CollectionType>(
    CollectionType.Wild
  );

  const [pokemons, setPokemons] = useState<[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const onPokeClicked = (url: string | null) => {
    setSelectedPokemonUrl(url);
  };

  const onCollectionClicked = async (e: BaseSyntheticEvent) => {
    let collectionUrl = getCollectionUrlFromType(e.target.value);
    setCollectionType(e.target.value);
    setBaseListUrl(collectionUrl);
    let result = await api.fetchPokemons(collectionUrl);
    refreshListFromResult(result);
  };

  const updateList = async (offset: number, limit: number) => {
    let result = await api.fetchPokemons(baseListUrl, offset, limit);
    refreshListFromResult(result);
  };

  const refreshListFromResult = (result: BatchFetchResult) => {
    setError(result.error);
    setPokemons(result.results);
    setTotal(result.total);
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
            updateList={updateList}
            collectionType={collectionType}
            error={error}
          />
        </div>
        <div className="col">
          {selectedPokemonUrl && (
            <PokemonDisplay
              collectionType={collectionType}
              currentUrl={selectedPokemonUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
