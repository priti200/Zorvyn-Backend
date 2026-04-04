const request = require('supertest');
const app = require('../src/server'); // Assuming server.js exports the app
const mongoose = require('mongoose');
const FinancialRecord = require('../src/models/FinancialRecord');
const User = require('../src/models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const jwt = require('jsonwebtoken');
const SECRET = 'testsecret'; // Test secret for JWT

let token;

jest.setTimeout(30000); // Set global timeout for this test file

beforeAll(async () => {
  // Start the server
  await mongod.start(); // Start the server
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a test user and get a token
  const user = new User({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });
  await user.save();

  const response = await request(app).post('/auth/login').send({
    email: 'testuser@example.com',
    password: 'password123',
  });
  token = response.body.token;
});

afterAll(async () => {
  // Ensure all connections are closed
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  jest.clearAllTimers();
});

describe('Financial Record Routes', () => {
  test('POST /records - should create a new financial record', async () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, SECRET); // Generate a test JWT with valid ObjectId

    const response = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Record',
        amount: 100,
        type: 'income', // Add required field
        date: '2023-10-01',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Record');
  });

  test('GET /records - should retrieve all financial records', async () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, SECRET); // Generate a test JWT with valid ObjectId

    const response = await request(app)
      .get('/records')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});