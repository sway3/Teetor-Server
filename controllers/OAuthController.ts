import { Request, Response } from 'express';

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import {
  addAccessTokenCookie,
  addRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/authFunctions';

import RefreshToken from '../models/refreshTokenModel';
import User from '../models/userModel';
import { access } from 'fs';

require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const getGoogleOAuthToken = async (code: string) => {
  const client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  const { tokens } = await client.getToken(code);
  return tokens;
};

const getGoogleOAuthUserInfo = async (tokens: any): Promise<any> => {
  const client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  client.setCredentials({ access_token: tokens.access_token });
  const peopleService = google.people({ version: 'v1', auth: client });

  try {
    const res = await peopleService.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });

    const data = res.data;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`error: ${error}`);
  }
};

const checkOAuthIdentifier = async (oAuthIdentifier: string): Promise<any> => {
  const user = await User.find({ oAuthIdentifier: oAuthIdentifier });
  return user[0];
};

const saveNewRefreshToken = async (id: string, token: string) => {
  try {
    console.log('userId', id);
    const newRefreshToken = new RefreshToken({
      userId: id,
      token: token,
      expiresAt: Math.floor(Date.now()) + 30 * 24 * 60 * 1000,
      createdAt: Date.now(),
    });

    const savedToken = await newRefreshToken.save();
  } catch (error) {
    console.log('error occurred in saving new refresh token');
    throw new Error(`error: ${error}`);
  }
};

export const googleOAuthController = async (req: Request, res: Response) => {
  console.log(req.body);
  const code = req.body.code;
  try {
    const tokens = await getGoogleOAuthToken(code);
    const data = await getGoogleOAuthUserInfo(tokens);

    const oAuthIdentifer = data?.resourceName;

    const user = await checkOAuthIdentifier(oAuthIdentifer);

    console.log(user);

    if (user && user.length !== 0) {
      try {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        if (accessToken && refreshToken) {
          await saveNewRefreshToken(user._id, refreshToken);

          addAccessTokenCookie(res, accessToken);
          addRefreshTokenCookie(res, refreshToken);

          res.status(200).json({
            status: 'auth_successful',
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const userInfo = {
        firstName: data.names[0].givenName,
        lastName: data.names[0].familyName,
        email: data.emailAddresses[0].value,
        oAuthIdentifier: data.resourceName,
      };

      res.status(200).json({
        status: 'signup_required',
        userInfo,
      });
    }
  } catch (error) {
    console.error('OAuth error: ', error);
    res.status(500).send('Invalid google token');
  }
};
