import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import { capitalize } from "../utils";
import { CollectionType } from "../Collections";

interface PokemonListProps {
  pokemons: [];
  totalPokemons: number;
  onPokemonSelected: (url: string | null) => void;
  updateList: (offset: number, limit: number) => void;
  collectionType: CollectionType;
  error: any | void;
}

function PokemonList({
  pokemons,
  totalPokemons,
  onPokemonSelected,
  updateList,
  collectionType,
  error,
}: PokemonListProps) {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [updateLimit, setUpdateLimit] = useState(limit);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    reset();
  }, [collectionType]);
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
        case CollectionType.Boxes: {
          return <p>No pokemons caught.</p>;
        }
      }
    }
    return null;
  };

  return (
    <Fragment>
      {getNoPokemonMessage()}
      <div style={{ height: "80vh" }}>
        <ul className="list-group list-group-scroll">
          {pokemons.map((pokemon: { name: string; url: string }, index) => (
            <li
              key={pokemon.name}
              onClick={() => {
                onPokemonSelected(pokemon.url);
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
      <button
        className="btn btn-secondary"
        disabled={offset === 0}
        onClick={() => {
          setOffset(Math.max(offset - limit, 0));
          setSelectedIndex(-1);
        }}
      >
        Previous Pokemons
      </button>
      Results Per Page:
      <input
        value={limit}
        type="number"
        onChange={(e: BaseSyntheticEvent) => {
          setLimit(Number(e.target.value));
        }}
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          setUpdateLimit(limit);
        }}
      >
        Load
      </button>
      <button
        className="btn btn-secondary"
        //TODO figure out a better disable option of this button
        onClick={onNext}
      >
        Next Pokemons
      </button>
    </Fragment>
  );
}

export default PokemonList;
