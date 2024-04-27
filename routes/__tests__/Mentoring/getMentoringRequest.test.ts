// tests/integration/getMentoringRequest.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import Notification, { INotification } from '../../../models/notificationModel';
import User, { IUser } from '../../../models/userModel';

describe('GET /mentoring-request/:id - Get Mentoring Request Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let notification: INotification;
  let mentee: IUser;
  let mentor: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    mentee = new User({
      userName: 'janedoe',
      oAuthIdentifier: '1234511',
      firstName: 'jane',
      lastName: 'Doe',
      role: ['mentee'],
      birthday: '1990-01-01',
      description: 'A passionate mentee.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['React', 'JavaScript'],
      mentorDescription: 'I can help with coding and career advice.',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    });

    notification = new Notification({
      recipientId: new mongoose.Types.ObjectId().toString(),
      senderId: mentee._id.toString(),
      type: 'mentoring-request',
      status: 'accepted',
      message: 'test message',
      content: 'request',
      timestamp: new Date().toString(),
    });

    await Promise.all([notification.save(), mentee.save()]);
  });

  test('Fetch a specific mentoring request', async () => {
    const notificationId = notification._id;

    const response = await request(app).get(
      `/mentoring-request/${notificationId}`
    );

    expect(response.status).toBe(200);
  });
});
