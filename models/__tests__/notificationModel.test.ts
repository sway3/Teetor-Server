import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Notification from '../../models/notificationModel'; // Adjust the import path as necessary

describe('Notification Model Tests', () => {
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

  test('Create notification successfully', async () => {
    const notificationData = {
      recipientId: new mongoose.Types.ObjectId().toString(),
      senderId: new mongoose.Types.ObjectId().toString(),
      type: 'mentoring-request',
      status: 'pending',
      message: 'You have a new mentoring request',
      content: {
        mentorCanHelpWith: ['HTML', 'CSS', 'JavaScript'],
        mentorDescription: 'Experienced web developer',
        menteeNeedHelpWith: ['JavaScript'],
        menteeDescription: 'Beginner needing help with JS basics',
      },
      timestamp: new Date().toISOString(),
    };
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();

    expect(savedNotification._id).toBeDefined();
    expect(savedNotification.recipientId).toBe(notificationData.recipientId);
    expect(savedNotification.senderId).toBe(notificationData.senderId);
    expect(savedNotification.type).toBe(notificationData.type);
    expect(savedNotification.status).toBe(notificationData.status);
    expect(savedNotification.message).toBe(notificationData.message);
    expect(savedNotification.content).toEqual(notificationData.content);
  });
});
