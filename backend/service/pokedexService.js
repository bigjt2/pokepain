const Pokedex = require("../models/pokedex");
const pokemonView = require("../models/pokemonView");

exports.initPokedex = async function initPokedex(trainerId) {
  pokedex = new Pokedex({
    trainer: trainerId,
  });
  return await pokedex.save();
};

exports.getPokedex = async function getPokedex(trainerId) {
  //let trainerId = req.trainer.trainerId;
  return await Pokedex.findOne({ trainer: trainerId });
};

exports.getPokedexEntries = async function getPokedexEntries(
  pokedex,
  limit,
  offset
) {
  let entries = {
    count: 0,
    next: "",
    previous: null,
    results: [],
  };

  if (pokedex) {
    const pokemons = await pokemonView.PokemonView.find({
      _id: { $in: pokedex.pokemons },
    })
      .sort("name")
      .limit(limit)
      .skip(offset);
    results = pokemons.map((pk) => {
      return { name: pk.name, id: pk.id };
    });
    entries.count = pokemons.length;
    entries.results = results;
  }
  return entries;
};
