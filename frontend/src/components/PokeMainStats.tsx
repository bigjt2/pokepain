import { Fragment } from "react";
import { capitalize } from "../utils";
import { IPokemonResult } from "../services/api";

function PokeMainStats(pokemon: IPokemonResult) {
  return (
    <Fragment>
      <div id="pokemonMainStats" className="col col-bordered">
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
    </Fragment>
  );
}

export default PokeMainStats;
