import { Request, Response } from 'express';

import User from '../models/userModel';
import Notification from '../models/notificationModel';
import MentoringInfo from '../models/mentoringSessionModel';

import { getUserId } from '../utils/authFunctions';
import MentoringSession from '../models/mentoringSessionModel';

export const getMentoringInfoController = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.id;

  try {
    const mentoringInfo = await MentoringInfo.find({
      participants: { menteeId: userId },
    });
    res.status(200).json(mentoringInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const mentoringRequestController = async (
  req: Request,
  res: Response
) => {
  const { mentorId, menteeInfo } = req.body;
  const accessToken = req.cookies.accessToken;
  const menteeId = getUserId(accessToken);
  const mentor = await User.findById(mentorId);

  console.log(menteeInfo);

  try {
    const notification = new Notification({
      recipientId: mentorId,
      senderId: menteeId,
      type: 'mentoring-request',
      status: 'pending',
      message: 'You have a new mentoring request',
      content: {
        mentorCanHelpWith: mentor?.mentorCanHelpWith,
        mentorDescription: mentor?.mentorDescription,
        menteeNeedHelpWith: menteeInfo.needHelpWith,
        menteeDescription: menteeInfo.description,
      },
      timestamp: new Date().toISOString(),
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addNewEventController = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const newEvent = req.body;

  try {
    await MentoringSession.findByIdAndUpdate(
      sessionId,
      {
        $push: { calendar: newEvent },
      },
      { new: true }
    );

    res.status(201).send('new event successfully added');
  } catch (error) {
    console.error('Error occurred in addNewEventController');
    res.status(500).json('error in addNewEventController');
  }
};

export const loadEventsController = async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    const session = await MentoringSession.findById(sessionId);
    const events = session?.calendar;
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json('Error occurred in loadEventsController');
    console.error(error);
  }
};

export const removeEventController = async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const eventId = req.params.eventId;

  try {
    await MentoringSession.findByIdAndUpdate(sessionId, {
      $pull: { calendar: { _id: eventId } },
    });

    res.status(200).send('remove event successful');
  } catch (error) {
    console.error('removeEventController error: ', error);
    res.status(500).json('error occurred in removeEventController');
  }
};

export const editEventController = async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const eventId = req.params.eventId;
  const eventData = {
    title: req.body.eventInfo.title,
    date: req.body.eventInfo.date,
    description: req.body.eventInfo.description,
  };

  console.log(eventData);

  try {
    await MentoringSession.updateOne(
      { _id: sessionId, 'calendar._id': eventId },
      {
        $set: {
          'calendar.$': eventData,
        },
      }
    );

    res.status(200).send('edit event successful');
  } catch (error) {
    console.error('error in edit event controller: ', error);
    res.status(500).send('error occurred in edit event controller');
  }
};
