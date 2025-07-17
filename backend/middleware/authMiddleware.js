// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Necesitamos el modelo de usuario para buscar al usuario por ID

const protect = async (req, res, next) => {
    let token;

    // 1. Verificar si el token existe y tiene el formato 'Bearer TOKEN'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token de los headers de la solicitud
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar al usuario por el ID dentro del token (excluir la contraseña)
            // Se asume que el ID del usuario está en 'decoded.id'
            req.user = await User.findById(decoded.id).select('-password');

            // Si el usuario no existe (ej. fue eliminado después de generar el token)
            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            // Continuar con la siguiente función de middleware o ruta
            next();

        } catch (error) {
            console.error('Error en el middleware de autenticación:', error.message);
            // Si el token es inválido, ha expirado, etc.
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado, por favor, inicie sesión de nuevo.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'No autorizado, token inválido.' });
            }
            res.status(401).json({ message: 'No autorizado, token fallido.' });
        }
    }

    // Si no hay token en los headers
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se encontró token.' });
    }
};

module.exports = { protect };