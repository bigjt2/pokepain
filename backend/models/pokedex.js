const mongoose = require("mongoose");

const Pokedex = mongoose.model(
  "Pokedex",
  new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
  })
);

module.exports = Pokedex;
