import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { capitalize } from "../utils";

interface PokemonListProps {
  apiBaseUrl: string;
  onPokemonSelected: (url: string | null) => void;
}

function PokemonList({ apiBaseUrl, onPokemonSelected }: PokemonListProps) {
  const [pokemons, setPokemons] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [updateLimit, setUpdateLimit] = useState(limit);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    reset();
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchPokemon();
  }, [updateLimit, offset, total]);

  const reset = () => {
    setTotal(0);
    setOffset(0);
    setLimit(20);
    onPokemonSelected(null);
    setSelectedIndex(-1);
  };

  const fetchPokemon = async () => {
    try {
      const { data } = await axios.get(apiBaseUrl, {
        params: { offset: offset, limit: limit },
      });
      if (total === 0) setTotal(data.count);
      setPokemons(data.results);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        console.log(
          //TODO: move to file logging.
          `Failed to retrieve records from ${apiBaseUrl}, error returned: ${e.message}`
        );
      }
      setError(e);
    }
  };

  const onNext = () => {
    let newOffset = Math.min(offset + limit, total - limit);
    newOffset = Math.max(newOffset, 0);
    setOffset(newOffset);
    setSelectedIndex(-1);
  };

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
