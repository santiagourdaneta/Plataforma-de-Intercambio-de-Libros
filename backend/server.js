// backend/server.js
const express = require('express');
const colors = require('colors'); // Para colores en la consola
const rateLimit = require('express-rate-limit'); 
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

// -- Configuramos al portero --
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos (cuánto tiempo recuerda el portero)
    max: 100, // Cuántas veces puedes tocar el timbre en ese tiempo
    message:
        "Demasiadas solicitudes desde esta IP, por favor, inténtalo de nuevo después de 15 minutos.",
});

// --- Middleware ---
app.use(express.json());

// -- Ponemos al portero en TODAS las puertas de tu casa (tus rutas) --
app.use(limiter); // Esto hace que el portero cuide todo

// --- API Routes ---
app.get('/api/saludo', (req, res) => {
    const now = new Date();
    res.json({ mensaje: `¡Hola desde el backend! Son las ${now.toLocaleTimeString()}` });
});

// --- ¡Aquí es donde conectamos las rutas de libros! ---
// Todas las rutas definidas en bookRoutes.js comenzarán con /api/books
app.use('/api/books', bookRoutes); // Usa las rutas de libros para /api/books

// --- Conecta las rutas de autenticación ---
app.use('/api/auth', authRoutes); 


// Export the Express app instance
module.exports = app;


