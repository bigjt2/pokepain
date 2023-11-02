const express = require("express");
const router = express.Router();

const HEALTHCHECK_ENDPOINT = "/api/healthcheck";

router.get("/", async (req, res) => {
  res.send("Pokedex running.");
});

module.exports = { Router: router, HEALTHCHECK_ENDPOINT: HEALTHCHECK_ENDPOINT };
