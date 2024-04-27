import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';

describe('POST /logout - User Logout Integration Tests', () => {
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

  test('Successfully logout user', async () => {
    const refreshToken = 'fakeRefreshToken';

    const response = await request(app)
      .post('/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('logout successful');
  });
});
