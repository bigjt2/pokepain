const express = require("express");
const router = express.Router();
const winston = require("winston");
const Pokemon = require("../models/pokemon");
const pokemonView = require("../models/pokemonView");
const verifyAccess = require("../middleware/verifyAccessToken");
const { validateIdParam, validatePokePost } = require("../middleware/validate");
const {
  initPokedex,
  getPokedex,
  getPokedexEntries,
} = require("../service/pokedexService");

const POKEDEX_ENDPOINT = "/api/pokedex";

router.get("/", verifyAccess, async (req, res) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);

  try {
    const pokedex = await getPokedex(req.trainer.trainerId);
    let responseBody = await getPokedexEntries(pokedex, limit, offset);
    res.send(responseBody);
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.get("/:id", [verifyAccess, validateIdParam], async (req, res) => {
  const pokemon = await Pokemon.findOne({ id: req.params.id });
  res.send(pokemon.body);
});

router.post("/", [verifyAccess, validatePokePost], async (req, res) => {
  try {
    let pokemon = await Pokemon.findOne({
      name: req.body.name,
      id: req.body.id,
    });
    if (!pokemon) {
      pokemon = await initPokemon(req);
    }

    let pokedex = await getPokedex(req.trainer.trainerId);
    if (!pokedex) {
      pokedex = await initPokedex(req.trainer.trainerId);
    }
    if (pokedex.pokemons.includes(pokemon._id)) {
      res.status(303).send("Pokemon already caught.");
      return;
    }
    pokedex.pokemons.push(pokemon);
    pokedex.save();

    res.status(201).send({ name: pokemon.name, id: pokemon.id });
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.delete("/:id", [verifyAccess, validateIdParam], async (req, res) => {
  try {
    let pokedex = await getPokedex(req.trainer.trainerId);
    let view = await pokemonView.PokemonView.findOne({ id: req.params.id });

    const index = pokedex.pokemons.indexOf(view._id);
    if (index === -1) {
      return res
        .status(404)
        .send("The pokemon with the given ID was not found.");
    } else {
      pokedex.pokemons.splice(index, 1);
      await pokedex.save();
      return res.status(204).send();
    }
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

async function initPokemon(req) {
  pokemon = new Pokemon({
    name: req.body.name,
    id: req.body.id,
    body: req.body,
  });
  return await pokemon.save();
}

module.exports = { Router: router, POKEDEX_ENDPOINT: POKEDEX_ENDPOINT };
