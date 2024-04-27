import { Request, Response } from 'express';
import {
  getUserInfo,
  getNotification,
  getMentoringSessions,
} from '../utils/functions';
import { decrypt } from '../utils/authFunctions';
import jwt from 'jsonwebtoken';

export const getDashInfoController = async (req: Request, res: Response) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('error');
  }

  const accessToken = req.cookies.accessToken;
  const decryptedToken = decrypt(accessToken);

  const decodedToken = jwt.verify(decryptedToken, ACCESS_TOKEN_SECRET) as {
    userId: string;
  };

  const userId = decodedToken.userId;

  try {
    const [userInfo, notification, mentoringSessions] = await Promise.all([
      getUserInfo(userId),
      getNotification(userId),
      getMentoringSessions(userId),
    ]);

    res.json({ userInfo, notification, mentoringSessions });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send(
        'Error occurred when fetching dashboard information from the database'
      );
  }
};
