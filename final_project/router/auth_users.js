const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

  const data = req.body

  if (!(data.name && data.password)) return res.status(403).send('Nombre y contrasenas obligatorios, verifica los datos')

  let filtered_users = users.filter((user) => user.name === data.name);

  if (filtered_users.length <= 0) return res.status(403).send('El usuario no existe');

  if (filtered_users.password === data.password) return res.status(403).send('Contrsena incorecta');

  // Generate JWT access token
  let accessToken = jwt.sign({
    user: data
  }, 'access', { expiresIn: 60 * 30 });

  // Store access token in session
  req.session.authorization = {
    accessToken
  }

  return res.status(200).json({ message: "User successfully logged in", accessToken });


});

//registerer users
regd_users.post("/register", (req, res) => {
  const data = req.body
  if (!(data.name && data.password)) return res.status(403).send('Nombre y contrasenas obligatorios, verifica los datos')

  let filtered_users = users.filter((user) => user.name === data.name);

  if (filtered_users.length > 0) return res.status(403).send('El nombre de usuario ya existe')

  users.push(data)
  return res.status(300).json({ new_user: data });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const user = req.user.user 
  const isbn = req.params.isbn
  const reviewForm = req.body.comment


  const isbnBooks = Object.keys(books);

  for (let isbnB of isbnBooks) {
    
    if (isbnB == isbn) {

      let reviewUsers = books[isbnB].reviews

      let verifyUserReview = Object.keys(reviewUsers).filter((review) => review === user.name);

      if (verifyUserReview > 0) {

        for (const review in reviewUsers) {

          if (review === user.name) {


            books[isbnB].eviews[review] = { comment: reviewForm }

          }

        }
      } else {
        newReview = { comment: reviewForm }
        books[isbnB].reviews[user.name] = newReview
      }

    }
  }


  return res.status(300).json(books);
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const user = req.user.user // Datos del usuario conectado
  const isbn = req.params.isbn // Obteniendo el isbn del

  let data = {} // objeto de reviews restantes



  const isbnBooks = Object.keys(books); // array de isbn

  for (let isbnB of isbnBooks) {
    
    if (isbnB == isbn) { //para modificar solo el reviews correspondiente del isbn

      let reviewUsers = books[isbnB].reviews // obteniendo los reviews

   

      let verifyUserReview = Object.keys(reviewUsers).filter((review) => review !== user.name);// Obteniendo los reviews diferentes del usuario conectado

      if (verifyUserReview.length > 0) {

        for (let i = 0; i < verifyUserReview.length; i++) {


          data[verifyUserReview[i]] = reviewUsers[verifyUserReview[i]] 


        }

        books[isbnB].reviews = data


      } else {

        books[isbnB].reviews = {}

      }


    }
  }


  return res.status(200).json(books);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
