const express = require("express");
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

router.post("/book", createBook);
router.get("/books", getAllBooks);
router.get("/book/:id", getBookById);
router.put("/book/:id", updateBook);
router.delete("/book/:id", deleteBook);

module.exports = router;
