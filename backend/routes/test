const axios = require("axios");
const express = require("express");
const router = express.Router();
const winston = require("winston");

router.get("/", async (req, res) => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon/", {
    params: { offset: req.query.offset, limit: req.query.limit },
  });
  const data = response.data;
  res.send(data);
});

module.exports = router;
