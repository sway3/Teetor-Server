// tests/integration/loadMessages.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import User, { IUser } from '../../../models/userModel';
import jwt from 'jsonwebtoken';
import { encrypt } from '../../../utils/authFunctions';
import Chat, { IChat } from '../../../models/chatModel';
import Message, { Imessage } from '../../../models/messageModel';

require('dotenv').config();

describe('GET /messages/:id - Load Message Controller Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;
  let chat: IChat;
  let message: Imessage;
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
      mentorCanHelpWith: ['Coding', 'Career advice'],
      mentorDescription: 'I can help with coding and career advice.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
    });

    await user.save();

    chat = new Chat({
      participants: [user._id, new mongoose.Types.ObjectId().toString()],
      latestContent: 'test',
      timestamp: new Date().toISOString(),
    });

    await chat.save();

    message = new Message({
      chatId: chat._id,
      recipientId: user._id,
      senderId: user._id,
      content: 'test message',
      timestamp: new Date().toISOString(),
    });

    await message.save();

    jest.mock('../../utils/authFunctions', () => ({
      getUserId: jest.fn().mockReturnValue(user._id.toString()),
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Fetch messages for a specific chat', async () => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is undefined');
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const chatId = chat._id;

    const response = await request(app)
      .get(`/messages/${chatId}`)
      .set('Cookie', `accessToken=${encrypt(accessToken)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('messages');
  });
});
