const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')




//////////////// ASYNC AWAIT ////////////

// get all books
const getBook = async () =>{
  try {

    const getbooks = await axios.get('http://localhost:5000/')

    if (getbooks.data.status === "ok") {

      console.log(getbooks.data.books)
      
    } else {

      console.log('vuelva a lanzar la solicitud')
    }
    
  } catch (error) {

    console.error('Error posting data:', error);
    
  }
}

//getBook()

// get books by ISBN
const getBookISBN = async () =>{
  try {

    const getbooksisbn = await axios.get('http://localhost:5000/isbn/2')

    if (getbooksisbn.data.status === "ok") {

      console.log(getbooksisbn.data.data)
      
    } else {

      console.log('vuelva a lanzar la solicitud')
    }
    
  } catch (error) {

    console.error('Error posting data:', error);
    
  }
}

//getBookISBN()

// get books by Author
const getBookAuthor = async () =>{
  try {

    const getbooksauthor = await axios.get('http://localhost:5000/author/Dante Alighieri')

    if (getbooksauthor.data.status === "ok") {

      console.log(getbooksauthor.data.data)
      
    } else {

      console.log('vuelva a lanzar la solicitud')
    }
    
  } catch (error) {

    console.error('Error posting data:', error);
    
  }
}

//getBookAuthor()


//get books by Title
const getBookTitle = async () =>{
  try {

    const getbookstitle = await axios.get('http://localhost:5000/title/The Book Of Job')

    if (getbookstitle.data.status === "ok") {

      console.log(getbookstitle.data.data)
      
    } else {

      console.log('vuelva a lanzar la solicitud')
    }
    
  } catch (error) {

    console.error('Error posting data:', error);
    
  }
}

//getBookTitle()

/////////////////////////////////////////



public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(200).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({ books,status:"ok" }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  
  let data = {}

  const isbnBooks = Object.keys(books);
  for (let isbnB of isbnBooks) {
    
    if (isbnB == isbn) {
      data = books[isbnB]
    }
  }

  return res.status(200).json({data,status:"ok"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author

  let data = []


  const isbnBooks = Object.keys(books);
  for (let isbnB of isbnBooks) {
    
    if (books[isbnB].author == author) {
      data.push(books[isbnB])
    }
  }

  return res.status(200).json({data, status:"ok"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  
  const title = req.params.title

  let data = []

  const isbnBooks = Object.keys(books);
  for (let isbnB of isbnBooks) {
    
    if (books[isbnB].title == title) {
      data.push(books[isbnB])
    }
  }

  return res.status(200).json({data, status:"ok"});

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here

  const isbn = req.params.isbn
  let data = {}

  const isbnBooks = Object.keys(books);
  for (let isbnB of isbnBooks) {
    console.log(`${isbnB}: ${books[isbnB]}`);
    if (isbnB == isbn) {
      data = books[isbnB].reviews
    }
  }

  return res.status(200).json(data);
});


module.exports.general = public_users;
