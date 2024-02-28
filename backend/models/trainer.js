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
    roles: {
      type: [String],
      default: ["trainer"],
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
    schema_version: {
      type: Number,
      default: 1,
    },
  })
);

module.exports = Trainer;
