import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import {
  CollectionType,
  getCollectionUrlFromType,
  getPokeApiBaseUrl,
} from "./Collections";
import { BaseSyntheticEvent, useState } from "react";

import "./App.css";

function App() {
  const [baseListUrl, setBaseListUrl] = useState<string>(getPokeApiBaseUrl);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState<string | null>(
    null
  );
  const [collectionType, setCollectionType] = useState<CollectionType>(
    CollectionType.Wild
  );

  const onPokeClicked = (url: string | null) => {
    setSelectedPokemonUrl(url);
  };

  const onCollectionClicked = (e: BaseSyntheticEvent) => {
    let collectionUrl = getCollectionUrlFromType(e.target.value);
    setCollectionType(e.target.value);
    setBaseListUrl(collectionUrl);
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
            apiBaseUrl={baseListUrl}
            onPokemonSelected={onPokeClicked}
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
