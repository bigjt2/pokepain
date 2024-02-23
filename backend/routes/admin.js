const express = require("express");
const router = express.Router();

const ADMIN_ENDPOINT = "/admin";

router.get("/", async (req, res) => {
    res.status(200).send("Hi!");
});

module.exports = { Router: router, ADMIN_ENDPOINT: ADMIN_ENDPOINT };