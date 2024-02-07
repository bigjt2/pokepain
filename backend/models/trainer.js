const mongoose = require("mongoose");

const Trainer = mongoose.model(
  "Trainer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
  })
);

module.exports = Trainer;
