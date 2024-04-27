// tests/integration/removeEvent.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import MentoringSession, {
  IMentoringSession,
} from '../../../models/mentoringSessionModel';

describe('PATCH /calendar/:sessionId/event/:eventId - Remove Event Controller Integration Test', () => {
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

  test('Successfully remove an event from a session', async () => {
    const sessionId = mentoringSession._id;
    const eventId = mentoringSession.calendar[0]._id;

    const response = await request(app).patch(
      `/calendar/${sessionId}/event/${eventId}`
    );

    expect(response.status).toBe(200);
    expect(response.text).toBe('remove event successful');
  });
});
