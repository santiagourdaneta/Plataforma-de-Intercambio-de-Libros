// backend/routes/bookRoutes.js
const express = require('express');
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
  getOtherUsersBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Aplica el middleware 'protect' a todas las rutas que requieren autenticación.
// Cualquier solicitud a estas rutas pasará primero por 'protect'.
router.route('/')
    .get(getAllBooks)     // GET /api/books (puedes decidir si esta necesita protección o no)
    .post(protect, createBook); // POST /api/books - REQUIERE AUTENTICACIÓN

router.route('/:id')
    .get(getBookById)     // GET /api/books/:id (puedes decidir si esta necesita protección o no)
    .put(protect, updateBook)   // PUT /api/books/:id - REQUIERE AUTENTICACIÓN
    .delete(protect, deleteBook); // DELETE /api/books/:id - REQUIERE AUTENTICACIÓN

 // New route for books from other users
 router.get('/others', protect, getOtherUsersBooks);   

module.exports = router;