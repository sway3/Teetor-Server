// tests/integration/loadChats.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';

jest.mock('../../utils/authFunctions', () => ({
  getUserId: jest.fn().mockReturnValue('fakeUserId'),
}));

describe('GET /chats - Load Chats Controller Integration Test', () => {
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

  test('Successfully load chats for a user', async () => {
    const response = await request(app)
      .get('/chats')
      .set('Cookie', `accessToken=fakeAccessToken`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
