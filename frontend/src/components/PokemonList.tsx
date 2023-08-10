import { Fragment } from "react";
import Pokemon from "./Pokemon";

interface PokemonProps {
  pokemons: { name: string; url: string }[];
}

function PokemonList({ pokemons }: PokemonProps) {
  const getNoPokemonMessage = () => {
    return pokemons.length === 0 && <p>No pokemons to catch.</p>;
  };

  return (
    <Fragment>
      {getNoPokemonMessage()}

      <ul className="pokemons">
        {pokemons.map((pokemon, index) => (
          <li>{pokemon.name}</li>
        ))}
      </ul>
    </Fragment>
  );
}

export default PokemonList;
