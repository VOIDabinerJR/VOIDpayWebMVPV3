import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../drizzle/models/userModel';
import Button from '../drizzle/models/buttonModel';
import Order from '../drizzle/models/orderModel';
import Wallet from '../drizzle/models/walletModel';
import {
  createToken,
  createCardToken,
  createPaypalToken,
  createMobileWalletToken,
  decodeToken
} from '../utils/jwt';
import { shortID, hashInfo } from '../utils/functions';
import { sendPaymentConfirmationEmail } from '../utils/email';

dotenv.config();

interface BillingInfo {
  contactName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  postCode: string;
}

interface PaymentDetails {
  transaction_reference: string;
  originAcountId: string | null;
  mobileWalletNumber?: string;
  cardNumber?: string;
  third_party_reference: string;
  paymentMethod?: string;
  totalAmount?: number;
  email?: string;
  contactName?: string;
  description?: string;
  transaction_reference_received?: string | number;
  customer_msisdn?: string;
  amount?: number;
  reversal_amount?: number;
  securityCode?: string;
  expiryDate?: string;
}

interface TransactionData {
  transactionId: string;
  amount: number | undefined;
  date: string;
}

export const routTester = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  console.log(data);
  return res.send('Form submitted');
};

export const getPaymentPage = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const orderid = Number(req.query.orderid);
  const buttonToken = req.query.buttontoken as string;
  console.log(req.query);

  let queryy: string;
  if (req.query.channel) {
    queryy = `orderid=${orderid}&buttontoken=${buttonToken}&channel=${req.query.channel}`;
  } else {
    queryy = `orderid=${orderid}&buttontoken=${buttonToken}`;
  }

  try {
    const orderResult = await Order.findById(orderid);
    const orderItem = await Order.findByIdOrderItems(orderid);

    if (orderResult) {
      const order = orderResult;
      const orderData = {
        orderItems: orderItem,
        subtotal: order.totalAmount,
        totalAmount: order.totalAmount
      };

      if (String(order.buttonToken).trim() !== String(buttonToken).trim()) {
        return res.json({ error: 'unauthorized' });
      } else {
        return res.render('index', { orderData, queryy });
      }
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const processPayment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const billingInfo: BillingInfo = {
    contactName: req.body.contactName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    postCode: req.body.postCode
  };

  const orderId = Number(req.query.orderid);
  const buttonToken = req.query.buttontoken as string;
  const paymentDetails: PaymentDetails = req.body;

  paymentDetails.transaction_reference = `VOID${shortID()}`;
  paymentDetails.originAcountId = (await hashInfo('aa')) || null;

  if (paymentDetails.mobileWalletNumber) {
    paymentDetails.mobileWalletNumber =
      paymentDetails.mobileWalletNumber.replace(/\s+/g, '');
  }
  if (paymentDetails.cardNumber) {
    paymentDetails.cardNumber = paymentDetails.cardNumber.replace(/\s+/g, '');
  }
  paymentDetails.third_party_reference = `VOID${shortID()}`;

  try {
    const orderResult = await Order.findById(orderId);

    if (orderResult) {
      if (
        String(orderResult.buttonToken).trim() !== String(buttonToken).trim()
      ) {
        return res.json({ error: 'unauthorized' });
      }

      const buttonResult = await Button.findByToken(buttonToken);
      const order = orderResult;
      paymentDetails.totalAmount = Number(order.totalAmount);

      if (!paymentDetails.paymentMethod) {
        paymentDetails.paymentMethod = 'card';
      }

      // Test payment scenarios
      if (
        req.body.mobileWalletNumber === '1234' ||
        req.body.cardNumber === '1234'
      ) {
        const transactionData: TransactionData = {
          transactionId: paymentDetails.transaction_reference,
          amount: paymentDetails.totalAmount,
          date: new Date().toLocaleDateString()
        };
        return res.render('paymentConfirmation.ejs', {
          transactionData,
          message: 'Payment processed successfully',
          error: null,
          redirectUrl: 'https://www.google.com'
        });
      } else if (
        req.body.mobileWalletNumber === '0000' ||
        req.body.cardNumber === '0000' ||
        ['card', 'paypal', 'qrcode'].includes(req.body.paymentMethod)
      ) {
        const transactionData: TransactionData = {
          transactionId: paymentDetails.transaction_reference,
          amount: paymentDetails.totalAmount,
          date: new Date().toLocaleDateString()
        };
        return res.render('paymentError.ejs', {
          transactionData,
          message: 'Payment processed successfully',
          error: null,
          redirectUrl: 'https://www.google.com'
        });
      }

      const getPaymentToken = async (option: string): Promise<string> => {
        switch (option) {
          case 'mobileWallet':
            return createMobileWalletToken(orderId.toString(), paymentDetails);
          case 'card':
            return createCardToken(orderId, paymentDetails);
          case 'paypal':
            return createPaypalToken(orderId, paymentDetails);
          default:
            return 'PAY OPTION INVALID';
        }
      };

      const token = await getPaymentToken(paymentDetails.paymentMethod);
      const result = await pay(token);
      paymentDetails.transaction_reference_received =
        result.transaction_reference_received;

      if ([200, 401, 409].includes(result.status_code)) {
        // Handle different channels
        if (req.query.channel === 'rs') {
          try {
            const url =
              (buttonResult && buttonResult[0]?.destination?.toString()) || '';
            const infoToken = createToken(paymentDetails);
            const dados = { token: infoToken };

            await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dados)
            });
          } catch (erro) {
            console.log('Error sending data:', erro);
            return res.status(500).json({
              message: 'Payment processed successfully',
              error: erro
            });
          }
        }

        const updateResult = await Order.update(orderId, {
          orderStatus: 'Completed',
          customerEmail: paymentDetails.email,
          paymentMethod: paymentDetails.paymentMethod,
          customerName: paymentDetails.contactName,
          description: paymentDetails.description || 'None desc.',
          transactionReference: paymentDetails.transaction_reference
        });

        if (updateResult.affectedRows === 1) {
          try {
            const wallet = await Wallet.findByUserId(orderResult.userId);
            console.log(wallet);
            console.log(orderResult.userId);
            if (wallet) {
              const result = await Wallet.deposit(
                'Wallet',
                'Costumer Payment',
                paymentDetails.totalAmount,
                wallet.id,
                orderResult.userId,
                paymentDetails.transaction_reference,
                paymentDetails.transaction_reference_received,
                null
              );
            } else {
              return res.status(404).json({ message: 'Wallet not found' });
            }
          } catch (error) {
            return res.status(500).json({ error: error });
          }

          const transactionData: TransactionData = {
            transactionId: paymentDetails.transaction_reference,
            amount: paymentDetails.totalAmount,
            date: new Date().toLocaleString()
          };

          try {
            const orderItem = await Order.findByIdOrderItems(orderId);
            try {
              const sent1 = await sendPaymentConfirmationEmail(
                billingInfo.email,
                billingInfo,
                transactionData,
                orderItem
              );
              const userEmailResult = await User.retunEmail(orderResult.userId);
              const userEmail = userEmailResult?.email;

              if (userEmail) {
                const sent2 = await sendPaymentConfirmationEmail(
                  userEmail,
                  billingInfo,
                  transactionData,
                  orderItem
                );
                console.log(sent2);
              }

              console.log(sent1);
            } catch (error) {
              console.log('Email error:', error);
            }
          } catch (error) {
            console.log('Order items error:', error);
          }

          // Clean up sensitive data
          delete paymentDetails.cardNumber;
          delete paymentDetails.securityCode;
          delete paymentDetails.expiryDate;
          delete paymentDetails.mobileWalletNumber;

          const infoToken = createToken(paymentDetails);

          return res.render('paymentConfirmation.ejs', {
            transactionData,
            message: 'Payment processed successfully',
            error: null,
            redirectUrl: 'https://www.google.com'
          });
        } else {
          return res.status(500).json({
            message: 'Payment processed successfully',
            error: 'Failed to update order status'
          });
        }
      } else {
        const transactionData: TransactionData = {
          transactionId: paymentDetails.transaction_reference,
          amount: paymentDetails.totalAmount,
          date: new Date().toLocaleString()
        };

        return res.render('paymentError.ejs', {
          transactionData,
          message: 'Payment processed successfully',
          error: null,
          redirectUrl: 'https://www.google.com'
        });
      }
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const processWithdraw = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token, accountNumber, method } = req.body;
  console.log(method);

  const paymentDetails: PaymentDetails = req.body;
  paymentDetails.mobileWalletNumber = paymentDetails.customer_msisdn;
  paymentDetails.totalAmount = paymentDetails.amount;
  paymentDetails.reversal_amount = paymentDetails.amount;

  console.log(paymentDetails);

  try {
    const decoded = await decodeToken(token);
    console.log(decoded);
    const walletResult = await Wallet.findByUserId(decoded.token);

    if (walletResult && 'id' in walletResult) {
      const walletId = walletResult.id;
      const getPaymentToken = async (option: string): Promise<string> => {
        switch (option) {
          case 'mobileWallet':
          case 'M-pesa':
          case 'E-Mola':
          case 'M-khesh':
            return createMobileWalletToken(walletId.toString(), paymentDetails);
          case 'Card':
          case 'MillenimBim':
          case 'BCI':
          case 'EcoBank':
          case 'StandardBank':
            return createCardToken(walletId, paymentDetails);
          case 'Paypal':
            return createPaypalToken(walletId, paymentDetails);
          default:
            return 'PAY OPTION INVALID';
        }
      };

      if (!paymentDetails.paymentMethod) {
        console.error('paymentMethod is undefined');
        return res.status(400).json({ error: 'Payment method is required' });
      }

      const token2 = await getPaymentToken(
        paymentDetails.paymentMethod.toString()
      );
      console.log(token2);
      console.log('and');

      const result = await withdraw2(token2);
      paymentDetails.transaction_reference = `VOID${shortID()}`;
      paymentDetails.transaction_reference_received =
        result.body?.output_TransactionID;

      console.log(paymentDetails);

      if ([200, 201, 401, 409].includes(result.status_code)) {
        console.log(result.status_code);
        try {
          const depositResult = await Wallet.withdraw(
            accountNumber,
            50,
            walletResult.id,
            paymentDetails.transaction_reference,
            typeof paymentDetails.transaction_reference_received === 'string'
              ? paymentDetails.transaction_reference_received
              : paymentDetails.transaction_reference_received?.toString(),
            walletResult.userId
          );
          console.log('Deposit result:', depositResult);
          return res.status(200).json({
            message: 'Withdraw processed successfully',
            error: null,
            redirectUrl: 'https://www.google.com'
          });
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(500).json({ error: 'An unknown error occurred' });
          }
        }
      } else {
        console.log(result.status_code);
        console.log('ENTROU AQUI');
        return res
          .status(500)
          .json({ paid: 'true', error: 'Failed to withdraw' });
      }
    } else {
      return res.status(404).json({ error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Error processing withdraw:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const processRefund = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const walletId = req.cookies.walletId;
  const paymentDetails: PaymentDetails = req.body;

  try {
    const walletResult = await Wallet.findById(walletId);

    if (walletResult && walletResult.length > 0) {
      const getPaymentToken = async (option: string): Promise<string> => {
        switch (option) {
          case 'mobileWallet':
            return createMobileWalletToken(walletId, paymentDetails);
          case 'Card':
            return createCardToken(walletId, paymentDetails);
          case 'Paypal':
            return createPaypalToken(walletId, paymentDetails);
          default:
            return 'PAY OPTION INVALID';
        }
      };

      const token = await getPaymentToken(paymentDetails.paymentMethod || '');
      const result = await refund(token);

      if ([200, 401, 409].includes(result.status_code)) {
        console.log(result.status_code);
        try {
          const { walletId } = req.params;
          const { originAccount, value } = req.body;
          const result = await Wallet.refund(walletId, originAccount, value);
          return res.status(200).json({
            message: 'Refund processed successfully',
            error: null,
            redirectUrl: 'https://www.google.com'
          });
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(500).json({ error: 'Unknown error occurred' });
          }
        }
      } else {
        return res
          .status(500)
          .json({ paid: 'true', error: 'Failed to withdraw' });
      }
    } else {
      return res.status(404).json({ error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Error processing withdraw:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const processQueryTransactionStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const walletId = req.cookies.walletId;
  const paymentDetails: PaymentDetails = req.body;

  try {
    const walletResult = await Wallet.findById(walletId);

    if (walletResult && walletResult.length > 0) {
      const getPaymentToken = async (option: string): Promise<string> => {
        switch (option) {
          case 'mobileWallet':
            return createMobileWalletToken(walletId, paymentDetails);
          case 'Card':
            return createCardToken(walletId, paymentDetails);
          case 'Paypal':
            return createPaypalToken(walletId, paymentDetails);
          default:
            return 'PAY OPTION INVALID';
        }
      };

      const token = await getPaymentToken(paymentDetails.paymentMethod || '');
      const result = await queryTransactionStatus(token);

      if ([200, 401, 409].includes(result.status_code)) {
        console.log(result.status_code);
        return res.status(200).json({
          status: 'Payment processed successfully',
          error: null,
          redirectUrl: 'https://www.google.com'
        });
      } else {
        return res
          .status(500)
          .json({ paid: 'true', error: 'Failed to queryTransactionStatus' });
      }
    } else {
      return res.status(404).json({ error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Error processing queryTransactionStatus:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const decodeTokeny = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  const info = await decodeToken(data.token);
  return res.json({ info });
};

async function pay(
  token: string
): Promise<{ status_code: number; transaction_reference_received?: number }> {
  const url = `${process.env.AUTHORIZATION_URL}/make_payment`;
  const data = { token };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const contentType = response.headers.get('content-type');
    let resultText;

    if (contentType?.includes('application/json')) {
      resultText = await response.json();
    } else {
      resultText = await response.text();
      try {
        const json = JSON.parse(resultText);
        resultText = json;
      } catch (e) {
        console.warn('Resposta não é um JSON válido:', e);
      }
      console.log('response:', resultText);
    }

    return { status_code: 200, transaction_reference_received: 1 };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function withdraw(token: string): Promise<any> {
  const url = `${process.env.AUTHORIZATION_URL}/make_payment`;
  const data = { token };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function withdraw2(token: string): Promise<any> {
  const url = `${process.env.AUTHORIZATION_URL}/make_withdraw`;
  const data = { token };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function refund(token: string): Promise<any> {
  const url = `${process.env.AUTHORIZATION_URL}/make_payment`;
  const data = { token };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function queryTransactionStatus(token: string): Promise<any> {
  const url = 'http://127.0.0.1:5000/query_transaction_status';
  const data = { token };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
