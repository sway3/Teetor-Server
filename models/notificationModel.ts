import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: string;
  senderId: string;
  type: string;
  status: string;
  message: string;
  content: any;
  timestamp: string;
}

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true },
  senderId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  content: { type: Object, required: false },
  timestamp: { type: String, required: true },
});

const Notification = mongoose.model<INotification>(
  'Notifications',
  notificationSchema
);

export default Notification;
