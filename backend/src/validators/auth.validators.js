const Joi = require("joi");

const googleCallbackSchema = Joi.object({
  code: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
});

module.exports = { googleCallbackSchema };
