const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().required(),
  cover_image: Joi.string().max(255),
  price: Joi.number().required().positive()
});
  


module.exports = {
  '/api/authors/publish': bookSchema,
};
