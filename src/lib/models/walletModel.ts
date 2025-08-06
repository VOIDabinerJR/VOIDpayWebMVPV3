import db from '../config/db';

const Wallet = {
  async create(wallet: { userid: any }) {
    const result = await db.query('INSERT INTO wallet SET ?', wallet);
    return result;
  },
  async findById(id: any) {
    const result = await db.query('SELECT * FROM wallet WHERE id = ?', [id]);
    return Array.isArray(result[0]) ? result[0][0] : undefined;
  },
  async findByUserId(id: any) {
    const result = await db.query('SELECT * FROM wallet WHERE userId = ?', [
      id
    ]);
    return Array.isArray(result[0]) ? result[0][0] : undefined;
  },
  async withdraw(
    originAccount: any,
    value: number,
    walletId: any,
    transactionReference: any,
    transactionReferenceReceived: string | undefined,
    userId: any
  ) {
    // Update the wallet balance
    const updateWallet = await db.query(
      'UPDATE wallet SET balance = balance - ? WHERE id = ?',
      [value, walletId]
    );

    // Record the transaction
    const recordTransaction = await db.query('INSERT INTO transaction SET ?', {
      walletId,
      type: 'withdraw',
      originAccount,
      value,
      transactionReference,
      transactionReferenceReceived,
      userId,
      date: new Date()
    });

    return {
      updateWallet,
      recordTransaction
    };
  },
  async deposit(
    destinationAccount: string,
    originAccount: string,
    value: number,
    walletId: any,
    userId: any,
    transactionReference: string,
    transactionReferenceReceived: string | undefined,
    originAcountId: null
  ) {
    console.log(
      destinationAccount,
      originAccount,
      value,
      walletId,
      userId,
      transactionReference,
      transactionReferenceReceived,
      originAcountId
    );
    const updateWallet = await db.query(
      'UPDATE wallet SET balance = balance + ? WHERE id = ?',
      [value, walletId]
    );

    const recordTransaction = await db.query('INSERT INTO transaction SET ?', {
      walletId,
      userId,
      type: 'deposit',
      destinationAccount,
      originAccount,
      value,
      date: new Date(),
      transactionReference,
      transactionReferenceReceived,
      originAcountId
    });
    console.log('updated2');

    return {
      updateWallet,
      recordTransaction
    };
  },
  async refund(originAccount: any, value: any, walletId: any) {
    const updateWallet = await db.query(
      'UPDATE wallet SET balance = balance - ? WHERE id = ?',
      [value, walletId]
    );

    // Registra a transação como reembolso
    const recordTransaction = await db.query('INSERT INTO transaction SET ?', {
      walletId,
      type: 'refund',
      originAccount,
      value,
      date: new Date()
    });

    return {
      updateWallet,
      recordTransaction
    };
  }
};

export default Wallet;
