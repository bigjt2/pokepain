const PropertiesReader = require("properties-reader");
const winston = require("winston");

var AppSecrets = function () {
  this.pokedexApiKey = null;
  this.authHeaderKey = null;
};

AppSecrets.prototype.init = function (propsFile) {
  const secretsFile = PropertiesReader(propsFile);
  this.pokedexApiKey = secretsFile.get("pokedexApiKey");
  this.authHeaderKey = secretsFile.get("authHeaderKey");
  if (!this.pokedexApiKey) {
    winston.error(
      `Property by the name of pokedexApiKey is expected in file: ${propsFile}`
    );
    //TODO: see if there's a clean way to kill app after this log statement. process.exit() will kill winston's logging.
  }
  if (!this.authHeaderKey) {
    winston.error(
      `Property by the name of authHeaderKey is expected in file: ${propsFile}`
    );
  }
};

module.exports = new AppSecrets();
