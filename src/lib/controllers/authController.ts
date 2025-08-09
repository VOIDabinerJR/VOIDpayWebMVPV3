// app/controllers/authController.ts
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import DynamicData from '../models/dynamicDataModel';
import Wallet from '../models/walletModel';
import Statistics from '../models/statisticsModel';
import { createLoginToken, createToken, decodeToken } from '../utils/jwt';
import { sendRecoverEmail } from '../utils/email';
import { shortID } from '../utils/functions';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export const authService = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) => {
    const { firstName, lastName, username, email, password, repeatPassword } =
      userData;

    if (password !== repeatPassword) {
      throw new Error('Passwords do not match');
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser.length > 0) {
      throw new Error('Email is already in use');
    }

    const username1 = username.replace(/\s+/g, '') + shortID();
    const hashedPassword = await bcrypt.hash(password, 8);
    const user: UserData = {
      firstName,
      lastName,
      username: username1,
      email,
      password: hashedPassword
    };

    const insertResult = await User.create(user);

    // Check if insertResult has affectedRows property directly (e.g., MySQL2 returns ResultSetHeader)
    if ('affectedRows' in insertResult && insertResult.affectedRows === 1) {
      const userRows = await User.findByEmail(email);
      if (!Array.isArray(userRows) || userRows.length === 0) {
        throw new Error('Failed to retrieve newly created user');
      }
      const newUser = userRows[0];
      const token = createLoginToken(newUser.id);

      const walletData = {
        userid: newUser.id
      };
      const wallet = await Wallet.create(walletData);

      return { token, wallet };
    } else {
      throw new Error('User registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;

    const [user] = await User.findByEmail(email);

    if (user.length <= 0) {
      throw new Error('Email incorrect');
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      throw new Error('Password incorrect');
    }

    const token = await createLoginToken(user[0].id);
    return { token };
  },

  recoverAccount: async (email: string) => {
    const [user] = await User.findByEmail(email);

    if (!user) {
      throw new Error('Email incorrect');
    }

    const token = createToken(user[0]);
    const sent = await sendRecoverEmail(email, token);

    if (!sent.status) {
      throw new Error('Verification email not sent');
    }

    return { success: true };
  },

  resetPassword: async (data: {
    password: string;
    repeatPassword: string;
    token: string;
  }) => {
    const { password, repeatPassword, token } = data;

    if (password !== repeatPassword) {
      throw new Error('Passwords do not match');
    }

    const decoded = await decodeToken(token);
    const [existingUser] = await User.findByEmail(decoded.email);

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = { password: hashedPassword };
    const [insertResult] = await User.update(user, existingUser[0].id);

    if (insertResult.affectedRows !== 1) {
      throw new Error('Password NOT updated');
    }

    return { message: 'success' };
  },

  loadData: async (token: string) => {
    const decoded = await decodeToken(token);
    const [user, userStatistics] = await Promise.all([
      DynamicData.getUserDataById(decoded.token),
      Statistics.getStatistics(decoded.token)
    ]);

    if (!user) {
      throw new Error('Error loading data');
    }

    return { user, userStatistics };
  }
};
