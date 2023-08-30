const mongoose = require("mongoose");
const winston = require("winston");

//TODO: environment variable
const DB = "mongodb://127.0.0.1:27017/pokepain";

module.exports = function () {
  mongoose
    .connect(DB)
    .then(() => winston.info(`Connected to MongoDB at ${DB}`))
    .catch((err) => {
      winston.error("You dun goofed! -- " + err);
    });
};
