// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    user: { // <-- Make sure this is 'user', not 'ownerId'
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Por favor, añade un título para el libro'],
    },
    author: {
      type: String,
      required: [true, 'Por favor, añade el autor del libro'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    genre: {
      type: String,
      required: false,
    },
    condition: {
      type: String,
      required: [true, 'Por favor, especifica la condición del libro'],
      // We'll fix this enum in the next step
      enum: ['Nuevo', 'Como nuevo', 'Bueno', 'Aceptable', 'Desgastado'],
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);