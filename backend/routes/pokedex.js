const express = require("express");
const router = express.Router();
const winston = require("winston");
const Pokemon = require("../models/pokemon");

const POKEDEX_ENDPOINT = "/api/pokedex";

router.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);
  const pokemons = await Pokemon.find().sort("name").limit(limit).skip(offset);
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
  try {
    const exists =
      (await Pokemon.count({
        name: req.body.name,
        id: req.body.id,
      })) > 0;
    if (exists) {
      res.status(303).send("Pokemon already caught.");
      return;
    }

    const pokemon = new Pokemon({
      name: req.body.name,
      id: req.body.id,
      body: req.body,
    });
    await pokemon.save();
    res.status(201).send({ name: pokemon.name, id: pokemon.id });
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Pokemon.findOneAndRemove({ id: req.params.id });
    if (!deleted)
      return res
        .status(404)
        .send("The pokemon with the given ID was not found.");
    res.status(204).send();
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

module.exports = { Router: router, POKEDEX_ENDPOINT: POKEDEX_ENDPOINT };
