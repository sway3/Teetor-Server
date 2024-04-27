import mongoose, { Document } from 'mongoose';

interface IRefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema
);

export default RefreshToken;
