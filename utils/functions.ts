import User, { IUser } from '../models/userModel';
import Notification, { INotification } from '../models/notificationModel';
import MentoringSession, {
  IMentoringSession,
} from '../models/mentoringSessionModel';

export const getUserInfo = async (id: string): Promise<IUser | null> => {
  const userInfo = await User.findById(id);
  return userInfo;
};

export const getNotification = async (
  id: string
): Promise<INotification[] | null> => {
  const notification = await Notification.find({ recipientId: id });
  return notification;
};

export const getMentoringSessions = async (
  id: string
): Promise<IMentoringSession[] | null> => {
  const mentoringSessions = await MentoringSession.find({
    $or: [{ 'participants.mentorId': id }, { 'participants.menteeId': id }],
  });

  return mentoringSessions;
};
