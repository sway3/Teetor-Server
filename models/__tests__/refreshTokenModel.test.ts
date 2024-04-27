import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import RefreshToken from '../../models/refreshTokenModel'; // Adjust the import path as necessary

describe('RefreshToken Model Tests', () => {
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

  test('Create refresh token successfully', async () => {
    const refreshTokenData = {
      userId: new mongoose.Types.ObjectId().toString(),
      token: 'someRandomTokenString',
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // expires in 24 hours
    };
    const refreshToken = new RefreshToken(refreshTokenData);
    const savedRefreshToken = await refreshToken.save();

    expect(savedRefreshToken._id).toBeDefined();
    expect(savedRefreshToken.userId).toBe(refreshTokenData.userId);
    expect(savedRefreshToken.token).toBe(refreshTokenData.token);
    expect(savedRefreshToken.expiresAt).toEqual(refreshTokenData.expiresAt);
  });
});
