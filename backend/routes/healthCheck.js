const express = require("express");
const router = express.Router();
const winston = require("winston");
const mongoose = require("mongoose");

const HEALTHCHECK_ENDPOINT = "/api/healthcheck";

router.get("/", async (req, res) => {
  dbState = mongoose.connection.readyState;

  winston.info("Health check pinged.");
  winston.info(`Database state: ${dbState}`);

  if (dbState === 0 || dbState === 3) {
    res.status(503).send("Pokedex connection to the database failed.");
  } else {
    res.status(200).send("Pokedex running.");
  }
});

module.exports = { Router: router, HEALTHCHECK_ENDPOINT: HEALTHCHECK_ENDPOINT };
