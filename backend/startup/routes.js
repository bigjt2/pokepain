const express = require("express");
const cookieSession = require("cookie-session");
const authConfig = require("../props/auth_config");
const corsOrigins = require("../props/cors_config_origins");
const pokedex = require("../routes/pokedex");
const healthcheck = require("../routes/healthCheck");
const trainers = require("../routes/trainers");

module.exports = function (app) {
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(express.json({ limit: "1mb" }));

  //(the CORS NPM library didn't work on AWS going between load balancers)
  app.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (corsOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Apikey, Authorization"
    );

    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true"); //cross-origin cookies
    next();
  });

  //Cookie Setup
  app.use(
    cookieSession({
      name: "pokedex-session",
      keys: [authConfig.cookieSecret],
      httpOnly: true,
    })
  );

  //Route sources
  app.use(pokedex.POKEDEX_ENDPOINT, pokedex.Router);
  app.use(healthcheck.HEALTHCHECK_ENDPOINT, healthcheck.Router);
  app.use(trainers.TRAINERS_ENDPOINT, trainers.Router);
};
