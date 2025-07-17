// index.js (or app.js)
const app = require('./server'); // Import the Express app
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/librosVecinosDB';

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor de Intercambio de Libros escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });