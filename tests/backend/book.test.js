// tests/backend/book.test.js
const request = require('supertest');
const app = require('../../backend/server'); // Importamos la aplicación Express
const mongoose = require('mongoose');
const Book = require('../../backend/models/Book'); // Importamos el modelo Book

let server; // Para la instancia del servidor de pruebas
const TEST_PORT = 3002; // Un puerto diferente para estos tests
let testBookId; // Para guardar el ID de un libro que crearemos en los tests

// --- Antes de todas las pruebas ---
beforeAll(async () => {
    const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/librosIntercambioTestDB';

    // Asegúrate de usar la base de datos de pruebas para estos tests también
    if (mongoose.connection.readyState === 0) { // Si no está ya conectado
        await mongoose.connect(TEST_DB_URI);
        console.log('✅ Conectado a MongoDB para tests de libros.');
    } else {
        // Si ya hay una conexión activa (ej. desde server.test.js), úsala
        console.log('✅ Reutilizando conexión a MongoDB para tests de libros.');
    }

    // Limpiamos la colección de libros antes de correr los tests
    await Book.deleteMany({});
    console.log('🗑️ Colección de libros limpia antes de los tests.');

    // Iniciamos el servidor de pruebas en un puerto específico
    server = app.listen(TEST_PORT, () => {
        console.log(`🚀 Test server for books started on http://localhost:${TEST_PORT}`);
    });
});

// --- Después de todas las pruebas ---
afterAll(async () => {
    // Cierra el servidor de pruebas
    await new Promise(resolve => server.close(resolve));
    console.log('Test server for books closed.');

    // Limpiamos la colección de libros después de los tests
    await Book.deleteMany({});
    console.log('🗑️ Colección de libros limpia después de los tests.');

    // Cierra la conexión de Mongoose si es la última prueba que la usa
    // Opcional: Esto podría manejarse en un archivo de setup global de Jest si tuvieras muchos test files
    // Por ahora, lo cerramos aquí, asumiendo que es la última suite importante.
    // Si tienes otros test files que necesitan la conexión, quita esta línea y manéjala globalmente.
    if (mongoose.connection.readyState === 1) { // Si la conexión está abierta
        await mongoose.connection.close();
        console.log('MongoDB connection closed after all book tests.');
    }
});


// --- Suite de Pruebas para Libros (CRUD) ---
describe('CRUD de Libros API', () => {

    // Test POST: Crear un nuevo libro
    test('POST /api/books debería crear un nuevo libro', async () => {
        const newBookData = {
            title: 'El Señor de los Anillos',
            author: 'J.R.R. Tolkien',
            publicationYear: 1954,
            genre: 'Fantasía',
            condition: 'Nuevo',
            ownerId: new mongoose.Types.ObjectId().toString() // Genera un ID de owner aleatorio para el test
        };

        const res = await request(server)
            .post('/api/books')
            .send(newBookData);

        expect(res.statusCode).toBe(201); // Esperamos un 201 (Created)
        expect(res.body).toHaveProperty('_id'); // Esperamos que devuelva un _id
        expect(res.body.title).toBe(newBookData.title);
        expect(res.body.author).toBe(newBookData.author);
        expect(res.body.ownerId).toBe(newBookData.ownerId);

        testBookId = res.body._id; // Guardamos el ID para usarlo en otros tests
    });

    // Test POST: Intentar crear libro sin campos obligatorios
    test('POST /api/books debería devolver 400 si faltan campos obligatorios', async () => {
        const invalidBookData = {
            author: 'Falta Título', // Faltan title y ownerId
        };

        const res = await request(server)
            .post('/api/books')
            .send(invalidBookData);

        expect(res.statusCode).toBe(400); // Esperamos un 400 (Bad Request)
        expect(res.body.message).toContain('obligatorios');
    });

    // Test GET: Obtener todos los libros
    test('GET /api/books debería obtener todos los libros', async () => {
        const res = await request(server)
            .get('/api/books');

        expect(res.statusCode).toBe(200); // Esperamos un 200 (OK)
        expect(Array.isArray(res.body)).toBe(true); // Esperamos un array
        expect(res.body.length).toBeGreaterThan(0); // Esperamos que haya al menos un libro (el que creamos)
        expect(res.body[0].title).toBe('El Señor de los Anillos');
    });

    // Test GET: Obtener un libro por ID
    test('GET /api/books/:id debería obtener un libro por su ID', async () => {
        const res = await request(server)
            .get(`/api/books/${testBookId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'El Señor de los Anillos');
        expect(res.body).toHaveProperty('_id', testBookId);
    });

    // Test GET: Obtener un libro con ID no existente
    test('GET /api/books/:id debería devolver 404 si el libro no existe', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString(); // ID que no existe
        const res = await request(server)
            .get(`/api/books/${nonExistentId}`);

        expect(res.statusCode).toBe(404); // Esperamos 404 (Not Found)
        expect(res.body.message).toBe('Libro no encontrado.');
    });

    // Test PUT: Actualizar un libro
    test('PUT /api/books/:id debería actualizar un libro existente', async () => {
        const updatedData = {
            condition: 'Como Nuevo',
            publicationYear: 1960 // Cambio de año para probar
        };

        const res = await request(server)
            .put(`/api/books/${testBookId}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.condition).toBe(updatedData.condition);
        expect(res.body.publicationYear).toBe(updatedData.publicationYear);
    });

    // Test PUT: Intentar actualizar un libro con ID inválido
    test('PUT /api/books/:id debería devolver 400 si el ID es inválido', async () => {
        const res = await request(server)
            .put(`/api/books/id-invalido`) // ID con formato incorrecto
            .send({ title: 'Nuevo Título' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('ID de libro inválido');
    });


    // Test DELETE: Eliminar un libro
    test('DELETE /api/books/:id debería eliminar un libro existente', async () => {
        const res = await request(server)
            .delete(`/api/books/${testBookId}`);

        expect(res.statusCode).toBe(200); // Esperamos 200 (OK)
        expect(res.body.message).toBe('Libro eliminado exitosamente.');

        // Opcional: Verifica que ya no se puede obtener
        const getRes = await request(server)
            .get(`/api/books/${testBookId}`);
        expect(getRes.statusCode).toBe(404);
    });

    // Test DELETE: Intentar eliminar un libro con ID no existente
    test('DELETE /api/books/:id debería devolver 404 si el libro no existe', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString(); // ID que no existe
        const res = await request(server)
            .delete(`/api/books/${nonExistentId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Libro no encontrado para eliminar.');
    });
});