import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

interface EmailResponse {
  status: boolean;
  error?: any;
}

interface ButtonActivationParams {
  email: string;
  token: string;
  destinationSite: string;
  buttonToken: string;
}

interface RecoverEmailParams {
  email: string;
  token: string;
}

interface BillingInfo {
  contactName: string;
  address: string;
  city: string;
  postCode: string;
  phoneNumber: string;
}

interface TransactionData {
  amount: string;
  transactionId: string;
  date: string;
}

interface Product {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Sends a button activation email
 * @param email Recipient email address
 * @param token Activation token
 * @param destinationSite Destination website URL
 * @param buttonToken Button token
 * @returns Promise with send status
 */
async function sendEmail(
  email: string,
  token: string,
  destinationSite: string,
  buttonToken: string
): Promise<EmailResponse> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: 'abinerjr@voidpay.online',
      pass: 'Junior.@1'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            align-content: center;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            align-content: center;
            justify-content: center;
            align-items: center;
            text-align: center;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #ffffff;
        }
        .black-button {
            width: 80px;
            background-color: black;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        }
        .token {
            font-weight: bold;
            color: #3366cc;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://voidabinerjr.github.io/VOIDpayWebMVP2/img/voidblacklogo.png" alt="VOIDPay Logo">
        <h2><strong>Saudações!</strong></h2>
        <p>Você solicitou ativação de botão.</p>
        <p>Autorização [Copie]: <span class="token">${token}</span></p>
        <p>Verifique o site de destino: <a href="${destinationSite}" target="_blank">${destinationSite}</a></p>
        <p>Token do botão [salve esta informação]: <span class="token">${buttonToken}</span></p>
        <div class="footer">
            <p>Este é um aviso automatizado, não responda.</p>
            <p>Se você tiver alguma dúvida ou precisar de suporte adicional, entre em contato conosco pelo site <a href="https://www.voidpay.online" target="_blank">www.voidpay.online</a>.</p>
            <p>Atenciosamente,<br>Equipe de Suporte VOIDpay</p>
        </div>
    </div>
</body>
</html>
`;

  const mailOptions = {
    from: '"VOIDPay Button" <abinerjr@voidpay.online>',
    to: email,
    subject: 'Token Validacao Botao',
    text: 'Validacao',
    html: htmlTemplate
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: ', info.response);
    return { status: true };
  } catch (error) {
    console.error('Erro ao enviar e-mail: ', error);
    return { status: false, error: error };
  }
}

/**
 * Sends a password recovery email
 * @param email Recipient email address
 * @param token Recovery token
 * @returns Promise with send status
 */
async function sendRecoverEmail(
  email: string,
  token: string
): Promise<EmailResponse> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: 'abinerjr@voidpay.online',
      pass: 'Junior.@1'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            align-content: center;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            align-content: center;
            justify-content: center;
            align-items: center;
            text-align: center;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #ffffff;
        }
        .black-button {
            width: 80px;
            background-color: black;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        }
        .token {
            font-weight: bold;
            color: #3366cc;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://voidabinerjr.github.io/VOIDpayWebMVP2/img/voidblacklogo.png">
        <h2><strong>Saudações!</strong></h2>
        <p>Você solicitou uma recuperação de senha para sua conta</p>
        <a class="black-button" style="color: #ffffff;" href="${process.env.WEB_URL}/resetpassword?token=${token}">Click Aqui</a>
        <div class="footer">
            <p>Este é um aviso automatizado, não responda.</p>
            <p>Se você tiver alguma dúvida ou precisar de suporte adicional, entre em contato conosco pelo site <a href="www.voidpay.online" target="_blank">www.voidpay.online</a></p>
            <p>Atenciosamente,<br>Equipe de Suporte VOIDpay</p>
        </div>
    </div>
</body>
</html>
`;

  const mailOptions = {
    from: '"VOIDPay ResetPassWord" <abinerjr@voidpay.online>',
    to: email,
    subject: 'Recuperrar Senha',
    text: 'Olá',
    html: htmlTemplate
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail: ', error);
          reject(error);
        } else {
          console.log('E-mail enviado: ', info.response);
          resolve(info);
        }
      });
    });
    return { status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}

/**
 * Sends a payment confirmation email
 * @param email Recipient email address
 * @param billingInfo Billing information
 * @param transactionData Transaction details
 * @param products Purchased products
 * @returns Promise with send status
 */
async function sendPaymentConfirmationEmail(
  email: string,
  billingInfo: BillingInfo,
  transactionData: TransactionData,
  products: Product[]
): Promise<EmailResponse> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: 'abinerjr@voidpay.online',
      pass: 'Junior.@1'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Process products
  products.forEach((product) => {
    product.price = parseFloat(product.price.toString());
  });

  let tableRows = '';
  products.forEach((product) => {
    tableRows += `
        <tr>
            <td style="width: 100%;">
                <span>${product.name}</span>
                <span>${product.price.toFixed(2)} Mt × ${product.quantity}</span><br>
            </td>
            <td style="white-space: nowrap;">
                <p style="color: #202223; line-height: 20px; font-weight: 400; margin: 0; padding: 0;" align="right">
                    ${(product.price * product.quantity).toFixed(2)} Mt
                </p>
            </td>
        </tr>`;
  });

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
        span {
            font-size: 14px;
            line-height: 1.42;
            color: #202223;
        }
        td {
            white-space: nowrap;
        }
        p {
            color: #202223;
            line-height: 20px;
            font-weight: 400;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <center>
            <!-- Email content remains the same as original -->
            ${tableRows}
            <!-- Rest of the email template -->
        </center>
        <div class="footer">
            <p><a><img style="width:10%;" src="https://voidabinerjr.github.io/VOIDpayWebMVP2/img/voidblacklogo.png"></a></p>
            <p><a href="www.voidpay.online" target="_blank">www.voidpay.online</a></p>
            <p>Atenciosamente,<br>Equipe de Suporte VOIDpay</p>
        </div>
    </div>
</body>
</html>
`;

  const mailOptions = {
    from: '"VOIDPay Pagamento Efetuado" <abinerjr@voidpay.online>',
    to: email,
    subject: 'Pagamento Efetuado',
    text: 'Olá',
    html: htmlTemplate
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail: ', error);
          reject(error);
        } else {
          console.log('E-mail enviado: ', info.response);
          resolve(info);
        }
      });
    });
    return { status: true };
  } catch (error) {
    return { status: false, error: error };
  }
}

export { sendEmail, sendRecoverEmail, sendPaymentConfirmationEmail };
