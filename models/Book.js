// models/Book.js
const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  publishedYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
  },
  isbn: {
    type: String,
    required: true,
    match: [/^\d{3}-\d{10}$/, "ISBN must be in the format XXX-XXXXXXXXXX"],
  },
});

module.exports = model("Book", bookSchema);
