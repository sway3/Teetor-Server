// tests/integration/auth.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../models/userModel';
import { encrypt } from '../../../utils/authFunctions';

require('dotenv').config();

describe('POST /auth - Auth Controller Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a user
    user = new User({
      userName: 'johndoe',
      oAuthIdentifier: '12345',
      firstName: 'John',
      lastName: 'Doe',
      role: ['mentor'],
      birthday: '1990-01-01',
      description: 'A passionate mentor.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['Coding', 'Career advice'],
      mentorDescription: 'I can help with coding and career advice.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
    });
    await user.save();

    jest.mock('../../utils/authFunctions', () => ({
      getUserId: jest.fn().mockReturnValue(user._id.toString()),
      getUserInfo: jest.fn().mockReturnValue(user),
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully authenticate and retrieve user info', async () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is undefined');
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const response = await request(app)
      .post('/auth')
      .set('Cookie', `accessToken=${encrypt(accessToken)}`);

    expect(response.status).toBe(200);
    // Additional checks can be made here to ensure the returned user information is correct
    expect(response.body).toHaveProperty('userId', user._id.toString());
  });
});
