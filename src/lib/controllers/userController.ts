import jwt from 'jsonwebtoken';
import User from '../drizzle/models/userModel';
import App from '../drizzle/models/appModel';
import Product from '../drizzle/models/productModel';
import { createLoginToken, createToken, decodeToken } from '../utils/jwt';
import { generateClientId, generateClientSecret } from '../utils/functions';

interface DecodedToken {
  id: string;
  token?: string;
  [key: string]: any;
}

interface AppData {
  userId: string;
  type: 'test' | 'production';
  name: string;
  clientId: string;
  clientSecret: string;
}

interface ProductData {
  name: string;
  originProductId: string;
  price: string;
  quantityOrdered: number;
  orderId: number | null;
  userId: string;
  imageUrl?: string;
}

export const checkToken = async (
  token: string
): Promise<{ id: string } | { error: string }> => {
  if (!token) {
    return { error: 'Token not provided' };
  }

  try {
    const decodedToken = await new Promise<DecodedToken>((resolve, reject) => {
      jwt.verify(token, 'oi', (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded as DecodedToken);
      });
    });

    if (decodedToken && 'id' in decodedToken) {
      return { id: decodedToken.id };
    } else {
      return { error: 'Invalid token payload' };
    }
  } catch (error) {
    return { error: 'Token is invalid or expired' };
  }
};

export const checkUser = async (
  id: string
): Promise<{ user: any } | { error: string }> => {
  try {
    const userResult = await User.findById(id);

    if (userResult && userResult.length > 0) {
      return { user: userResult[0] };
    } else {
      return { error: 'User not found' };
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return { error: 'Server error' };
  }
};

export const createApp = async (
  type: 'test' | 'production',
  name: string,
  token: string
): Promise<{ app: AppData } | { error: string }> => {
  try {
    const decoded = await decodeToken(token);
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return { error: 'Invalid token' };
    }

    const userResult = await User.findById(decoded.id);
    if (!userResult || userResult.length === 0) {
      return { error: 'User not found' };
    }

    const clientId = generateClientId();
    const clientSecret = generateClientSecret();

    const app: AppData = {
      userId: decoded.id,
      type,
      name,
      clientId,
      clientSecret
    };

    const insertResult = await App.create(app);
    if (insertResult && insertResult.length > 0) {
      return { app };
    } else {
      return { error: 'Error during creation' };
    }
  } catch (error) {
    console.error('Error creating app:', error);
    return { error: 'Server error' };
  }
};

export const saveProduct = async (
  productName: string,
  productImageUrl: string,
  productPrice: string,
  productQuantity: number,
  token: string
): Promise<{ product: ProductData } | { error: string }> => {
  try {
    const decoded = await decodeToken(token);
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return { error: 'Invalid token' };
    }

    const userResult = await User.findById(decoded.id);
    if (!userResult || userResult.length === 0) {
      return { error: 'User not found' };
    }

    const product: ProductData = {
      name: productName,
      originProductId: '1000', // 1000 means it's a created product, not imported
      price: productPrice,
      quantityOrdered: productQuantity,
      orderId: null,
      userId: decoded.id,
      imageUrl: productImageUrl
    };

    const insertResult = await Product.create(product);
    if (insertResult && insertResult.length > 0) {
      return { product };
    } else {
      return { error: 'Error during creation' };
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return { error: 'Server error' };
  }
};
