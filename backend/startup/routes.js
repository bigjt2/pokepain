const express = require("express");
const cors = require("cors");
const pokedex = require("../routes/pokedex");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/pokedex", pokedex);
};
