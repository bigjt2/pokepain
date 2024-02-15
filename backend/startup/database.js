const mongoose = require("mongoose");
const winston = require("winston");
const pokemonView = require("../models/pokemonView");

const DB_HOST = process.env.POKEDEX_MONGO_HOST || "127.0.0.1";
const DB_PORT = process.env.POKEDEX_MONGO_PORT || "27017";
const DB_NAME = process.env.POKEDEX_MONGO_NAME || "pokedex";
const DB = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const RECONNECT_INTERVAL = 5000;
const MAX_RETRIES = 5;
let reconnectTries = 0;

function checkRetries() {
  reconnectTries++;
  if (reconnectTries > MAX_RETRIES) {
    winston.error(
      `Exceded retry threshold with ${reconnectTries} retries. Connection is failed. App shutting down.`
    );
    process.exit(1);
  }
  winston.warn(`Reconnect attmpt # ${reconnectTries}`);
}

function setupListeners() {
  const db = mongoose.connection;
  db.on("error", (err) => {
    winston.error(`MongoDB connection error: ${err}`);
  });

  db.on("connected", () => {
    reconnectTries = 0;
    winston.info("MongoDB connected!");
  });

  db.on("disconnected", () => {
    winston.warn(
      `MongoDB disconnected! Attempting to reconnect every ${RECONNECT_INTERVAL} ms.`
    );
    setTimeout(() => {
      checkRetries();
      mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }, RECONNECT_INTERVAL);
  });
}

const connectWithRetry = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      winston.info(`Connected to MongoDB at ${DB}`);
      const db = mongoose.connection;
      setupListeners(db);

      db.db
        .createCollection("pokemonView", {
          viewOn: "pokemons",
          pipeline: pokemonView.pokemonViewPipeline,
        })
        .then(() => winston.info("PokemonView created successfully"))
        .catch((err) => {
          //TODO: figure out a better way to check for existing collection BEFORE trying to create it.
          if (err.codeName && err.codeName !== "NamespaceExists")
            winston.error("Error creating PokemonVienw: ", err);
        });
    })
    .catch((err) => {
      checkRetries();
      winston.error(
        `Initial connection to mongo failed at ${DB} -- error: ${err},  `
      );
      setTimeout(connectWithRetry, RECONNECT_INTERVAL);
    });
};

module.exports = function () {
  connectWithRetry();
};
