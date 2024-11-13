const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  console.log(userswithsamename);
  // Return false if any user with the same username is found, otherwise true
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).json({ accessToken, username });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(isbn < 1 || isbn > Object.values(books).length){
    return res
     .status(401)
     .json({ message: "Invalid ISBN" });
  }
  const reviewCotent = req.body["review"];
  if(!reviewCotent){
    return res
       .status(401)
       .json({ message: "Missing review" });
  }

  const username = req.user.username;
  books[isbn].reviews = {
    ...books[isbn].reviews,
    [username]: reviewCotent,
  };
  return res.status(200).json({ message: "Review added" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params["isbn"];
  if(isbn < 1 || isbn > Object.values(books).length){
    return res
     .status(401)
     .json({ message: "Invalid ISBN" });
  }

  delete books[isbn]["reviews"][username];
  return res.status(200).json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
