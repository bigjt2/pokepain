import React, { useState, useEffect } from "react";
import api from "./services/api";
import PokemonList from "./components/PokemonList";

function App() {
  const pokepainEndpoint = "/test";
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState("");

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const { data } = await api.get(pokepainEndpoint);
        setPokemon(data.results);
      } catch (error) {
        setError("Couldn't catch any Pokemons, let alone all.");
      }
    };
    fetchPokemon();
  }, []);

  return (
    <div>
      <PokemonList pokemons={pokemon} />
    </div>
  );
}

export default App;
