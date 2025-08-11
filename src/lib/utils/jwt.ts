import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { shortID } from './functions';

interface JwtPayload {
  [key: string]: any;
}

interface LoginTokenPayload {
  token: string;
}

interface MobileWalletPaymentDetails {
  transaction_reference?: string;
  mobileWalletNumber: string;
  totalAmount: number;
  third_party_reference?: string;
  query_reference?: string | null;
  security_credential?: string | null;
  initiator_identifier?: string | null;
  reversal_amount?: number | null;
  transaction_id?: string | null;
}

interface MobileWalletTokenPayload {
  transaction_reference: string;
  transactionReference: string;
  customer_msisdn: string;
  amount: number;
  third_party_reference: string;
  orderId: string;
  query_reference: string | null;
  security_credential: string | null;
  initiator_identifier: string | null;
  reversal_amount: number | null;
  transaction_id: string | null;
}

const createToken = (payload: JwtPayload): string => {
  if (!process.env.PAY_SECRET) {
    throw new Error('PAY_SECRET environment variable is not defined');
  }
  return jwt.sign(payload, process.env.PAY_SECRET, {
    expiresIn: '3d'
  });
};

const decodeToken = async (token: string): Promise<JwtPayload> => {
  if (!process.env.PAY_SECRET) {
    throw new Error('PAY_SECRET environment variable is not defined');
  }

  try {
    const decodedPayload = jwt.verify(
      token,
      process.env.PAY_SECRET
    ) as JwtPayload;
    return decodedPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado. Por favor, faça login novamente.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido. Por favor, faça login novamente.');
    } else {
      throw new Error('Erro ao decodificar o token.');
    }
  }
};

const createLoginToken = async (token: string): Promise<string> => {
  const payload: LoginTokenPayload = {
    token: token
  };

  return createToken(payload);
};

const createMobileWalletToken = async (
  orderId: string,
  paymentDetails: MobileWalletPaymentDetails
): Promise<string> => {
  const payload: MobileWalletTokenPayload = {
    transaction_reference:
      paymentDetails.transaction_reference || `VOID${shortID()}`,
    transactionReference:
      paymentDetails.transaction_reference || `VOID${shortID()}`,
    customer_msisdn: paymentDetails.mobileWalletNumber,
    amount: paymentDetails.totalAmount,
    third_party_reference:
      paymentDetails.third_party_reference || `COST${shortID()}`,
    orderId: orderId,
    query_reference: paymentDetails.query_reference || null,
    security_credential: paymentDetails.security_credential || null,
    initiator_identifier: paymentDetails.initiator_identifier || null,
    reversal_amount: paymentDetails.reversal_amount || null,
    transaction_id: paymentDetails.transaction_id || null
  };

  return createToken(payload);
};

const createCardToken = (a: any, b: any, c: any, d: any): null => {
  return null;
};

const createPaypalToken = (a: any, b: any, c: any, d: any): null => {
  return null;
};

export {
  createToken,
  decodeToken,
  createMobileWalletToken,
  createCardToken,
  createPaypalToken,
  createLoginToken
};
