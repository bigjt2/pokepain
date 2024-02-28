const jwt = require("jsonwebtoken");
const authConfig = require("../props/auth_config");

module.exports = (trainer, req) => {
  //create new access token and overwrite in cookie
  let data = {
    trainer: {
      trainerId: trainer._id,
      name: trainer.name,
      roles: trainer.roles,
    },
  };
  const accessToken = jwt.sign(data, authConfig.jwtSecret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: authConfig.jwtAccessExpiration,
  });

  req.session.token = accessToken;
};
