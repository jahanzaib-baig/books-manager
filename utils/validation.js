const Joi = require("joi");
const mongoose = require("mongoose");

const bookSchema = Joi.object({
  _id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional(),
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

const validateBook = (data) =>
  bookSchema.validate(data, { stripUnknown: true });

module.exports = validateBook;
