// backend/models/Book.js
const mongoose = require('mongoose');

// Definimos cómo se verá un "Libro" en nuestra base de datos
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // El título es obligatorio
    trim: true // Elimina espacios extra al principio/final
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500 // Descripción no puede ser muy larga
  },
  condition: { // Estado del libro (ej. "Nuevo", "Bueno", "Usado")
    type: String,
    enum: ['Nuevo', 'Como Nuevo', 'Bueno', 'Aceptable', 'Gastado'], // Solo estos valores son permitidos
    default: 'Bueno'
  },
  owner: { // Quién es el dueño del libro (referencia al usuario)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asumimos que tendremos un modelo User más adelante
    required: true
  },
  isAvailable: { // Si el libro está disponible para intercambio
    type: Boolean,
    default: true
  },
  imageUrl: { // URL de la imagen del libro
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now // Fecha cuando se añadió el libro
  }
});

// Creamos el modelo a partir del esquema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;