import { Fragment, useState, useEffect } from "react";
import { capitalize, sortByNameAZ } from "../utils";
import { CollectionType } from "../Collections";
import { IPokemonResult } from "../services/api";

interface PokemonDisplayProps {
  pokemon: IPokemonResult;
  collectionType: CollectionType;
  onCatch: () => void;
  onRelease: () => void;
}

interface IPokemonTableItem {
  name: string;
  url: string;
}

function PokemonDisplay({
  pokemon,
  collectionType,
  onCatch,
  onRelease,
}: PokemonDisplayProps) {
  const [moves, setMoves] = useState<IPokemonTableItem[]>();
  const [abilities, setAbilities] = useState<IPokemonTableItem[]>();

  useEffect(() => {
    function formatPokemonForDisplay(pokemon?: IPokemonResult) {
      if (!pokemon) return;

      let mvResults = pokemon.moves.map(function (mv: any) {
        return mv.move;
      });
      let abResults = pokemon.abilities.map(function (ab: any) {
        return ab.ability;
      });
      sortByNameAZ(mvResults);
      sortByNameAZ(abResults);
      setMoves(mvResults);
      setAbilities(abResults);
    }
    formatPokemonForDisplay(pokemon);
  }, [pokemon]);

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col text-center col-bordered">
            <img src={pokemon.sprites.front_default} alt="No Image Available" />
          </div>
          <div className="col col-bordered">
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

        <div className="row">
          <table className="table">
            <thead>
              <tr className="table table-dark">
                <th colSpan={2}>Base Stats</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HP:</td>
                <td>{pokemon.stats[0].base_stat}</td>
              </tr>
              <tr>
                <td>Attack:</td>
                <td>{pokemon.stats[1].base_stat}</td>
              </tr>
              <tr>
                <td>Defense:</td>
                <td>{pokemon.stats[2].base_stat}</td>
              </tr>
              <tr>
                <td>Special Attack:</td>
                <td>{pokemon.stats[3].base_stat}</td>
              </tr>
              <tr>
                <td>Special Defense:</td>
                <td>{pokemon.stats[4].base_stat}</td>
              </tr>
              <tr>
                <td>Speed:</td>
                <td>{pokemon.stats[5].base_stat}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row ">
          <h3 className="list-group-header">Moves</h3>
          <div style={{ height: "20vh" }}>
            <ul className="list-group list-group-scroll">
              {moves?.map((moveItem, index) => (
                <li key={index} className={"list-group-item"}>
                  {capitalize(moveItem.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row ">
          <h3 className="list-group-header">Abilities</h3>
          <div style={{ height: "10vh" }}>
            <ul className="list-group list-group-scroll">
              {abilities?.map((ability, index) => (
                <li key={index} className={"list-group-item"}>
                  {capitalize(ability.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {collectionType === CollectionType.Wild && (
        <button className="btn btn-secondary" onClick={onCatch}>
          Catch!
        </button>
      )}
      {collectionType === CollectionType.Boxes && (
        <button className="btn btn-secondary" onClick={onRelease}>
          Release
        </button>
      )}
    </Fragment>
  );
}

export default PokemonDisplay;
