import { Fragment, useState, useEffect } from "react";
import { capitalize, sortByNameAZ } from "../utils";
import { CollectionType } from "../models/Collections";
import { IPokemonResult } from "../models/ApiResults";
import PokeMainStats from "../components/PokeMainStats";
import Accordion from "./Accordion";

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
        {/* Desktop Display */}
        <div className="row d-none d-md-flex">
          <div id="pokemonImage" className="col text-center col-bordered">
            <img src={pokemon.sprites.front_default} alt="No Image Available" />
          </div>
          <PokeMainStats {...pokemon} />
        </div>
        {/* Phone Display */}
        <div className="row d-md-none">
          <div id="pokemonImage" className="col text-center col-bordered">
            <img src={pokemon.sprites.front_default} alt="No Image Available" />
          </div>
        </div>
        <div className="row d-md-none">
          <PokeMainStats {...pokemon} />
        </div>

        <div id="baseStats" className="row">
          <table className="table">
            <thead>
              <tr>
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

        <div id="moveStats" className="row">
          <Accordion title="Moves">
            <div style={{ height: "20vh" }}>
              <ul className="list-group list-group-scroll">
                {moves?.map((moveItem, index) => (
                  <li key={index} className={"list-group-item"}>
                    {capitalize(moveItem.name)}
                  </li>
                ))}
              </ul>
            </div>
          </Accordion>
        </div>
        <div id="abilityStats" className="row ">
          <Accordion title="Abilities">
            <ul className="list-group list-group-scroll">
              {abilities?.map((ability, index) => (
                <li key={index} className={"list-group-item"}>
                  {capitalize(ability.name)}
                </li>
              ))}
            </ul>
          </Accordion>
        </div>
        <div id="actionBtns" className="row">
          {collectionType === CollectionType.Wild && (
            <button className="btn btn-secondary" onClick={onCatch}>
              Register
            </button>
          )}
          {collectionType === CollectionType.Pokedex && (
            <button className="btn btn-secondary" onClick={onRelease}>
              Remove
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PokemonDisplay;
