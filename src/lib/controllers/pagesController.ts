import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../drizzle/models/userModel';
import UserDetails from '../drizzle/models/userDetailsModel';
import BusinessDetails from '../drizzle/models/businessModel';
import { createLoginToken, decodeToken } from '../utils/jwt';

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  userId?: string;
}

interface UserDetailsData {
  dateOfBirth?: string;
  address?: string;
  postalCode?: string;
  documentId?: string;
  phone?: string;
  alternativeEmail?: string;
  userId?: string;
}

interface BusinessDetailsData {
  businessName: string;
  legalDocument?: string;
  website?: string;
  address?: string;
  email?: string;
  userId: string;
}

interface PagesController {
  registerUpdate(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
}

// Função corrigida para popular campos atualizados
const populateUpdatedFields = (
  source: Record<string, any>,
  target: Record<string, any>
): void => {
  Object.keys(source).forEach((key) => {
    if (
      source[key] !== undefined &&
      source[key] !== null &&
      source[key] !== ''
    ) {
      target[key] = source[key];
    }
  });
};

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
      phone,
      alternativeEmail,
      businessName,
      legalDocument,
      website,
      form
    } = req.body;

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const decoded = await decodeToken(token);
      const existingUser = await User.findById(decoded.token);

      if (!existingUser || existingUser.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (form === 'user') {
        let userData: Partial<UserData> = {};
        let userDetailsData: Partial<UserDetailsData> = {};

        // Popular campos do usuário
        populateUpdatedFields({ firstName, lastName, username }, userData);

        // Popular campos de detalhes do usuário
        populateUpdatedFields(
          {
            dateOfBirth,
            address,
            postalCode,
            documentId,
            phone,
            alternativeEmail
          },
          userDetailsData
        );

        // Adicionar userId aos detalhes
        userDetailsData.userId = decoded.token;

        // Processar senha se fornecida
        if (password && password.trim() !== '') {
          if (password !== repeatPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
          }
          const hashedPassword = await bcrypt.hash(password, 8);
          userData.password = hashedPassword;
        }

        // Atualizar dados do usuário se houver campos para atualizar
        if (Object.keys(userData).length > 0) {
          const updatedUser = await User.update(decoded.token, userData);
          if (!updatedUser || updatedUser.length === 0) {
            return res.status(500).json({ error: 'Failed to update user' });
          }
        }

        // Processar detalhes do usuário
        const existingUserDetails = await UserDetails.findByUserId(
          decoded.token
        );
        if (existingUserDetails.length === 0) {
          // Criar novos detalhes se não existirem
          const creationResult = await UserDetails.create(
            userDetailsData as any
          );
          if (creationResult.length === 0) {
            return res
              .status(500)
              .json({ error: 'Failed to create user details' });
          }
        } else {
          // Atualizar detalhes existentes
          const updateResult = await UserDetails.update(
            existingUserDetails[0].id,
            userDetailsData
          );
          if (updateResult.length === 0) {
            return res
              .status(500)
              .json({ error: 'Failed to update user details' });
          }
        }

        return res.json({
          status: 'success',
          message: 'User data updated successfully'
        });
      } else if (form === 'business') {
        let businessDetails: Partial<BusinessDetailsData> = {};

        populateUpdatedFields(
          { businessName, legalDocument, website, address, email },
          businessDetails
        );
        businessDetails.userId = decoded.token;

        const existingBusinessDetails = await BusinessDetails.findByUserId(
          decoded.token
        );
        if (existingBusinessDetails.length === 0) {
          const creationResult = await BusinessDetails.create(businessDetails);
          if (creationResult.length === 0) {
            return res
              .status(500)
              .json({ error: 'Failed to create business details' });
          }
        } else {
          const updateResult = await BusinessDetails.update(
            existingBusinessDetails[0].id,
            businessDetails
          );
          if (updateResult.length === 0) {
            return res
              .status(500)
              .json({ error: 'Failed to update business details' });
          }
        }

        return res.json({
          status: 'success',
          message: 'Business data updated successfully'
        });
      }

      return res.status(400).json({ error: 'Invalid form type' });
    } catch (error: any) {
      console.error('Error in registerUpdate:', error);
      return res
        .status(500)
        .json({ error: 'Server error', details: error.message });
    }
  },

  login: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Email and password are required' });
      }

      const user = await User.findByEmail(email);

      if (user.length === 0) {
        return res.status(404).json({ error: 'Email incorrect' });
      }

      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password incorrect' });
      }

      const token = await createLoginToken(user[0].id);

      return res.status(200).json({
        token,
        user: {
          id: user[0].id,
          email: user[0].email,
          firstName: user[0].firstName,
          lastName: user[0].lastName
        }
      });
    } catch (error: any) {
      console.error('Error in login:', error);
      return res
        .status(500)
        .json({ error: 'Server error', details: error.message });
    }
  }
};

export default pagesController;
