import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import { capitalize } from "../utils";
import { CollectionType } from "../models/Collections";
import { isMobile } from "react-device-detect";

export interface IPokemonListItem {
  name: string;
  id: number;
  url: string;
}

interface PokemonListProps {
  pokemons: [];
  totalPokemons: number;
  onPokemonSelected: (pokemon: IPokemonListItem | null) => void;
  onListInternalUpdate: (offset: number, limit: number) => void;
  collectionType: CollectionType;
  error: any | void;
}

function PokemonList({
  pokemons,
  totalPokemons,
  onPokemonSelected,
  onListInternalUpdate: updateList,
  collectionType,
  error,
}: PokemonListProps) {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [updateLimit, setUpdateLimit] = useState(limit);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    reset();
  }, [collectionType, pokemons]);
  useEffect(() => {
    updateList(offset, updateLimit);
  }, [updateLimit, offset]);

  const reset = () => {
    onPokemonSelected(null);
    setSelectedIndex(-1);
  };

  const onNext = () => {
    let newOffset = Math.min(offset + limit, totalPokemons - limit);
    newOffset = Math.max(newOffset, 0);
    setOffset(newOffset);
    setSelectedIndex(-1);
  };

  const getNoPokemonMessage = () => {
    if (error) {
      return <p>Something is wrong with the pokemons backend service</p>;
    }
    if (pokemons.length === 0) {
      switch (collectionType) {
        case CollectionType.Wild: {
          return <p>No pokemons to catch.</p>;
        }
        case CollectionType.Pokedex: {
          return <p>No pokemons caught.</p>;
        }
      }
    }
    return null;
  };

  return (
    <Fragment>
      {getNoPokemonMessage()}
      <div className="container">
        <div className="row">
          <div style={{ height: "80vh" }}>
            <ul className="list-group list-group-scroll">
              {pokemons.map((pokemon: IPokemonListItem, index) => (
                <li
                  key={pokemon.name}
                  onClick={() => {
                    onPokemonSelected(pokemon);
                    setSelectedIndex(index);
                  }}
                  className={
                    selectedIndex === index
                      ? "list-group-item active"
                      : "list-group-item"
                  }
                >
                  {capitalize(pokemon.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-secondary"
              disabled={offset === 0}
              onClick={() => {
                setOffset(Math.max(offset - limit, 0));
                setSelectedIndex(-1);
              }}
            >
              Previous
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-secondary"
              //TODO figure out a better disable option of this button
              onClick={onNext}
            >
              Next
            </button>
          </div>
          {!isMobile && (
            <Fragment>
              <div className="col">Results Per Page:</div>
              <div className="col">
                <input
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  value={limit}
                  type="number"
                  onChange={(e: BaseSyntheticEvent) => {
                    setLimit(Number(e.target.value));
                  }}
                />
              </div>
              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setUpdateLimit(limit);
                  }}
                >
                  Load
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PokemonList;
