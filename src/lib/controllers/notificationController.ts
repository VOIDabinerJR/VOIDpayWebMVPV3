import { Request, Response } from 'express';
import { Notification } from '../drizzle/models/notificationModel';
import { User } from '../drizzle/models/userModel';

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  isRead?: boolean;
}

export const sendNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: userId, title, message' });
  }

  try {
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create notification
    const notificationData: NotificationData = {
      userId,
      title,
      message,
      isRead: false
    };

    const newNotification = await Notification.create(notificationData);
    return res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getUserNotifications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const notifications = await Notification.readAll(userId);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return res.status(400).json({ error: 'Notification ID is required' });
  }

  try {
    const updatedNotification = await Notification.updateStatus(
      Number(notificationId),
      true
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return res.status(400).json({ error: 'Notification ID is required' });
  }

  try {
    const result = await Notification.delete(Number(notificationId));

    if (!result) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res
      .status(200)
      .json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
