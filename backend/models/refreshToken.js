const mongoose = require("mongoose");
const authConfig = require("../props/auth_config");
const { v4: uuidv4 } = require("uuid");

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (trainer) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + authConfig.jwtRefreshExpiration
  );

  let refreshTokenId = uuidv4();

  let object = new this({
    token: refreshTokenId,
    trainer: trainer._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(object);

  let refreshToken = await object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
