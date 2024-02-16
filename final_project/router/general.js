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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let result_authors = [];
  for(const [key, values] of Object.entries(books))
  {
    const book = Object.entries(values);
    for(let i = 0; i < book.length ; i++){
        if(book[i][0] == 'author' && book[i][1] == req.params.author){
            result_authors.push(books[key]);
            }
        }
    }
    if(result_authors.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(JSON.stringify(result_authors,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let result_title = [];
    for(const [key, values] of Object.entries(books))
    {
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              result_title.push(books[key]);
              }
          }
      }
      if(result_title.length == 0){
          return res.status(300).json({message: "Title not found"});
      }
      res.send(JSON.stringify(result_title,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(JSON.stringify(books[ISBN].reviews))
});

module.exports.general = public_users;
