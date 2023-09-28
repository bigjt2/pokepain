const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();
const appSecrets = require("./startup/appSecrets");
appSecrets.init("pokedex_secrets.properties");

const port = process.env.POKEDEX_API_PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listenening on port ${port}...`)
);

module.exports = server;
