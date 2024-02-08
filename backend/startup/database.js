const mongoose = require("mongoose");
const winston = require("winston");
const pokemonView = require("../models/pokemonView");

const DB_HOST = process.env.POKEDEX_MONGO_HOST || "127.0.0.1";
const DB_PORT = process.env.POKEDEX_MONGO_PORT || "27017";
const DB_NAME = process.env.POKEDEX_MONGO_NAME || "pokedex";
const DB = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = function () {
  mongoose
    .connect(DB)
    .then(() => {
      winston.info(`Connected to MongoDB at ${DB}`);
      const db = mongoose.connection;

      db.db
        .createCollection("pokemonView", {
          viewOn: "pokemons",
          pipeline: pokemonView.pokemonViewPipeline,
        })
        .then(() => console.log("PokemonView created successfully"))
        .catch((err) => {
          //TODO: figure out a better way to check for existing collection BEFORE trying to create it.
          if (err.codeName && err.codeName !== "NamespaceExists")
            winston.error("Error creating PokemonVienw: ", err);
        });
    })
    .catch((err) => {
      winston.error(`Error connecting to mongo at ${DB} -- error: ${err} `);
    });
};
