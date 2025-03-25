const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
  isbn: Joi.string()
    .pattern(/^\d{3}-\d{10}$/)
    .required(),
});

const validateBook = (data) => bookSchema.validate(data);

module.exports = validateBook;
