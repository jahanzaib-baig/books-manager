const Book = require("../models/Book");
const validateBook = require("../utils/validation");

// Utility function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create or Update Book
const saveBook = asyncHandler(async (req, res, isUpdate = false) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let book;
  if (isUpdate) {
    book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
  } else {
    book = new Book(req.body);
    await book.save();
  }

  res.status(isUpdate ? 200 : 201).json(book);
});

// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
  const {
    search,
    author,
    title,
    isbn,
    publishedYear,
    page = 1,
    limit = 10,
    sortBy = "title",
    order = "asc",
  } = req.query;

  // Convert pagination values to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Build filter query dynamically based on request parameters
  let filterQuery = {};

  if (search) {
    filterQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { isbn: { $regex: search, $options: "i" } },
      { publishedYear: { $regex: search, $options: "i" } },
    ];
  }

  if (author) filterQuery.author = { $regex: author, $options: "i" };
  if (title) filterQuery.title = { $regex: title, $options: "i" };
  if (isbn) filterQuery.isbn = isbn; // Exact match for ISBN
  if (publishedYear) filterQuery.publishedYear = publishedYear;

  // Sorting (default is ascending order)
  const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };

  // Fetch books with filters, pagination, and sorting
  const books = await Book.find(filterQuery)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber);

  // Count total books matching query
  const totalBooks = await Book.countDocuments(filterQuery);

  res.json({
    totalBooks,
    totalPages: Math.ceil(totalBooks / limitNumber),
    currentPage: pageNumber,
    books,
  });
});

// Get a single book by ID
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// Delete a book by ID
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted successfully" });
});

// Export handlers
module.exports = {
  createBook: (req, res, next) => saveBook(req, res, false),
  updateBook: (req, res, next) => saveBook(req, res, true),
  getAllBooks,
  getBookById,
  deleteBook,
};
