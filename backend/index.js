const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();

//TODO: environment variable
const port = 3000;
const server = app.listen(port, () =>
  winston.info(`Listenening on port ${port}...`)
);

module.exports = server;
