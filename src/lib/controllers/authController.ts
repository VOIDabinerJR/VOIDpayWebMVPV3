// app/controllers/authController.ts
import bcrypt from 'bcryptjs';
import User from '../drizzle/models/userModel';
import DynamicData from '../drizzle/models/dynamicDataModel';
import Wallet from '../drizzle/models/walletModel';
// import Statistics from '../drizzle/models/statisticsModel';
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
    console.log('Usuário existente:', existingUser);
    if (existingUser) {
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

    const [newUser] = await User.create(user);

    if (!newUser || !newUser.id) {
      throw new Error('Failed to create user');
    }

    const token = createLoginToken(newUser.id);

    const walletData = {
      userId: newUser.id
    };
    const [wallet] = await Wallet.create(walletData);

    return { token, wallet };
  },

  login: async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials;

    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error('Email incorrect');
    }

    if (!user.password) {
      throw new Error('User data is invalid');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Password incorrect');
    }

    const token = await createLoginToken(user.id);
    return { token };
  },

  recoverAccount: async (email: string) => {
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error('Email incorrect');
    }

    const token = createToken(user);
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
    const existingUser = await User.findByEmail(decoded.email);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const [updatedUser] = await User.update(existingUser.id, {
      password: hashedPassword
    });

    if (!updatedUser) {
      throw new Error('Password NOT updated');
    }

    return { message: 'success' };
  },

  loadData: async (data: { token: string }) => {
    console.log('aaaa' + data.token);
    const decoded = await decodeToken(data.token);
    // const [user, userStatistics] = await Promise.all([
    const [user] = await Promise.all([
      DynamicData.getUserDataById(decoded.token)
      // Statistics.getStatistics(decoded.token)
    ]);

    if (!user) {
      throw new Error('Error loading data');
    }

    return { user };
    // return { user, userStatistics };
  }
};
