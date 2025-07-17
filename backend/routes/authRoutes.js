// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser); // Ruta para registrar un usuario
router.post('/login', loginUser);       // Ruta para iniciar sesión

module.exports = router;