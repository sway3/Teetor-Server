import mongoose, { Document } from 'mongoose';
import Chat from './chatModel';
import User from './userModel';

export interface Imessage extends Document {
  recipientId: string;
  senderId: string;
  chatId: string;
  content: string;
  timestamp: string;
  readStatus: boolean;
}

const messageSchema = new mongoose.Schema({
  recipientId: { type: String, required: true, ref: User },
  senderId: { type: String, required: true, ref: User },
  chatId: { type: String, required: true, ref: Chat },
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
  readStatus: { type: Boolean, required: false },
});

const Message = mongoose.model<Imessage>('Messages', messageSchema);

export default Message;
