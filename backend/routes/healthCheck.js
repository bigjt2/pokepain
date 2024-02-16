const express = require("express");
const router = express.Router();
const winston = require("winston");
const mongoose = require("mongoose");

const HEALTHCHECK_ENDPOINT = "/api/healthcheck";

router.get("/", async (req, res) => {
  dbState = mongoose.connection.readyState;

  if (dbState === 0 || dbState === 3) {
    winston.error(`Health check failed. Database state: ${dbState}`);
    res.status(503).send("Pokedex connection to the database failed.");
  } else {
    res.status(200).send("Pokedex running.");
  }
});

module.exports = { Router: router, HEALTHCHECK_ENDPOINT: HEALTHCHECK_ENDPOINT };
