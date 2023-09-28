const bcrypt = require("bcrypt");
const appSecrets = require("../startup/appSecrets");

module.exports = async function (req, res, next) {
  let apiKey = req.get("x-auth-apikey");

  if (!apiKey) {
    return res.status(400).send("API Key is required for this endpoint.");
  }
  const validKey = await bcrypt.compare(appSecrets.pokedexApiKey, apiKey);
  if (!validKey) return res.status(401).send("API Key is invalid.");
  next();
};
