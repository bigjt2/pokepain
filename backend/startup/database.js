const mongoose = require("mongoose");
const winston = require("winston");

const DB_HOST = process.env.POKEDEX_MONGO_HOST || "127.0.0.1";
const DB_PORT = process.env.POKEDEX_MONGO_PORT || "27017";
const DB_NAME = process.env.POKEDEX_MONGO_NAME || "pokedex";
const DB = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = function () {
  mongoose
    .connect(DB)
    .then(() => winston.info(`Connected to MongoDB at ${DB}`))
    .catch((err) => {
      winston.error(`Error connecting to mongo at ${DB} -- error: ${err} `);
    });
};
