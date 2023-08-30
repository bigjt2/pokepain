const express = require("express");
const cors = require("cors");
const pokedex = require("../routes/pokedex");

module.exports = function (app) {
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cors());
  app.use(pokedex.POKEDEX_ENDPOINT, pokedex.Router);
};
