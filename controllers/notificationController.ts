import { Request, Response } from 'express';

import Notification from '../models/notificationModel';
import MentoringSession from '../models/mentoringSessionModel';
import User from '../models/userModel';
import { getUserId } from '../utils/authFunctions';
import Chat from '../models/chatModel';
import Message from '../models/messageModel';

export const getNotificationsController = async (
  req: Request,
  res: Response
) => {
  const accessToken = req.cookies.accessToken;
  const userId = getUserId(accessToken);

  try {
    const notifications = await Notification.find({ recipientId: userId });
    res.status(200).json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMentoringRequestController = async (
  req: Request,
  res: Response
) => {
  const notificationRequestId = req.params.id;

  try {
    const notification = await Notification.findById(notificationRequestId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const menteeInfo = await User.findById(notification.senderId);

    return res.status(200).json({ notification, menteeInfo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const controlMentoringRequestController = async (
  req: Request,
  res: Response
) => {
  const notificationId = req.params.id;
  const { status, title } = req.body;

  try {
    const notification = await Notification.findById(notificationId);
    console.log(notification);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const mentorId = notification.recipientId;
    const mentor = await User.findById(mentorId);

    if (status === 'accepted') {
      console.log(notification.content);

      const mentoringSession = new MentoringSession({
        participants: {
          mentorId: notification.recipientId,
          menteeId: notification.senderId,
        },
        title: title,
        status: 'inProgress',
        startDate: new Date().toISOString(),
        endDate: null,
        mentorInfo: {
          canHelpWith: notification.content.mentorCanHelpWith,
          description: notification.content.mentorDescription,
        },
        menteeInfo: {
          needHelpWith: notification.content.menteeNeedHelpWith,
          description: notification.content.menteeDescription,
        },
        calendar: [],
      });

      const newChat = new Chat({
        participants: [notification.recipientId, notification.senderId],
        latestContent: 'Welcome!',
        timestamp: new Date().toISOString(),
      });

      await Promise.all([newChat.save(), mentoringSession.save()]);

      const resultNotification = new Notification({
        recipientId: notification.senderId,
        senderId: notification.recipientId,
        type: 'mentoring-request-result',
        status: 'accepted',
        message: `Your mentoring request to ${mentor?.firstName} has been accepted. Start off your session by chatting to your mentor!`,
        timestamp: new Date().toISOString(),
      });

      resultNotification.save();
    } else {
      const resultNotification = new Notification({
        recipientId: notification.senderId,
        senderId: notification.recipientId,
        type: 'mentoring-request-result',
        status: 'rejected',
        message: `Your mentoring request to ${mentor?.firstName} has been rejected. Please find another mentor that is available.`,
        timestamp: new Date().toISOString(),
      });

      await resultNotification.save();
    }

    return res.status(200).json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
