// tests/integration/sendMessage.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../models/userModel';
import Chat, { IChat } from '../../../models/chatModel';
import { encrypt } from '../../../utils/authFunctions';

//content, chatId
//accesstoken
//get user id

describe('POST /messages - Send Message Controller Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let user: IUser;
  let chat: IChat;

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
      participants: [
        user._id.toString(),
        new mongoose.Types.ObjectId().toString(),
      ],
      latestContent: 'test',
      timestamp: new Date().toISOString(),
    });

    await chat.save();

    jest.mock('../../utils/authFunctions', () => ({
      getUserId: jest.fn().mockReturnValue(user._id),
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully send a message', async () => {
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
    const content = 'Hello, World!';

    const response = await request(app)
      .post('/messages')
      .send({ chatId, content })
      .set('Cookie', `accessToken=${encrypt(accessToken)}`);

    expect(response.status).toBe(201);
    expect(response.text).toBe('Message sent successful');
  });
});
