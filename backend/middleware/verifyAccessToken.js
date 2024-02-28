const jwt = require("jsonwebtoken");
const winston = require("winston");
const authConfig = require("../props/auth_config");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  } else {
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    winston.error(
      `Attempt to reach ${req.originalUrl} from ${ip} failed: ${e}`
    );
    res.status(400).send("Invalid token provided.");
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

module.exports = (req, res, next) => {
  //pulls token from cookie.
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, authConfig.jwtSecret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.trainer = decoded.trainer;
    next();
  });
};
