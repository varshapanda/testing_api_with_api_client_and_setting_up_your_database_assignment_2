const express = require('express');
const bodyParser = require('body-parser');
const books = require('./data.json');

const app = express();
app.use(bodyParser.json());

// let books = [];

// Create a new book
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;

    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All book fields are required.' });
    }
     // Validate data types
     if (typeof book_id !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for book_id. It should be a string.' });
    }
    
    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for title. It should be a string.' });
    }
    
    if (typeof author !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for author. It should be a string.' });
    }
    
    if (typeof genre !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for genre. It should be a string.' });
    }

    // Validate year and copies for non-negative integers
    if (typeof year !== 'number' || year < 0 || !Number.isInteger(year)) {
        return res.status(400).json({ error: 'year must be a non-negative integer.' });
    }
    
    if (typeof copies !== 'number' || copies < 0 || !Number.isInteger(copies)) {
        return res.status(400).json({ error: 'copies must be a non-negative integer.' });
    }
    // Validate unique book_id
    if (books.some(book => book.book_id === book_id)) {
        return res.status(400).json({ error: 'Book with this ID already exists.' });
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    res.status(200).json(book);
});

// Update a book
app.put('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    const { title, author, genre, year, copies } = req.body;

    // Validate optional fields if they are being updated
    if (title !== undefined && typeof title !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for title.' });
    }

    if (author !== undefined && typeof author !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for author.' });
    }

    if (genre !== undefined && typeof genre !== 'string') {
        return res.status(400).json({ error: 'Invalid data type for genre.' });
    }

    if (year !== undefined) {
        if (typeof year !== 'number' || year < 0 || !Number.isInteger(year)) {
            return res.status(400).json({ error: 'year must be a non-negative integer.' });
        }
    }

    if (copies !== undefined) {
        if (typeof copies !== 'number' || copies < 0 || !Number.isInteger(copies)) {
            return res.status(400).json({ error: 'copies must be a non-negative integer.' });
        }
    }

    const updatedBook = { ...books[bookIndex], ...req.body };
    books[bookIndex] = updatedBook;

    res.status(200).json(updatedBook);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted successfully.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
