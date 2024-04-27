import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MentoringSession from '../../models/mentoringSessionModel'; // Adjust the import path as necessary

describe('MentoringSession Model Tests', () => {
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

  test('Create mentoring session successfully', async () => {
    const mentoringSessionData = {
      participants: {
        mentorId: new mongoose.Types.ObjectId(),
        menteeId: new mongoose.Types.ObjectId(),
      },
      startDate: '2024-04-20',
      endDate: '2024-04-21',
      status: 'inProgress',
      title: 'Intro to Web Dev',
      mentorInfo: {
        canHelpWith: ['HTML', 'CSS', 'JavaScript'],
        description: 'Experienced web developer',
      },
      menteeInfo: {
        needHelpWith: ['JavaScript'],
        description: 'Beginner needing help with JS basics',
      },
    };
    const mentoringSession = new MentoringSession(mentoringSessionData);
    const savedMentoringSession = await mentoringSession.save();

    expect(savedMentoringSession._id).toBeDefined();
    expect(savedMentoringSession.participants.mentorId.toString()).toEqual(
      mentoringSessionData.participants.mentorId.toString()
    );
  });
});
