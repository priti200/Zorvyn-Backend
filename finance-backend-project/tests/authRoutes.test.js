const request = require('supertest');
const app = require('../src/server'); // Assuming server.js exports the app
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const User = require('../src/models/User'); // Import the User model
const jwt = require('jsonwebtoken');
const SECRET = 'testsecret'; // Test secret for JWT

jest.setTimeout(30000); // Set global timeout for this test file

beforeAll(async () => {
  await mongod.start(); // Start the server
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase(); // Clear the database
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  jest.clearAllTimers();
});

describe('Auth Routes', () => {
  test('POST /auth/register - should register a new user', async () => {
    const response = await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('POST /auth/login - should log in a user', async () => {
    // First, register a user
    await request(app).post('/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});