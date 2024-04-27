// tests/integration/mentoringRequest.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';

jest.mock('../../utils/authFunctions', () => ({
  getUserId: jest.fn().mockReturnValue('fakeUserId'),
}));

describe('POST /mentoring-request - Mentoring Request Integration Test', () => {
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

  test('Successfully create a mentoring request', async () => {
    const mentorId = new mongoose.Types.ObjectId();
    const menteeInfo = {
      needHelpWith: ['JavaScript'],
      description: 'Beginner',
    };

    const response = await request(app)
      .post('/mentoring-request')
      .send({ mentorId, menteeInfo });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('type', 'mentoring-request');
  });
});
