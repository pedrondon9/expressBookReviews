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

  if (!(data.name && data.password)) return res.status(300).send('Nombre y contrasenas obligatorios, verifica los datos')

  let filtered_users = users.filter((user) => user.name === data.name);

  if (filtered_users.length <= 0) return res.status(300).send('El usuario no existe');

  if (filtered_users.password === data.password) return res.status(300).send('Contrsena incorecta');

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
  if (!(data.name && data.password)) return res.status(300).send('Nombre y contrasenas obligatorios, verifica los datos')

  let filtered_users = users.filter((user) => user.name === data.name);

  if (filtered_users.length > 0) return res.status(300).send('El nombre de usuario ya existe')

  users.push(data)
  return res.status(300).json({ new_user: data });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log(req.body)
  console.log(req.user)
  const user = req.user.user // Set authenticated user data on the request object
  const isbn = req.params.isbn
  const reviewForm = req.body.comment


  const isbnBooks = Object.keys(books);
  for (let isbnB of isbnBooks) {
    console.log(`${isbnB}: ${books[isbnB]}`);
    if (isbnB == isbn) {

      let reviewUsers = books[isbnB].reviews

      let verifyUserReview = Object.keys(reviewUsers).filter((review) => review.author === user.name);

      if (verifyUserReview > 0 ) {

        for (const review in reviewUsers) {

          if (review === user.name) {


            books[isbnB].eviews[review] = { name: user.name, comment: reviewForm }

          }

        }
      } else {
        newReview = {name:user.name,comment:reviewForm}
        books[isbnB].reviews[user.name] = newReview
      }

    }
  }


  return res.status(300).json(books);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
