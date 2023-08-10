const express = require("express");
const cors = require("cors");
const test = require("../routes/test");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/test", test);
};
