const request = require('supertest');
const app = require('../../backend/server'); // Import the *exported app* instance
const mongoose = require('mongoose');

let server; // To hold the server instance
const TEST_PORT = 3001; // Use a distinct port for testing

beforeAll(async () => {
  // Connect to MongoDB specifically for tests (e.g., to a test database)
  const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/librosVecinosTestDB';
  await mongoose.connect(TEST_DB_URI);
  console.log('✅ Conectado a MongoDB para pruebas.');

  // Start the test server
  server = app.listen(TEST_PORT, () => {
    console.log(`🚀 Test server started on http://localhost:${TEST_PORT}`);
  });
});

afterAll(async () => {
  // Close the test server
  await new Promise(resolve => server.close(resolve));
  console.log('Test server closed.');

  // Close the MongoDB connection used for tests
  await mongoose.connection.close();
  console.log('MongoDB connection closed after tests.');
});

describe('GET /api/saludo', () => {
  test('debería devolver un mensaje de saludo con la hora actual', async () => {
    const response = await request(server).get('/api/saludo');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body.mensaje).toContain('¡Hola desde el backend!');

    // Updated regex to include optional 'a.m.' or 'p.m.'
    // It will match HH:MM:SS followed by an optional space and a.m./p.m.
    // Or, more robustly, match the pattern of hours, minutes, seconds and an optional am/pm indicator.
    // Given the specific format "H:MM:SS p.m." or "H:MM:SS a.m.", we need to be precise.
    // Let's use a regex that accounts for 1 or 2 digits for hours, and the AM/PM part.
    expect(response.body.mensaje).toMatch(/\d{1,2}:\d{2}:\d{2} (a\.m\.|p\.m\.)/); 
    // Explanation of the new regex:
    // \d{1,2} : Matches one or two digits for the hour (e.g., 7 or 12).
    // :       : Matches the colon.
    // \d{2}   : Matches two digits for minutes.
    // :       : Matches the colon.
    // \d{2}   : Matches two digits for seconds.
    // (a\.m\.|p\.m\.) : Matches " a.m." or " p.m.". The dots are escaped with \.
    //           The space before (a.m.|p.m.) ensures there's a space if it exists.
  });
});