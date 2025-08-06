import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Button from '../models/buttonModel';
import User from '../models/userModel';
import App from '../models/appModel';
import { sendEmail } from '../utils/email';
import { createToken, decodeToken } from '../utils/jwt';

dotenv.config();

interface ButtonPayload {
  userid: number;
  destination: string;
  buttonToken: string;
  appid: number;
  name: string;
}

interface ButtonRequest {
  clientId: string;
  destination: string;
  name: string;
  token: string;
}

interface ButtonActivation {
  name: string;
  userid: number;
  destination: string;
  buttonToken: string;
  appid: number;
}

export const requestButton = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { clientId, destination, name, token }: ButtonRequest = req.body;

  try {
    const decoded = await decodeToken(token);
    const [userResult] = await User.findById(decoded.token);

    if (userResult.length > 0) {
      const [appResult] = await App.findByClientId(clientId);

      if (appResult.length > 0) {
        const user = userResult[0];
        const email = user.email;
        const buttonToken = `VOID-${uuidv4()}`;

        const payload: ButtonPayload = {
          userid: user.id,
          destination: destination,
          buttonToken: buttonToken,
          appid: appResult[0].id,
          name: name
        };

        const tokenData = createToken(payload);
        console.log(email, tokenData, destination, buttonToken);

        const sent = await sendEmail(
          email,
          tokenData,
          destination,
          buttonToken
        );

        if (sent.status) {
          return res.status(200).json({ msg: 'success' });
        } else {
          return res.status(209).json({ msg: 'email not sent' });
        }
      }
    } else {
      return res.status(404).json({ err: 'user not found' });
    }
    return res.status(404).json({ err: 'app not found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: 'Server error', error });
  }
};

export const activateButton = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tokeny } = req.body;

  try {
    const decodedUnknown = await decodeToken(tokeny);
    const decoded = decodedUnknown as unknown as ButtonPayload;

    const button: ButtonActivation = {
      name: decoded.name,
      userid: decoded.userid,
      destination: decoded.destination,
      buttonToken: decoded.buttonToken,
      appid: decoded.appid
    };

    const [insertResult] = await Button.create(button);

    if (insertResult.affectedRows === 1) {
      return res.status(200).json({ buttonToken: decoded.buttonToken });
    } else {
      return res.status(500).json({ err: 'Button activation failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: 'Server error', error });
  }
};
