const jwt = require("jsonwebtoken");
const winston = require("winston");
const appSecrets = require("../startup/appSecrets");

module.exports = async function (req, res, next) {
  let userToken = req.get(appSecrets.authHeaderKey);

  if (!userToken) {
    return res.status(400).send("Auth Key is required for this endpoint.");
  }
  try {
    const verified = jwt.verify(userToken, appSecrets.pokedexApiKey);
    if (!verified)
      return res.status(401).send("Authentication failed on this endpoint.");
    next();
  } catch (e) {
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    winston.error(
      `Attempt to reach ${req.originalUrl} from ${ip} failed: ${e}`
    );
    res.status(400).send("Invalid token provided.");
  }
};
