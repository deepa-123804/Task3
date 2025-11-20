const express = require('express');
const app = express();
const port = 3000;

// middleware to parse JSON request bodies
app.use(express.json());

// In-memory array of books (id, title, author)
let books = [
  { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { id: 2, title: '1984', author: 'George Orwell' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin' }
];

// helper to generate next id
function getNextId() {
  return books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
}

/**
 * GET /books
 * Return all books
 */
app.get('/books', (req, res) => {
  res.json(books);
});

/**
 * GET /books/:id
 * Return a single book by id
 */
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

/**
 * POST /books
 * Add a new book. Expect JSON body: { title: '...', author: '...' }
 */
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Missing title or author in request body' });
  }

  const newBook = { id: getNextId(), title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

/**
 * PUT /books/:id
 * Update a book by id. Accepts partial or full { title, author } in JSON body.
 */
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });

  const { title, author } = req.body;
  if (!title && !author) {
    return res.status(400).json({ error: 'Provide title or author to update' });
  }

  const updated = { ...books[bookIndex], ...(title ? { title } : {}), ...(author ? { author } : {}) };
  books[bookIndex] = updated;
  res.json(updated);
});

/**
 * DELETE /books/:id
 * Remove a book by id
 */
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });

  const removed = books.splice(bookIndex, 1)[0];
  res.json({ message: 'Book deleted', book: removed });
});

// default 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Books API listening at http://localhost:${port}`);
});
