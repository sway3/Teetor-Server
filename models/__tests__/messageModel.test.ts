import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Message from '../../models/messageModel'; // Adjust the import path as necessary

describe('Message Model Tests', () => {
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

  test('Create message successfully', async () => {
    const messageData = {
      recipientId: new mongoose.Types.ObjectId().toString(),
      senderId: new mongoose.Types.ObjectId().toString(),
      chatId: new mongoose.Types.ObjectId().toString(),
      content: 'Hello, how are you?',
      timestamp: new Date().toISOString(),
      readStatus: false,
    };
    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.readStatus).toBe(false);
  });
});
