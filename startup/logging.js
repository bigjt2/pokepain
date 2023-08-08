const winston = require("winston");

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: "./logs/poke-exceptions.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex; //unhandled promise rejections -- winston handleExceptions will not catch this.
  });
  winston.add(new winston.transports.File({ filename: "./logs/poke-log.log" }));
};
