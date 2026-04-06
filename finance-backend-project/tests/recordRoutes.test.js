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

describe('Financial Record Routes', () => {
  test('POST /records - should create a new financial record', async () => {
    const response = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Salary',
        amount: 5000,
        type: 'income',
        category: 'salary',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Salary');
    expect(response.body.amount).toBe(5000);
  });

  test('POST /records - should fail with invalid data', async () => {
    const response = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        amount: -100,
        type: 'invalid',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('GET /records - should retrieve all financial records', async () => {
    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test 1', amount: 100, type: 'income' });

    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test 2', amount: 50, type: 'expense' });

    const response = await request(app)
      .get('/records')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.records).toHaveLength(2);
  });

  test('GET /records - should support pagination', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/records')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `Test ${i}`, amount: i * 10, type: 'income' });
    }

    const response = await request(app)
      .get('/records?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.records).toHaveLength(2);
    expect(response.body.pagination.total).toBe(5);
    expect(response.body.pagination.pages).toBe(3);
  });
});
