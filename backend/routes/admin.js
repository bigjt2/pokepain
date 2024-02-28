const express = require("express");
const router = express.Router();
const winston = require("winston");
const bcrypt = require("bcrypt");
const verifyAccess = require("../middleware/verifyAccessToken");
const verifyRole = require("../middleware/verifyRole");
const Trainer = require("../models/trainer");
const RefreshToken = require("../models/refreshToken");
const createCookie = require("../auth/createCookie");
const { getPokedex, getPokedexEntries } = require("../service/pokedexService");

const ADMIN_ENDPOINT = "/admin";

//Currently this API runs on a separate port from the main pokedex service. And access is meant to be locked to
//IP address on external platform. On AWS, this is done with a separate target group. There are currently no further authentication
//protections to get to this API outside of requiring an 'admin' role. If the IP protection becomes moot different
//safegaurds will need put in place.

//lean() pulls a plain JSON object for the record, which avoids path errors on added paths in schema updates
//hydrate() will convert a JSON object back into a model. This will fill in any defaults, as well.

//Allows the creation of an initial admin user. Requires login of an existing pokedex user first.
router.post("/elevate", [verifyAccess], async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer.trainerId).lean();
    if (!trainer)
      return res
        .status(404)
        .send("No trainer found with provided trainer name.");
    const trainerModel = Trainer.hydrate(trainer);
    trainerModel.roles.push("admin");
    await trainerModel.save();
    createCookie(trainerModel, req);

    res
      .status(200)
      .send({ trainer: trainerModel.username, roles: trainerModel.roles });
  } catch (error) {
    winston.error(error);
    res.status(500).send("Backend server error. Check logs for junky code.");
  }
});

router.get(
  "/trainers",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    const trainers = await Trainer.find();
    res.status(200).send(trainers);
  }
);

router.get(
  "/trainers/:id/pokemons",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    try {
      const pokedex = await getPokedex(req.params.id);
      if (!pokedex) {
        return res
          .status(400)
          .send("Empty pokedex or none found associated with that id.");
      }
      let responseBody = await getPokedexEntries(pokedex);
      res.send(responseBody);
    } catch (e) {
      if (e.kind === "ObjectId") {
        return res.status(400).send("Invalid trainer ID.");
      }
      winston.error(e);
      res.status(500).send("Backend server error. Check logs for junky code.");
    }
  }
);

router.post(
  "/trainers/:id/update",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    const trainerId = req.params.id;

    try {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res
          .status(400)
          .send(`Problem retreiving trainer with given ID.`);
      }

      const password = req.body.password;
      const roles = req.body.roles;
      const status = req.body.status;

      let updateStr = "Updated: ";
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPass = await bcrypt.hash(req.body.password, salt);
        trainer.password = encryptedPass;
        updateStr += " password ";
      }
      if (roles) {
        trainer.roles = roles;
        updateStr += " roles ";
      }
      if (status) {
        trainer.status = status;
        updateStr += " status ";
      }
      await trainer.save();
      return res.status(200).send(updateStr);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(400).send("Invalid trainer ID.");
      }
      winston.error(`Trainer update failed with: ${err}`);
      return res.status(500).send("Update failed -- see logs.");
    }
  }
);

router.delete(
  "/trainers/:id",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    try {
      const trainer = await Trainer.findById(req.params.id);
      if (!trainer)
        return res.status(404).send("No trainer found with that ID.");
      winston.info(`Deleting the following trainer: ${trainer}`);
      const pokedex = await getPokedex(req.params.id);
      if (pokedex) {
        pokedex.delete().catch((err) => {
          winston.error(
            `Could not delete associated pokedex, error result: ${err}`
          );
        });
      }
      trainer.delete();
      winston.info("Trainer deleted.");
      res.status(202).send("Trainer deleted.");
    } catch (e) {
      if (e.kind === "ObjectId") {
        return res.status(400).send("Invalid trainer ID.");
      }
      winston.error(e);
      res.status(500).send("Backend server error. Check logs for junky code.");
    }
  }
);

router.post(
  "/refreshTokens/clear",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    winston.info("Attempting token refresh deletion.");
    RefreshToken.deleteMany()
      .then((results) => {
        winston.info(`${results?.deletedCount} tokens deleted successfully.`);
        return res
          .status(200)
          .send(
            "Refresh tokens cleared. Best to now log out and log back in to avoid problems on next refresh."
          );
      })
      .catch((err) => {
        winston.error(`Token clearing failed with following: ${error}`);
        return res.status(500).send("Clearing tokens failed -- see logs.");
      });
  }
);

router.post(
  "/schema-migrate/",
  [verifyAccess, verifyRole("admin")],
  async (req, res) => {
    winston.info("Attempting schema migration.");
    await migrate()
      .then(() => {
        winston.info("Migration complete.");
        return res.status(200).send("Migration complete.");
      })
      .catch((error) => {
        winston.error(`Migration failed with following: ${error}`);
        return res.status(500).send("Migration failed -- see logs.");
      });
  }
);

async function migrate() {
  const results = await Trainer.find().lean();
  for (trainer of results) {
    if (!trainer.schema_version) {
      winston.info(`Migration Candidate: ${trainer.name}`);
      const trainerModel = Trainer.hydrate(trainer);
      await trainerModel.save();
      winston.info("Record updated.");
    }
  }
}

module.exports = { Router: router, ADMIN_ENDPOINT: ADMIN_ENDPOINT };
