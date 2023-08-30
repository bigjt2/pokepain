const express = require("express");
const router = express.Router();
const winston = require("winston");
const Pokemon = require("../models/pokemon");

const POKEDEX_ENDPOINT = "/api/pokedex";

router.get("/", async (req, res) => {
  const pokemons = await Pokemon.find().sort("name");
  let results = pokemons.map((pk) => {
    let url = `${req.protocol}://${req.get("host")}${POKEDEX_ENDPOINT}/${
      pk.id
    }`;
    return { name: pk.name, url: url };
  });
  res.send({
    count: pokemons.length,
    next: "",
    previous: null,
    results: results,
  });
});

router.get("/:id", async (req, res) => {
  const pokemon = await Pokemon.findOne({ id: req.params.id });
  res.send(pokemon.body);
});

router.post("/", async (req, res) => {
  const pokemon = new Pokemon(req.body);
  await pokemon.save();
  res.status(201).send(pokemon);
});

module.exports = { Router: router, POKEDEX_ENDPOINT: POKEDEX_ENDPOINT };
