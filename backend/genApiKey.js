const bcrypt = require("bcrypt");

const rawKey = "";

const genApiKey = async () => {
  const salt = await bcrypt.genSalt(10);
  const apiKey = await bcrypt.hash(rawKey, salt);
  console.log("API key: " + apiKey);
};

genApiKey();
