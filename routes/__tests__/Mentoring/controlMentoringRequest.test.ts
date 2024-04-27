import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import Notification, { INotification } from '../../../models/notificationModel';
import User, { IUser } from '../../../models/userModel';

describe('PATCH /mentoring-request/:id - Control Mentoring Request Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let notification: INotification;
  let mentee: IUser;
  let mentor: IUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    mentor = new User({
      userName: 'johndoe',
      oAuthIdentifier: '12345',
      firstName: 'John',
      lastName: 'Doe',
      role: ['mentor'],
      birthday: '1990-01-01',
      description: 'A passionate mentor.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['React', 'TypeScript'],
      mentorDescription:
        'I can help with coding and career advice on web development.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
    });

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
      recipientId: mentor._id.toString(),
      senderId: mentee._id.toString(),
      type: 'mentoring-request',
      status: 'accepted',
      message: 'test message',
      content: 'request',
      timestamp: new Date().toString(),
    });

    await Promise.all([notification.save(), mentee.save(), mentor.save()]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully update a mentoring request status', async () => {
    const notificationId = notification._id;

    const response = await request(app)
      .patch(`/mentoring-request/${notificationId}`)
      .send({ status: 'accepted', title: 'Advanced Node.js' });

    expect(response.status).toBe(200);
  });
});
