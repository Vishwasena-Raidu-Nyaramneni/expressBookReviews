const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

//function for Books
function getAllBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) 
{
  getAllBooks()
  .then((books) => res.send(JSON.stringify(books,null,4)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
      const isbn = req.params.isbn;
      getAllBooks()
      .then((bks)=> res.send(books[isbn]))
      .catch(function(error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books with given ISBN');
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getAllBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((bks) => bks.filter((book) => book.author === author))
    .then((resultBooks) => res.send(res.send(resultBooks)))
    .catch(function(error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books with the given author');
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getAllBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((bks) => bks.filter((book) => book.title === title))
    .then((resultBooks) => res.send(res.send(resultBooks)))
    .catch(function(error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books with given title');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(JSON.stringify(books[ISBN].reviews))
});

module.exports.general = public_users;
