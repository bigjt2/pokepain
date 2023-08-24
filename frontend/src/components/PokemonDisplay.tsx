import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { capitalize } from "../utils";

interface PokemonDisplayProps {
  currentUrl: string;
}

interface IPokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
  types: [];
}

function PokemonDisplay({ currentUrl }: PokemonDisplayProps) {
  const [pokemon, setPokemon] = useState<IPokemon | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(currentUrl);
        setPokemon(data);
        console.log(pokemon);
      } catch (e: any) {
        console.log(
          //TODO: move to file logging.
          `Failed to retrieve records from ${currentUrl}, error returned: ${e.message}`
        );
      }
    };
    fetchData();
  }, [currentUrl]);

  return (
    pokemon && (
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <img
                src={pokemon.sprites.front_default}
                alt="No Image Available"
              />
            </div>
            <div className="col">
              <div className="row">Name: {capitalize(pokemon.name)}</div>
              <div className="row">
                Type(s):{" "}
                {pokemon.types
                  .map(function (type) {
                    return capitalize(type.type.name);
                  })
                  .join(" ")}
              </div>
              <div className="row">Height: {pokemon.height}</div>
              <div className="row">Weight: {pokemon.weight}</div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  );
}

export default PokemonDisplay;
