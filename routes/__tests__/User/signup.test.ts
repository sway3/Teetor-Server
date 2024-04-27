// tests/integration/signup.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';

describe('POST /signup - User Signup Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully sign up a new user', async () => {
    const userInfo = {
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
    };

    const response = await request(app).post('/signup').send(userInfo);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('signup successful');
  });
});
