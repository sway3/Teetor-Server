// tests/integration/getMentors.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import User, { IUser } from '../../../models/userModel';
import jwt from 'jsonwebtoken';
import { encrypt } from '../../../utils/authFunctions';

//mock getuserid
//dummy mentee and mentor
//mock cookie

describe('POST /user/mentors - Get Mentors Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let mentee: IUser;
  let mentor: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    mentor = new User({
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

    mentee = new User({
      userName: 'janedoe',
      oAuthIdentifier: '1234511',
      firstName: 'jane',
      lastName: 'Doe',
      role: ['mentee'],
      birthday: '1990-01-01',
      description: 'A passionate mentee.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['React', 'JavaScript'],
      mentorDescription: 'I can help with coding and career advice.',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    });

    await Promise.all([mentee.save(), mentor.save()]);

    jest.mock('../../utils/authFunctions', () => ({
      getUserId: jest.fn().mockReturnValue(mentee._id.toString()),
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully retrieve mentors', async () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is undefined');
    }

    const accessToken = jwt.sign(
      { userId: mentee._id.toString() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const response = await request(app)
      .post('/user/mentors')
      .set('Cookie', `accessToken=${encrypt(accessToken)}`);

    expect(response.status).toBe(200);
  });
});
