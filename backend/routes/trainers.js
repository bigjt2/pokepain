const express = require("express");
const router = express.Router();
const winston = require("winston");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer");
const RefreshToken = require("../models/refreshToken");
const createCookie = require("../auth/createCookie");

const TRAINERS_ENDPOINT = "/api/trainers";

router.post("/login", async (req, res) => {
  const authHeader = req.get("authorization");
  if (!authHeader)
    return res.status(401).send("No authorization header found!");

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  try {
    const trainer = await Trainer.findOne({ name: username });
    if (!trainer)
      return res
        .status(404)
        .send("No trainer found with provided trainer name.");
    if (trainer.status !== "active")
      return res
        .status(404)
        .send(
          `You are locked from using the app due to having the following status: ${trainer.status}.`
        );

    if (!password) return res.status(401).send("Password required.");
    const success = await bcrypt.compare(password, trainer.password);
    if (!success)
      return res
        .status(401)
        .send("Password is incorrect. Wake up earlier next time!");

    let dbRefreshToken = await RefreshToken.createToken(trainer);

    createCookie(trainer, req);

    res.status(200).send({ trainer: username, refreshToken: dbRefreshToken });
  } catch (error) {
    winston.error(error);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.post("/logout", async (req, res) => {
  try {
    let accessToken = jwt.decode(req.session.token);
    await RefreshToken.deleteOne({ trainer: accessToken.trainer.trainerId });

    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const exists = (await Trainer.count({ name: req.body.trainerName })) > 0;
    if (exists)
      return res.status(303).send("Trainer already registed with that name.");
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(req.body.password, salt);
    const trainer = new Trainer({
      name: req.body.trainerName,
      password: encryptedPass,
      roles: ["trainer"],
      status: "active",
    });
    await trainer.save();

    res.status(201).send({ trainerName: trainer.name, encryptedPass });
  } catch (e) {
    winston.error(e);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.post("/refreshToken", async (req, res) => {
  const { refreshToken: token } = req.body;

  if (token == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: token });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();
      //Destroy session along with cookies.
      req.session = null;

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let accessToken = jwt.decode(req.session.token);
    createCookie(accessToken.trainer, req);

    return res.status(200).json({
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

module.exports = { Router: router, TRAINERS_ENDPOINT: TRAINERS_ENDPOINT };
