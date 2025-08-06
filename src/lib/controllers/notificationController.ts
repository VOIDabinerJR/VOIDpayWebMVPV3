import { Request, Response } from 'express';
import User from '../models/userModel';
import App from '../models/appModel';
import jwt from 'jsonwebtoken';
import Notifications from '../models/notificationModel';

interface UserResult {
  length: number;
  [index: number]: {
    // Define the structure of your user object here
    id: number;
    // Add other user properties as needed
  };
}

export const sendNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; // Assuming the ID comes from route params
  // or const { id } = req.body; if it comes from request body

  try {
    const [userResult]: [UserResult] = await User.findById(id);

    if (userResult.length > 0) {
      const user = userResult[0];
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ err: 'Server error', error });
  }
};

// Alternative version if you want to use req.body for the ID
export const sendNotificationBody = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.body;

  try {
    const [userResult]: [UserResult] = await User.findById(id);

    if (userResult.length > 0) {
      const user = userResult[0];
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ err: 'Server error', error });
  }
};
