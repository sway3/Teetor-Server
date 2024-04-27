// tests/integration/loadEvents.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import MentoringSession, {
  IMentoringSession,
} from '../../../models/mentoringSessionModel';

describe('GET /calendar/:id - Load Events Controller Integration Test', () => {
  let mongoServer: MongoMemoryServer;
  let mentoringSession: IMentoringSession;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    mentoringSession = new MentoringSession({
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
      calendar: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'test event',
          date: new Date().toISOString(),
          description: 'testing load events',
        },
      ],
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully fetch events for a session', async () => {
    const sessionId = mentoringSession._id;

    const response = await request(app).get(`/calendar/${sessionId}`);

    expect(response.status).toBe(200);
  });
});
