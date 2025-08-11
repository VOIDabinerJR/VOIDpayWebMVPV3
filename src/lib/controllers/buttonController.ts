import { decodeToken, createToken } from '../utils/jwt';
import { sendEmail } from '../utils/email';
import { v4 as uuidv4 } from 'uuid';
import User from '../drizzle/models/userModel';
import App from '../drizzle/models/appModel';
import Button from '../drizzle/models/buttonModel';

export interface User {
  id: number;
  email: string;
  // adicione outros campos conforme necessário
}

export interface App {
  id: number;
  clientId: string;
  // adicione outros campos conforme necessário
}

export interface Button {
  name: string;
  userid: string;
  destination: string;
  buttonToken: string;
  appid: number;
}

export interface TokenPayload {
  userid: string;
  destination: string;
  buttonToken: string;
  appid: number;
  name: string;
}

export interface RequestButtonParams {
  clientId: string;
  destination: string;
  name: string;
  token: string;
}

export interface ActivateButtonParams {
  tokeny: string;
}

class AuthService {
  async requestButton(params: RequestButtonParams): Promise<{ msg: string }> {
    const { clientId, destination, name, token } = params;

    const decoded = await decodeToken(token);
    const userResult = await User.findById(decoded.token);

    if (!userResult) {
      throw new Error('User not found');
    }

    const appResult = await App.findByClientId(clientId);
    if (!appResult) {
      throw new Error('User not found');
    }
    const app = appResult[0];

    const user = userResult[0];
    const buttonToken = `VOID-${uuidv4()}`;

    const payload: TokenPayload = {
      userid: user.id,
      destination,
      buttonToken,
      appid: app.id,
      name
    };

    const tokenData = createToken(payload);
    const sent = await sendEmail(
      user.email,
      tokenData,
      destination,
      buttonToken
    );

    if (!sent.status) {
      throw new Error('Email not sent');
    }

    return { msg: 'success' };
  }

  async activateButton(
    params: ActivateButtonParams
  ): Promise<{ buttonToken: string }> {
    const { tokeny } = params;
    const decoded = await decodeToken(tokeny);

    // Validate that decoded has the required TokenPayload properties
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !('name' in decoded) ||
      !('userid' in decoded) ||
      !('destination' in decoded) ||
      !('buttonToken' in decoded) ||
      !('appid' in decoded)
    ) {
      throw new Error('Invalid or malformed token');
    }

    const button: Button = {
      name: (decoded as TokenPayload).name,
      userid: (decoded as TokenPayload).userid,
      destination: (decoded as TokenPayload).destination,
      buttonToken: (decoded as TokenPayload).buttonToken,
      appid: (decoded as TokenPayload).appid
    };

    const [insertResult] = await Button.create(button);

    // Check if insertResult exists and has affectedRows property
    // Check if insertResult exists and is an array with at least one element and affectedRows is 1
    if (
      !Array.isArray(insertResult) ||
      typeof insertResult !== 'object' ||
      insertResult === null ||
      typeof (insertResult as any).affectedRows !== 'number' ||
      (insertResult as any).affectedRows !== 1
    ) {
      throw new Error('Button activation failed');
    }

    // Ensure decoded is of type TokenPayload before accessing buttonToken
    return { buttonToken: (decoded as TokenPayload).buttonToken };
  }
}

export default new AuthService();
