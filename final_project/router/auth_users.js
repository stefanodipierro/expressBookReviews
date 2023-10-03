// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const jwtSecret = 'your_jwt_secret';  // Scegli una chiave segreta per firmare i tuoi JWT

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    
}

const authenticatedUser = (username,password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

// only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Verifica se username e password sono forniti
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Verifica se l'username esiste e la password corrisponde
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Se l'utente è valido, crea un JWT e invialo al client
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } else {
        // Se le credenziali non sono valide, rispondi con un messaggio di errore
        return res.status(401).json({message: "Invalid credentials"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // Recuperare l'ISBN dai parametri della richiesta
    const isbn = req.params.isbn;
    // Estrai la recensione dalla query della richiesta
    const review = req.query.review;
    // Recuperare il token dalla richiesta
    const user = req.user;
    // Book
    const book = books[isbn];
    // Verifica se il libro esiste
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }
    // Verifica se la recensione è fornita
    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }
    // Aggiungi la recensione al libro
    book.reviews[user.username] = review;
    // Invia una risposta di successo
    return res.status(200).json({message: "Review added successfully"});


});

// Elimina una recensione di un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Estrai l'ISBN dalla richiesta
  const isbn = req.params.isbn;

  // Estrai l'username dall'utente autenticato (assumendo che tu abbia già un meccanismo per farlo)
  const username = req.user.username;  // Assicurati che questo corrisponda a come hai impostato l'username nel tuo middleware di autenticazione

  // Ottieni il libro specificato dall'ISBN
  const book = books[isbn];
  if (!book) {
      // Se il libro non esiste, rispondi con un errore
      return res.status(404).json({message: "Book not found"});
  }

  // Controlla se l'utente ha lasciato una recensione
  if (!book.reviews[username]) {
      // Se l'utente non ha lasciato una recensione, rispondi con un errore
      return res.status(404).json({message: "Review not found"});
  }

  // Elimina la recensione dell'utente
  delete book.reviews[username];

  // Rispondi con un messaggio di successo
  res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
