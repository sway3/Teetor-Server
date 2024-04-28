import { Request, Response } from "express";
import {
  getUserInfo,
  getNotification,
  getMentoringSessions,
} from "../utils/functions";
import { getRefreshUserId, getUserId } from "../utils/authFunctions";

export const getDashInfoController = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  let userId: string;

  if (accessToken) {
    userId = getUserId(accessToken);
  } else {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    userId = getRefreshUserId(refreshToken);
  }

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
        "Error occurred when fetching dashboard information from the database"
      );
  }
};
