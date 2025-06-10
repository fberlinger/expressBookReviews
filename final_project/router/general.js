const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

    get_books.then(() => console.log("Get-books promise resolved."));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const get_books_by_isbn = new Promise ((resolve, reject) => {
    const isbn = req.params.isbn;
    let booksIsbn = books[isbn];

    if (booksIsbn) {
        resolve(res.send(JSON.stringify({booksIsbn}, null, 2)));
    } else {
        resolve(res.json({message: "No books found for this ISBN."}));
    }
  });
  
  get_books_by_isbn.then(() => console.log("Get-books-by-ISBN promise resolved."));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const get_books_by_author = new Promise ((resolve, reject) => {
        const author = req.params.author;
        let booksAuthor = [];

        for (const key in books) {
            if (books[key]["author"] == author) {
                booksAuthor.push(books[key]);
            }
        }

        if (booksAuthor.length === 0) {
            resolve(res.json({message: "No books found for this Author."}));
        } else {
            resolve(res.send(JSON.stringify({booksAuthor}, null, 2)));
        }
    });

    get_books_by_author.then(() => console.log("Get-books-by-Author promise resolved."));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const get_books_by_title = new Promise ((resolve, reject) => {
        const title = req.params.title;
        let booksTitle = [];
    
        for (const key in books) {
        if (books[key]["title"] == title) {
            booksTitle.push(books[key]);
        }
        }
    
        if (booksTitle.length === 0) {
        resolve(res.json({message: "No books found for this Title."}));
        } else {
        resolve(res.send(JSON.stringify({booksTitle}, null, 2)));
        }
    });

    get_books_by_title.then(() => console.log("Get-books-by-Title promise resolved."));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksIsbn = books[isbn];
  
    if (typeof booksIsbn === "undefined") {
      res.json({message: "No books found for this ISBN."});
    } else {
      let reviews = booksIsbn["reviews"];
      res.send(JSON.stringify({reviews}, null, 2));
    }
});

module.exports.general = public_users;
