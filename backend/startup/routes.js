const pokedex = require("../routes/pokedex");
const healthcheck = require("../routes/healthCheck");
const trainers = require("../routes/trainers");
const admin = require("../routes/admin")

const routes = function (app) {
  //Route sources
  app.use(pokedex.POKEDEX_ENDPOINT, pokedex.Router);
  app.use(healthcheck.HEALTHCHECK_ENDPOINT, healthcheck.Router);
  app.use(trainers.TRAINERS_ENDPOINT, trainers.Router);
};

const adminRoutes = function(app) {
  app.use(admin.ADMIN_ENDPOINT, admin.Router)
}

module.exports = {routes, adminRoutes};