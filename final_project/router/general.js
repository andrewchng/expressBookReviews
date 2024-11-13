const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  if (!username) {
    return res.status(401).json({ message: "Username is required" });
  }
  if (!password) {
    return res.status(401).json({ message: "Password is required" });
  }
  if (!isValid(username)) {
    return res.status(401).json({ message: "Username already exists" });
  }
  users.push({ username: username, password: password });
  //Write your code here
  return res.status(200).json({ message: "User Registered!" });
});

function getbooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  return res.status(200).json(await getbooks());
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  if (isbn < 1 || isbn > Object.values(books).length) {
    return res.status(401).json({ message: "Invalid ISBN" });
  }

  try {
    const book = await getbookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(401).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const book = await getbookByAuthor(author);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

function getbookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];

    if (!book) {
      reject("No Book found");
    }

    resolve(books[isbn]);
  });
}

function getbookByAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter((book) => {
      return book.author === author;
    });
    if (!booksByAuthor || !booksByAuthor.length) {
      reject({ message: "No book found" });
    }
    resolve(booksByAuthor);
  });
}
function getbookByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter((book) => {
      return book.title === title;
    });
    if (!booksByTitle || !booksByTitle.length) {
      reject({ message: "No book found" });
    }
    resolve(booksByTitle);
  });
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const book = await getbookByTitle(title);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn < 1 || isbn > Object.values(books).length) {
    return res.status(401).json({ message: "Invalid ISBN" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
