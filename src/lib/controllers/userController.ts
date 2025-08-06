import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import App from '../models/appModel';
import Shopify from '../models/shopifyModel';
import Product from '../models/productModel';
import { createLoginToken, createToken, decodeToken } from '../utils/jwt';
import { generateClientId, generateClientSecret } from '../utils/functions';

interface DecodedToken {
  id: number;
  token?: string;
  [key: string]: any;
}

interface UserResult {
  length: number;
  [index: number]: {
    id: number;
    [key: string]: any;
  };
}

interface AppData {
  userid: number;
  type: string;
  name: string;
  clientid: string;
  clientsecret: string;
}

interface ShopifyData {
  userid: number;
  accesstokenshopify: string;
  urlShopify: string;
  apikeyshopify: string;
  secretkeyshopify: string;
  buttontoken: string;
}

interface ProductData {
  name: string;
  originProductId: number;
  price: number;
  quantityOrdered: number;
  orderId: number | null;
  userid: number;
  imageUrl: string;
}

export const checkToken = (req: Request, res: Response): void => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      'oi',
      (err: jwt.VerifyErrors | null, decodedToken: any) => {
        if (err) {
          res.status(401).json({ error: 'Token is invalid or expired' });
        } else if (
          decodedToken &&
          typeof decodedToken === 'object' &&
          'id' in decodedToken
        ) {
          res.status(200).json({ id: (decodedToken as any).id });
        } else {
          res.status(400).json({ error: 'Invalid token payload' });
        }
      }
    );
  } else {
    res.status(400).json({ error: 'Token not provided' });
  }
};

export const checkUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.body;

  try {
    const userResult = await User.findById(id);

    // Assuming userResult is a QueryResult (array of rows)
    if (Array.isArray(userResult) && userResult.length > 0) {
      const user = userResult[0];
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createApp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { type, name, token } = req.body;

  try {
    const decoded = await decodeToken(token);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    const userResult = await User.findById((decoded as any).id);

    // Assuming userResult is a QueryResult (array of rows)
    if (Array.isArray(userResult) && userResult.length > 0) {
      const clientid = generateClientId();
      const clientsecret = generateClientSecret();

      const app: AppData = {
        userid: (decoded as any).id,
        type: type,
        name: name,
        clientid: clientid,
        clientsecret: clientsecret
      };

      const insertResult = await App.create(app);

      // Check if insertResult has affectedRows property and it's 1
      if (
        insertResult &&
        typeof insertResult === 'object' &&
        'affectedRows' in insertResult &&
        (insertResult as any).affectedRows === 1
      ) {
        return res.status(200).json({ app });
      } else {
        return res.status(500).json({ err: 'Error during creation' });
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error creating app:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const shopifyCredentials = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    accessTokenShopify,
    apiKeyShopify,
    urlShopify,
    secretKeyShopify,
    buttonToken,
    token
  } = req.body;

  try {
    const decoded = await decodeToken(token);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const userResult = await User.findById((decoded as any).id);

    if (Array.isArray(userResult) && userResult.length > 0) {
      const shopify: ShopifyData = {
        userid: (decoded as any).id,
        accesstokenshopify: accessTokenShopify,
        urlShopify: urlShopify,
        apikeyshopify: apiKeyShopify,
        secretkeyshopify: secretKeyShopify,
        buttontoken: buttonToken
      };

      const [result] = await Shopify.findByUserId((decoded as any).id);
      let insertResult;

      if (result && typeof result === 'object' && 'id' in result) {
        [insertResult] = await Shopify.update(shopify, (result as any).id);
      } else {
        [insertResult] = await Shopify.create(shopify);
      }

      if (
        insertResult &&
        typeof insertResult === 'object' &&
        ('affectedRows' in insertResult
          ? insertResult.affectedRows === 1
          : true)
      ) {
        return res.status(200).json({ shopify });
      } else {
        return res.status(500).json({ err: 'Error during creation/update' });
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error handling Shopify credentials:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const saveProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productName, productImageUrl, productPrice, ProductQuantity, token } =
    req.body;

  try {
    const decoded = await decodeToken(token);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    const userResult = await User.findById((decoded as any).id);

    if (Array.isArray(userResult) && userResult.length > 0) {
      const product: ProductData = {
        name: productName,
        originProductId: 1000, // 1000 means it's a created product, not imported
        price: productPrice,
        quantityOrdered: ProductQuantity,
        orderId: null,
        userid: (decoded as any).id,
        imageUrl: productImageUrl
      };

      const [insertResult] = await Product.create(product);

      // Fix: insertResult may not have affectedRows property, check for insertResult truthiness instead
      if (
        insertResult &&
        typeof insertResult === 'object' &&
        ('affectedRows' in insertResult
          ? insertResult.affectedRows === 1
          : true)
      ) {
        return res.status(200).json({ product });
      } else {
        return res.status(500).json({ err: 'Error during creation' });
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error saving product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
