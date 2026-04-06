process.env.JWT_SECRET = 'testsecret';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const { app } = require('../src/server');
const jwt = require('jsonwebtoken');
const SECRET = 'testsecret';

let mongod;
let token;
let testUserId;

jest.setTimeout(30000);

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  
  const user = new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'Admin',
  });
  await user.save();
  testUserId = user._id;
  
  token = jwt.sign({ id: testUserId, role: 'Admin' }, SECRET);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

describe('Auth Routes', () => {
  test('POST /auth/register - should register a new user', async () => {
    const response = await request(app).post('/auth/register').send({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('POST /auth/login - should log in a user', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/login - should fail with invalid credentials', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
  });

  test('POST /auth/register - should fail with invalid input', async () => {
    const response = await request(app).post('/auth/register').send({
      username: 'ab',
      email: 'invalid-email',
      password: '123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
