import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import { useState } from "react";

import "./App.css";

function App() {
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState<string | null>(
    null
  );

  const onPokeClicked = (url: string) => {
    setSelectedPokemonUrl(url);
  };

  return (
    <div className="container">
      <div style={{ backgroundColor: "#301934", color: "white" }}>
        <h2>Pokemons</h2>
      </div>
      <div className="row">
        <div className="col">
          <PokemonList onPokemonSelected={onPokeClicked} />
        </div>
        <div className="col">
          {selectedPokemonUrl && (
            <PokemonDisplay currentUrl={selectedPokemonUrl} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
