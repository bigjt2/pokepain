const express = require("express");
const app = express();
const adminApp = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/database")();

require("./startup/expressInit")(app);
require("./startup/expressInit")(adminApp);
const routes = require("./startup/routes");
routes.routes(app);
routes.adminRoutes(adminApp);

const port = process.env.POKEDEX_API_PORT || 3000;
const adminPort = process.env.POKEDEX_ADMIN_PORT || 9000;

const server = app.listen(port, () => {
  winston.info(`Pokedex services listenening on port ${port}...`);
});

const adminServer = adminApp.listen(adminPort, () => {
  winston.info(`Pokedex Admin services listenening on port ${adminPort}...`);
})

module.exports = {server, adminServer};
