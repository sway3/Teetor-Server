// tests/integration/getNotifications.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';

jest.mock('../../utils/authFunctions', () => ({
  getUserId: jest.fn().mockReturnValue('fakeUserId'),
}));

describe('GET /user/notifications - Get Notifications Integration Tests', () => {
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

  test('Successfully fetch notifications', async () => {
    const accessToken = 'fakeAccessToken';

    const response = await request(app)
      .get('/user/notifications')
      .set('Cookie', `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Additional assertions to verify the content of notifications can be added here
  });
});
