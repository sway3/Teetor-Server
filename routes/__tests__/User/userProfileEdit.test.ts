import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../models/userModel';
import { encrypt } from '../../../utils/authFunctions';

//mock getuserid
//dummy user
//mock cookie

describe('PUT /user/edit - User Profile Edit Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

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
      mentorCanHelpWith: ['React', 'TypeScript'],
      mentorDescription:
        'I can help with coding and career advice on web development.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
    });

    await user.save();

    jest.mock('../../utils/authFunctions', () => ({
      getUserId: jest.fn().mockReturnValue(user._id),
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully edit user profile', async () => {
    const updatedData = {
      userName: 'johndoe123123',
      oAuthIdentifier: '12345',
      firstName: 'John',
      lastName: 'Doe',
      role: ['mentor'],
      birthday: '1990-01-01',
      description: 'A passionate mentor.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['React', 'TypeScript'],
      mentorDescription:
        'I can help with coding and career advice on web development.',
      availableDays: ['Monday', 'Friday', 'Sunday'],
    };

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
      .put('/user/edit')
      .send(updatedData)
      .set('Cookie', `accessToken=${encrypt(accessToken)}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('User data updated');
  });
});
