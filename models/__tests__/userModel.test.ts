import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUser } from '../../models/userModel'; // Update the import path as necessary

describe('User Model Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Create user successfully', async () => {
    const userData = {
      userName: 'johndoe',
      oAuthIdentifier: '12345',
      firstName: 'John',
      lastName: 'Doe',
      role: ['mentor'],
      birthday: '1990-01-01',
      profileImg: 'http://example.com/image.jpg',
      description: 'A passionate mentor.',
      email: 'john.doe@example.com',
      mentorProfession: ['Software Engineering'],
      mentorCanHelpWith: ['Coding', 'Career advice'],
      mentorDescription: 'I can help with coding and career advice.',
      links: {
        Github: 'http://github.com/johndoe',
        LinkedIn: 'http://linkedin.com/in/johndoe',
      },
      mentoringArchive: ['session1', 'session2'],
      availableDays: ['Monday', 'Wednesday', 'Friday'],
    };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.userName).toBe(userData.userName);
    expect(savedUser.email).toBe(userData.email);
  });

  test('Find user by email', async () => {
    const email = 'john.doe@example.com';
    const foundUser = await User.findOne({ email });
    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(email);
  });
});
