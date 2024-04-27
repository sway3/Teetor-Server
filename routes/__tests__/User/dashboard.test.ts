import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

require('dotenv').config();

jest.mock('../../utils/authFunctions', () => ({
  decrypt: jest.fn().mockImplementation((token: string) => token),
})); // Ensure correct path

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ userId: 'fakeUserId' }),
  sign: jest.fn().mockReturnValue('fakeToken'),
}));

describe('Dashboard Route Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    process.env.ACCESS_TOKEN_SECRET = 'your_access_token_secret_for_testing';
    process.env.ENCRYPTION_KEY = 'your_encryption_key_for_testing';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  test('GET /dashboard - fetch dashboard data', async () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    console.log(ACCESS_TOKEN_SECRET);

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is undefined');
    }
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const fakeToken = jwt.sign({ userId: fakeUserId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    // Setup jwt.verify to return a specific mock value when called
    (jwt.verify as jest.Mock).mockReturnValue({ userId: fakeUserId });

    const response = await request(app)
      .get('/dashboard')
      .set('Cookie', `accessToken=${fakeToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userInfo');
    expect(response.body).toHaveProperty('notification');
    expect(response.body).toHaveProperty('mentoringSessions');
  });
});
