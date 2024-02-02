const express = require("express");
const router = express.Router();
const winston = require("winston");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer");
const RefreshToken = require("../models/refreshToken");
const authConfig = require("../props/auth_config");

const TRAINERS_ENDPOINT = "/api/trainers";

const createCookie = (trainerId, req, res) => {
  //create new access token and overwrite in cookie
  let data = {
    trainerId: trainerId,
  };
  const accessToken = jwt.sign(data, authConfig.jwtSecret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: authConfig.jwtAccessExpiration,
  });

  req.session.token = accessToken;
};

router.post("/login", async (req, res) => {
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

  let dbRefreshToken = await RefreshToken.createToken(trainer);

  createCookie(trainer._id, req, res);

  res.status(200).send({ trainer: username, refreshToken: dbRefreshToken });
});

router.post("/logout", async (req, res) => {
  try {
    let accessToken = jwt.decode(req.session.token);
    await RefreshToken.deleteOne({ trainer: accessToken.trainerId });

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
    createCookie(accessToken.trainerId, req);

    return res.status(200).json({
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

module.exports = { Router: router, TRAINERS_ENDPOINT: TRAINERS_ENDPOINT };
