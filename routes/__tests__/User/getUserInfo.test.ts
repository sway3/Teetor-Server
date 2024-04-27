import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../models/userModel'; // Adjust the import path to your User model

jest.mock('../../utils/authFunctions', () => ({
  getUserId: jest
    .fn()
    .mockReturnValue(new mongoose.Types.ObjectId().toString()),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

describe('GET /user - Get User Info Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Create a new user in the test database
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
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Fetch user info', async () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is undefined');
    }

    const userId = new mongoose.Types.ObjectId();
    const accessToken = jwt.sign(
      { userId: userId.toString() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const response = await request(app)
      .get('/user')
      .set('Cookie', `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
  });
});
