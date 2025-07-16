// backend/server.js
const express = require('express');
// No need for mongoose.connect or app.listen here anymore
// require('dotenv').config(); // Still good to keep if routes use env vars

const app = express();

// --- Middleware ---
app.use(express.json());

// --- API Routes ---
app.get('/api/saludo', (req, res) => {
    const now = new Date();
    res.json({ mensaje: `¡Hola desde el backend! Son las ${now.toLocaleTimeString()}` });
});

// Export the Express app instance
module.exports = app;


