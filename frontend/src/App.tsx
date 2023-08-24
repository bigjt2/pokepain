import PokemonDisplay from "./components/PokemonDisplay";
import PokemonList from "./components/PokemonList";
import { useState } from "react";

function App() {
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState("");

  const onPokeClicked = (url: string) => {
    setSelectedPokemonUrl(url);
  };

  return (
    <div>
      <PokemonList onPokemonSelected={onPokeClicked} />
      <PokemonDisplay currentUrl={selectedPokemonUrl} />
    </div>
  );
}

export default App;
