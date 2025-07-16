// backend/server.js
const express = require('express');
// No need for mongoose.connect or app.listen here anymore
// require('dotenv').config(); // Still good to keep if routes use env vars
const rateLimit = require('express-rate-limit'); 

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

// Export the Express app instance
module.exports = app;


