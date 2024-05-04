const express = require("express");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const Ajv = require("ajv");
const bookSchemaPath = "/mnt/c/Users/Luke/Downloads/express-bookstore/express-bookstore/schema/bookSchema.json";
const bookSchema = require(bookSchemaPath);


const router = new express.Router();
const ajv = new Ajv();

// Validation middleware for book data
const validateBook = asyncHandler(async (req, res, next) => {
  const valid = ajv.validate(bookSchema, req.body);
  if (!valid) {
    return res.status(400).json({ errors: ajv.errors });
  }
  next();
});

/** GET /books => { books: [book, ...] } */
router.get("/", asyncHandler(async (req, res, next) => {
  const books = await Book.findAll(req.query);
  return res.json({ books });
}));

/** GET /books/:id => { book: book } */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findOne(req.params.id);
  return res.json({ book });
}));

/** POST /books => { book: newBook } */
router.post("/", validateBook, asyncHandler(async (req, res, next) => {
  const book = await Book.create(req.body);
  return res.status(201).json({ book });
}));

/** PUT /books/:isbn => { book: updatedBook } */
router.put("/:isbn", validateBook, asyncHandler(async (req, res, next) => {
  const book = await Book.update(req.params.isbn, req.body);
  return res.json({ book });
}));

/** DELETE /books/:isbn => { message: "Book deleted" } */
router.delete("/:isbn", asyncHandler(async (req, res, next) => {
  await Book.remove(req.params.isbn);
  return res.json({ message: "Book deleted" });
}));

module.exports = router;
