const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Importa Axios
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Verifica se username e password sono forniti
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  // Verifica se l'utente esiste già
  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  
  // Aggiungi l'utente all'elenco degli utenti  
  users.push({username, password});
  // Invia una risposta di successo
  res.status(201).json({message: "User created"});

  

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    // Convertire l'oggetto books in un array di oggetti libro
    const booksArray = Object.keys(books).map(key => ({
      id: key,
      ...books[key]
  }));
  res.status(200).send(JSON.stringify(booksArray, null, 2));

});

// use axios asynch

async function getBooks() {
  try {
      const response = await axios.get('http://localhost:5000/');
      console.log(response.data);
  } catch (error) {
      console.error('Error fetching books:', error);
  }
}

getBooks();


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Recuperare l'ISBN dai parametri della richiesta
    const isbn = req.params.isbn;

    // Trovare il libro corrispondente
    const book = books[isbn];

    if (book) {
        // Se il libro è stato trovato, rispondere con i dettagli del libro
        res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        // Se il libro non è stato trovato, rispondere con un messaggio di errore
        res.status(404).json({message: "Book not found"});
    }
 });

 // Get book by ISBN using axios
  async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching book:', error);
    }
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Write your code here
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    
    // Filtra i libri in base all'autore
    const booksByAuthor = bookKeys.filter(key => books[key].author.toLowerCase() === author.toLowerCase()).map(key => ({
        id: key,
        ...books[key]
    }));

    if (booksByAuthor.length > 0) {
        // Se sono stati trovati libri, rispondere con l'elenco dei libri
        res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
    } else {
        // Se non sono stati trovati libri, rispondere con un messaggio di errore
        res.status(404).json({message: "No books found for this author"});
    }

});

// Get book details based on author using axios
async function getBookByAuthor(author) {
  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(response.data);
  } catch (error) {
      console.error('Error fetching book:', error);
  }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  
  // Filtra i libri in base al titolo
  const booksByTitle = bookKeys.filter(key => books[key].title.toLowerCase() === title.toLowerCase()).map(key => ({
      id: key,
      ...books[key]
  }));

  if (booksByTitle.length > 0) {
      // Se sono stati trovati libri, rispondere con l'elenco dei libri
      res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } else {
      // Se non sono stati trovati libri, rispondere con un messaggio di errore
      res.status(404).json({message: "No books found for this title"});
  }
});

// Get all books based on title using axios
async function getBookByTitle(title) {
  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(response.data);
  } catch (error) {
      console.error('Error fetching book:', error);
  }
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      // Se il libro è stato trovato, rispondere con i dettagli del libro
      res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
      // Se il libro non è stato trovato, rispondere con un messaggio di errore
      res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
