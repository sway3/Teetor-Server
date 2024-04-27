import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Chat from '../../models/chatModel';

describe('Chat Model Tests', () => {
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

  test('Create chat successfully', async () => {
    const chatData = {
      participants: ['6622ce7a0a486ba6891919b0', '6622ce7a0a486ba6891919b1'],
      latestContent: 'Hello there!',
      timestamp: new Date().toISOString(),
    };
    const chat = new Chat(chatData);
    const savedChat = await chat.save();

    expect(savedChat._id).toBeDefined();
    expect(savedChat.participants.length).toBe(2);
    expect(savedChat.latestContent).toBe(chatData.latestContent);
    expect(savedChat.timestamp).toBe(chatData.timestamp);
  });
});
