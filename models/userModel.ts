import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  oAuthIdentifier: string;
  firstName: string;
  lastName: string;
  role: string[];
  birthday: string;
  profileImg: string;
  description: string;
  email: string;
  mentorProfession: string[];
  mentorCanHelpWith: string[];
  mentorDescription: string;
  qualification: {
    university: string;
  };
  links: {
    Github: string;
    LinkedIn: string;
  };
  connections: string[]; // Array of user IDs or user objects, depending on your design
  mentoringArchive: string[]; // Replace 'any' with a more specific type if possible
  availableDays: string[];
}

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  oAuthIdentifier: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: [String], required: true },
  birthday: { type: String, required: true },
  profileImg: { type: String, required: false },
  description: { type: String, required: true },
  email: { type: String, required: true },
  mentorProfession: { type: [String], required: false },
  mentorCanHelpWith: { type: [String], required: false },
  mentorDescription: { type: String, required: false },
  qualification: {
    university: { type: String, required: false },
  },
  links: {
    Github: { type: String, required: false },
    LinkedIn: { type: String, required: false },
  },
  connections: { type: [String], required: true },
  mentoringArchive: { type: [String], required: true },
  availableDays: { type: [String], required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
