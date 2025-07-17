// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importamos bcryptjs para el hash de contraseñas

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true, // Asegura que los nombres de usuario sean únicos
        trim: true,
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // Asegura que los emails sean únicos
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un email válido'] // Regex para validar formato de email
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    createdAt: {
        type: Date,
        default: Date.now // Guarda la fecha de creación del usuario
    }
});

// --- Middleware de Mongoose: Hash de Contraseña antes de Guardar ---
UserSchema.pre('save', async function(next) {
    // Solo hashea la contraseña si ha sido modificada (o es nueva)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10); // Genera un "salt" (cadena aleatoria)
        this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña con el salt
        next();
    } catch (error) {
        next(error); // Pasa cualquier error al siguiente middleware
    }
});

// --- Método para Comparar Contraseñas ---
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compara la contraseña ingresada con el hash guardado
};

module.exports = mongoose.model('User', UserSchema);