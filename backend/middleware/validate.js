const Joi = require("joi");

const pokemonArryElement = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  url: Joi.string().min(0).max(200).required(),
});

const ability = Joi.object({
  ability: pokemonArryElement,
}).unknown(true);

const move = Joi.object({
  move: pokemonArryElement,
}).unknown(true);

exports.validateIdParam = async (req, res, next) => {
  const schema = Joi.number().greater(0);
  const valid = schema.validate(req.params.id);
  if (valid.error) {
    return res.status(400).send("ID param must be a number greater than zero.");
  }
  next();
};

exports.validatePokePost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    id: Joi.number().greater(0).required(),
    abilities: Joi.array().items(ability),
    moves: Joi.array().items(move),
  }).unknown(true);

  const valid = schema.validate(req.body);
  if (valid.error) {
    return res.status(400).send(valid.error.details[0].message);
  }
  next();
};
