import { Request, Response } from 'express';
import User from '../models/userModel';
import Notification from '../models/notificationModel';
import MentoringInfo from '../models/mentoringSessionModel';
import { hasDuplicates } from '../utils/userUtility';
import mongoose from 'mongoose';
import { getUserInfo } from '../utils/functions';
import {
  addAccessTokenCookie,
  addRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
  getUserId,
} from '../utils/authFunctions';
import RefreshToken from '../models/refreshTokenModel';

export const getUserInfoController = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  const userId = getUserId(accessToken);
  const userInfo = await getUserInfo(userId);

  return res.json(userInfo);
};

export const getMentorsController = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const userId = getUserId(accessToken);
  const menteeInfo = req.body;

  console.log('info', menteeInfo);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mentors = await User.find({
      role: { $in: ['Mentor'] },
      _id: { $ne: userId },
    });

    console.log(mentors);

    const filteredMentors = mentors.filter((mentor) => {
      let mentorCanHelpWith = mentor.mentorCanHelpWith;
      const menteeNeedHelpWith = menteeInfo.needHelpWith;

      console.log('mentorCanHelpWith: ', mentorCanHelpWith);

      const mentorAvailableDays = mentor.availableDays;
      const menteeAvailableDays = user.availableDays;

      if (
        hasDuplicates(mentorAvailableDays, menteeAvailableDays) &&
        hasDuplicates(menteeNeedHelpWith, mentorCanHelpWith)
      ) {
        return true;
      }
    });

    res.status(200).json(filteredMentors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const saveNewRefreshToken = async (id: string, token: string) => {
  try {
    const newRefreshToken = new RefreshToken({
      userId: id,
      token: token,
      expiresAt: Math.floor(Date.now()) + 30 * 24 * 60 * 1000,
      createdAt: Date.now(),
    });

    const savedToken = await newRefreshToken.save();
  } catch (error) {
    throw new Error(`error: ${error}`);
  }
};

export const userSignUpController = async (req: Request, res: Response) => {
  const userInfo = req.body;

  try {
    const newUser = await User.create(userInfo);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    if (accessToken && refreshToken) {
      addAccessTokenCookie(res, accessToken);
      addRefreshTokenCookie(res, refreshToken);
    }

    if (refreshToken) await saveNewRefreshToken(newUser.id, refreshToken);

    res.status(200).json({ status: 'signup successful' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

export const userLogoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const removeToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ status: 'logout successful' });
  } catch (error) {
    console.log(error);
    res.status(500).send('internal server error');
  }
};

export const userProfileEditController = async (
  req: Request,
  res: Response
) => {
  const accessToken = req.cookies.accessToken;
  const userId = getUserId(accessToken);
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User data updated');
  } catch (error) {
    console.error('Error updating user: ', error);
    res.status(500).send('Error occurred while updating the user');
  }
};
