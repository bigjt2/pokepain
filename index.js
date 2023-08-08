const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);

const port = 3000;
const server = app.listen(port, () =>
  winston.info(`Listenening on port ${port}...`)
);

module.exports = server;
