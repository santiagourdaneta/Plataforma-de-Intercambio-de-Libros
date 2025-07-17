// backend/controllers/bookController.js
const Book = require('../models/Book'); // Importamos el modelo Book
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// --- Función para CREAR un nuevo libro ---
exports.createBook = async (req, res) => {
    try {
        // Obtenemos los datos del libro del cuerpo de la solicitud
        const { title, author, isbn, genre, condition, description } = req.body;

        if (!title || !author || !condition) { // La validación en el backend no pide ownerId del body
           res.status(400);
           throw new Error('Por favor, añade al menos un título, autor y condición');
         }

        
        const newBook = new Book({
                title,
                author,
                isbn,
                genre,
                condition,
                description,
                user: req.user.id,
        });

        // Guardamos el nuevo libro en la base de datos
        const savedBook = await newBook.save();

        // Respondemos con el libro creado y un estado 201 (Creado)
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error al crear libro:', error);
        if (error.name === 'ValidationError') { // Si es un error de validación de Mongoose
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el libro.' });
    }
};

// --- Función para OBTENER TODOS los libros ---
exports.getAllBooks = async (req, res) => {
    try {
        // Buscamos todos los libros en la base de datos
        const books = await Book.find({});
        // Respondemos con la lista de libros
        res.status(200).json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los libros.' });
    }
};

// --- Función para OBTENER UN libro por su ID ---
exports.getBookById = async (req, res) => {
    try {
        // Obtenemos el ID del libro de los parámetros de la URL
        const { id } = req.params;

        // Buscamos el libro por su ID
        const book = await Book.findById(id);

        // Si no se encuentra el libro, respondemos con 404 (No encontrado)
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        // Respondemos con el libro encontrado
        res.status(200).json(book);
    } catch (error) {
        console.error('Error al obtener libro por ID:', error);
        // Si el ID no tiene el formato correcto de ObjectId de MongoDB
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de libro inválido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al obtener el libro.' });
    }
};

// --- Función para ACTUALIZAR un libro por su ID ---
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params; // ID del libro a actualizar
        const updates = req.body; // Datos a actualizar

        // Validaciones básicas de que al menos un campo venga para actualizar
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No se han proporcionado datos para actualizar.' });
        }

        // Buscamos y actualizamos el libro. `new: true` devuelve el documento actualizado.
        // `runValidators: true` asegura que las reglas del esquema de Mongoose se apliquen a las actualizaciones.
        const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        // Si no se encuentra el libro, respondemos con 404
        if (!updatedBook) {
            return res.status(404).json({ message: 'Libro no encontrado para actualizar.' });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de libro inválido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el libro.' });
    }
};

// --- Función para ELIMINAR un libro por su ID ---
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params; // ID del libro a eliminar

        // Buscamos y eliminamos el libro
        const deletedBook = await Book.findByIdAndDelete(id);

        // Si no se encuentra el libro, respondemos con 404
        if (!deletedBook) {
            return res.status(404).json({ message: 'Libro no encontrado para eliminar.' });
        }

        // Respondemos con un mensaje de éxito y el libro eliminado
        res.status(200).json({ message: 'Libro eliminado exitosamente.', deletedBook });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Formato de ID de libro inválido.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el libro.' });
    }
};

// @desc    Get books from other users
// @route   GET /api/books/others
// @access  Private
exports.getOtherUsersBooks = asyncHandler(async (req, res) => {
  // Find all books where the 'user' field is NOT the ID of the authenticated user
  const otherBooks = await Book.find({ user: { $ne: req.user.id } }).populate('user', 'username email'); // Populate user data
  res.status(200).json(otherBooks);
});

