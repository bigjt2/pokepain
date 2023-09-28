const PropertiesReader = require("properties-reader");
const winston = require("winston");

var AppSecrets = function () {
  this.pokedexApiKey = null;
};

AppSecrets.prototype.init = function (propsFile) {
  const secretsFile = PropertiesReader(propsFile);
  this.pokedexApiKey = secretsFile.get("pokedexApiKey");
  if (!this.pokedexApiKey) {
    winston.error(
      `Property by the name of pokedexApiKey is expected in file: ${propsFile}`
    );
    //TODO: see if there's a clean way to kill app after this log statement. process.exit() will kill winston's logging.
  }
};

module.exports = new AppSecrets();
