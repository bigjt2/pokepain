const mongoose = require("mongoose");

const Pokemon = mongoose.model(
  "Pokemon",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    body: {
      type: Object,
      required: true,
    },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
  })
);

module.exports = Pokemon;
