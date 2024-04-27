// tests/integration/addNewEvent.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../socket/socket';
import MentoringSession, {
  IMentoringSession,
} from '../../../models/mentoringSessionModel';

describe('POST /calendar - Add New Event Controller Integration Test', () => {
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
      calendar: [],
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Successfully add a new event', async () => {
    const sessionId = mentoringSession._id;
    const newEvent = {
      title: 'test event',
      date: new Date().toISOString(),
      description: 'testing load events',
    };

    const response = await request(app)
      .post('/calendar')
      .send({ sessionId, ...newEvent });

    expect(response.status).toBe(201);
    expect(response.text).toBe('new event successfully added');
  });
});
