const winston = require("winston");

module.exports = (role) => {
  return (req, res, next) => {
    if (!role) {
      winston.error(
        "Must specify a role when calling the verifyRole middleware function."
      );
      return res
        .status(500)
        .send("Backend server error. Check logs for junky code.");
    }

    trainer = req.trainer;
    if (!trainer) {
      return res
        .status(400)
        .send({ message: "No trainer info pulled out of request." });
    }
    if (!trainer.roles.includes(role)) {
      return res.status(403).send(`Role [${role}] required`);
    }
    next();
  };
};
