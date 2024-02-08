const mongoose = require("mongoose");

const PokemonView = mongoose.model(
  "PokemonView",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
    },
    { strict: false }
  ),
  "pokemonView"
);

const pokemonViewPipeline = [
  {
    $project: {
      name: 1,
      id: 1,
    },
  },
];

module.exports = { PokemonView, pokemonViewPipeline };
