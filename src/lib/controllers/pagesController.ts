import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../drizzle/models/userModel';
import UserDetails from '../drizzle/models/userDetailsModel';
import BusinessDetails from '../drizzle/models/businessModel';
import App from '../drizzle/models/appModel';
import Wallet from '../drizzle/models/walletModel';
// import DynamicData from '../drizzle/models/dynamicDataModell';
import { createLoginToken, createToken, decodeToken } from '../utils/jwt';
import { sendEmail, sendRecoverEmail } from '../utils/email';
import { populateUpdatedFields } from '../utils/functions.js';

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  userId?: string | number;
}

interface UserDetailsData {
  dateOfBirth?: string;
  address?: string;
  postalCode?: string;
  documentId?: string;
  phone?: string;
  alternativeEmail?: string;
  userId?: string | number;
}

interface BusinessDetailsData {
  businessName?: string;
  legalDocument?: string;
  website?: string;
  address?: string;
  email?: string;
  userId?: string | number;
}

interface PagesController {
  registerUpdate(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
}

const pagesController: PagesController = {
  registerUpdate: async (req: Request, res: Response): Promise<Response> => {
    const {
      token,
      firstName,
      lastName,
      username,
      email,
      password,
      repeatPassword,
      dateOfBirth,
      address,
      postalCode,
      documentId,
      documentIdImg,
      phone,
      alternativeEmail,
      businessName,
      legalDocument,
      website,
      form
    } = req.body;

    try {
      const file = (req as any).file;
      if (file) {
        console.log('File uploaded:', file.filename);
      }

      const decoded = await decodeToken(token);
      const existingUser = await User.findById(decoded.token);

      if (!existingUser) {
        return res.status(400).json({ error: 'user not found' });
      }

      if (form === 'user') {
        let userData: UserData = {};
        let userDetails: UserDetailsData = {};

        populateUpdatedFields(
          { firstName, lastName, username, password },
          userData
        );
        populateUpdatedFields(
          {
            dateOfBirth,
            address,
            postalCode,
            documentId,
            phone,
            alternativeEmail
          },
          userDetails
        );

        userData.userId = decoded.token;
        userDetails.userId = decoded.token;

        if (password && password.trim() !== '') {
          const hashedPassword = await bcrypt.hash(password, 8);
          userData.password = hashedPassword;
        }

        // Handle User Details
        const [existingUserDetails] = await UserDetails.findByUserId(
          decoded.token
        );
        if (existingUserDetails.length <= 0) {
          const [creationUserDetails] = await UserDetails.create(userDetails);
          if (creationUserDetails.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
          return res.json({ status: 'failed' });
        } else {
          const [updateUserDetails] = await UserDetails.update(
            userDetails,
            existingUserDetails[0].id
          );
          if (updateUserDetails.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
        }

        // Handle User
        const [existingUserData] = await User.findById(decoded.token);
        if (existingUserData.length <= 0) {
          const [creationUser] = await User.create(userData);
          if (creationUser.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
          return res.json({ status: 'failed' });
        } else {
          const [updateUser] = await User.update(
            userData,
            existingUserData[0].id
          );
          if (updateUser.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
        }

        return res.json({ error: '' });
      } else if (form === 'business') {
        let businessDetails: BusinessDetailsData = {};

        populateUpdatedFields(
          { businessName, legalDocument, website, address, email },
          businessDetails
        );
        businessDetails.userId = decoded.token;

        const [existingBusinessDetails] = await BusinessDetails.findByUserId(
          decoded.token
        );
        if (existingBusinessDetails.length <= 0) {
          const [creationBusinessDetails] =
            await BusinessDetails.create(businessDetails);
          if (creationBusinessDetails.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
          return res.json({ status: 'failed' });
        } else {
          const [updateBusinessDetails] = await BusinessDetails.update(
            businessDetails,
            existingBusinessDetails[0].id
          );
          if (updateBusinessDetails.affectedRows === 1) {
            return res.json({ status: 'success' });
          }
        }

        return res.json({ error: '' });
      }

      return res.status(400).json({ error: 'Invalid form type' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: 'Server error', error: error });
    }
  },

  login: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const [user] = await User.findByEmail(email);

      if (user.length <= 0) {
        return res.status(404).json({ err: 'Email incorrect' });
      }

      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ err: 'Password incorrect' });
      }

      const token = await createLoginToken(user[0].id);

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: 'Server error' });
    }
  }
};

export default pagesController;
