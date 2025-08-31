import { eq } from 'drizzle-orm';
import { db } from '../db';
import { wallets } from '../schema';

export const Wallet = {
  async create(wallet: typeof wallets.$inferInsert) {
    const result = await db.insert(wallets).values(wallet).returning();
    return result;
  },

  async findById(id: number) {
    const result = await db.select().from(wallets).where(eq(wallets.id, id));
    return result.length > 0 ? result[0] : undefined;
  },

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    return result.length > 0 ? result[0] : undefined;
  },

  async withdraw(
    originAccount: string,
    value: number,
    walletId: number,
    transactionReference: string,
    transactionReferenceReceived: string | undefined,
    userId: number
  ) {
    // Update the wallet balance
    const updateWallet = await db
      .update(wallets)
      .set({
        balance: `(balance - ${value})`,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, walletId))
      .returning();

    // Note: Transaction table would need to be created in schema for this to work
    // For now, returning just the wallet update
    return {
      updateWallet
      // recordTransaction would be implemented when transaction table is added
    };
  },

  async deposit(
    destinationAccount: string,
    originAccount: string,
    value: number,
    walletId: number,
    userId: number,
    transactionReference: string,
    transactionReferenceReceived: string | undefined,
    originAccountId: number | null
  ) {
    const updateWallet = await db
      .update(wallets)
      .set({
        balance: `(balance + ${value})`,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, walletId))
      .returning();

    return {
      updateWallet
      // recordTransaction would be implemented when transaction table is added
    };
  },

  async refund(originAccount: string, value: number, walletId: number) {
    const updateWallet = await db
      .update(wallets)
      .set({
        balance: `(balance - ${value})`,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, walletId))
      .returning();

    // Note: Transaction table would need to be created in schema for this to work
    return {
      updateWallet
      // recordTransaction would be implemented when transaction table is added
    };
  }
};

export default Wallet;
