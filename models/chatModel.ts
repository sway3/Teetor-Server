import mongoose, { Document } from 'mongoose';

export interface IChat extends Document {
  participants: string[];
  latestContent: string;
  timestamp: string;
}

const chatSchema = new mongoose.Schema({
  participants: { type: [String], ref: 'User', required: true },
  latestContent: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const Chat = mongoose.model<IChat>('Chats', chatSchema);

export default Chat;
