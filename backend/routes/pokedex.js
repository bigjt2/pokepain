const express = require("express");
const router = express.Router();
const winston = require("winston");
const Pokemon = require("../models/pokemon");
const Pokedex = require("../models/pokedex");
const pokemonView = require("../models/pokemonView");
const verifyAccess = require("../middleware/verifyAccessToken");
const { validateIdParam, validatePokePost } = require("../middleware/validate");

const POKEDEX_ENDPOINT = "/api/pokedex";

router.get("/", verifyAccess, async (req, res) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);

  try {
    let pokedex = await getPokedex(req);
    let responseBody = {
      count: 0,
      next: "",
      previous: null,
      results: [],
    };

    if (pokedex) {
      const pokemons = await pokemonView.PokemonView.find({
        _id: { $in: pokedex.pokemons },
      })
        .sort("name")
        .limit(limit)
        .skip(offset);
      results = pokemons.map((pk) => {
        let url = `${req.protocol}://${req.get("host")}${POKEDEX_ENDPOINT}/${
          pk.id
        }`;
        return { name: pk.name, url: url };
      });
      responseBody.count = pokemons.length;
      responseBody.results = results;
    }

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

    let pokedex = await getPokedex(req);
    if (!pokedex) {
      pokedex = await initPokedex(req);
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
    let pokedex = await getPokedex(req);
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

async function getPokedex(req) {
  let trainerId = req.trainerId;
  return await Pokedex.findOne({ trainer: trainerId });
}

async function initPokemon(req) {
  pokemon = new Pokemon({
    name: req.body.name,
    id: req.body.id,
    body: req.body,
  });
  return await pokemon.save();
}

async function initPokedex(req) {
  pokedex = new Pokedex({
    trainer: req.trainerId,
  });
  return await pokedex.save();
}

module.exports = { Router: router, POKEDEX_ENDPOINT: POKEDEX_ENDPOINT };
