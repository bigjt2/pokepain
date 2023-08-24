import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { capitalize } from "../utils";

interface PokemonListProps {
  onPokemonSelected: (url: string) => void;
}

function PokemonList({ onPokemonSelected }: PokemonListProps) {
  const pokeApiBasuUrl = "https://pokeapi.co/api/v2/pokemon/";
  const [pokemons, setPokemons] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [updateLimit, setUpdateLimit] = useState(limit);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onNext = () => {
    let newOffset = Math.min(offset + limit, total - limit);
    newOffset = Math.max(newOffset, 0);
    setOffset(newOffset);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const { data } = await axios.get(pokeApiBasuUrl, {
          params: { offset: offset, limit: limit },
        });
        if (total === 0) setTotal(data.count);
        setPokemons(data.results);
      } catch (e: any) {
        if (e instanceof AxiosError) {
          console.log(
            //TODO: move to file logging.
            `Failed to retrieve records from ${pokeApiBasuUrl}, error returned: ${e.message}`
          );
        }
        setError(e);
      }
    };
    fetchPokemon();
  }, [updateLimit, offset]);

  const getNoPokemonMessage = () => {
    return (
      error !== null && (
        <p>Something is wrong with the pokemons backend service</p>
      )
    );
    return pokemons.length === 0 && <p>No pokemons to catch.</p>;
  };

  return (
    <Fragment>
      {getNoPokemonMessage()}
      <ul className="list-group">
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
