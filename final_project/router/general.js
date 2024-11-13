const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  if(!username){
    return res.status(401).json({ message: "Username is required" });
  }
  if(!password){
    return res.status(401).json({ message: "Password is required" });
  }
  if (!isValid(username)) {
    return res
     .status(401)
     .json({ message: "Username already exists" });
  }
  users.push({ username: username, password: password });
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if(isbn < 1 || isbn > Object.values(books).length){
    return res
     .status(401)
     .json({ message: "Invalid ISBN" });
  }
  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === author;
  });

  if (!booksByAuthor || !booksByAuthor.length) {
    return res.status(404).json({ message: "No book found" });
  } else {
    return res.status(200).json(booksByAuthor);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const booksByTitle = Object.values(books).filter((book) => {
    return book.title === title;
  });

  if (!booksByTitle || !booksByTitle.length) {
    return res.status(404).json({ message: "No book found" });
  } else {
    return res.status(200).json(booksByTitle);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn < 1 || isbn > Object.values(books).length){
    return res
     .status(401)
     .json({ message: "Invalid ISBN" });
  }
  return res.status(200).json( books[isbn].review);
});

module.exports.general = public_users;
