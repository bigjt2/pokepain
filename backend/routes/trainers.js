const express = require("express");
const router = express.Router();
const winston = require("winston");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer");
const auth = require("../middleware/auth");
const appSecrets = require("../startup/appSecrets");

const TRAINERS_ENDPOINT = "/api/trainers";

router.get("/login", async (req, res) => {
  const authHeader = req.get("authorization");
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const trainer = await Trainer.findOne({ name: username });
  if (!trainer)
    return res.status(404).send("No trainer found with provided trainer name.");

  if (!password) return res.status(401).send("Password required.");
  const success = await bcrypt.compare(password, trainer.password);
  if (!success)
    return res
      .status(401)
      .send("Password is incorrect. Wake up earlier next time!");

  let data = {
    time: Date(),
    userId: username,
  };
  const userToken = jwt.sign(data, appSecrets.pokedexApiKey, {
    expiresIn: "1m",
  });
  res
    .status(200)
    .send({ authHeader: appSecrets.authHeaderKey, authToken: userToken });
});

router.post("/register", async (req, res) => {
  try {
    const exists =
      (await Trainer.count({ trainerName: req.body.trainerName })) > 0;
    if (exists)
      return res.status(303).send("Trainer already registed with that name.");
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(req.body.password, salt);
    const trainer = new Trainer({
      name: req.body.trainerName,
      password: encryptedPass,
    });
    await trainer.save();
    res.status(201).send({ trainerName: trainer.name, encryptedPass });
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

module.exports = { Router: router, TRAINERS_ENDPOINT: TRAINERS_ENDPOINT };
