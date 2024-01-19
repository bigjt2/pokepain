const mongoose = require("mongoose");

const Trainer = mongoose.model(
  "Trainer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

module.exports = Trainer;
