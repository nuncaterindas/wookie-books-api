const Joi = require('joi');

const signUpSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  author_pseudonym: Joi.string()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(6)  // Adjust the minimum password length as needed
    .required()
});
  


module.exports = {
  '/api/signup': signUpSchema,
};
