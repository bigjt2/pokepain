const express = require("express");
const pokedex = require("../routes/pokedex");
const healthcheck = require("../routes/healthCheck");

module.exports = function (app) {
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use(express.json({ limit: "1mb" }));
  //Open CORS, trusting all origins, also had to add my custom apikey header
  //(the CORS NPM library didn't work on AWS going between load balancers)
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Apikey"
    );
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
  });
  app.use(pokedex.POKEDEX_ENDPOINT, pokedex.Router);
  app.use(healthcheck.HEALTHCHECK_ENDPOINT, healthcheck.Router);
};
