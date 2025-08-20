import { eq } from 'drizzle-orm';
import { db } from '../db';
import { apps, buttons, orders, wallets, users } from '../schema';

export const StaticDataService = {
  async getApps(userId: string) {
    const result = await db.select().from(apps).where(eq(apps.userId, userId));
    return result;
  },

  async getBotoes(userId: string) {
    const result = await db
      .select()
      .from(buttons)
      .where(eq(buttons.userId, userId));
    return result;
  },

  async getOrders(userId: string) {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));
    return result;
  },

  async getWallet(userId: string) {
    const result = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    return result;
  },

  async getUsuarios(userId: string) {
    const result = await db.select().from(users).where(eq(users.id, userId));
    return result;
  },

  async getUserDataById(userId: string) {
    try {
      const [appsData, buttonsData, ordersData, walletData] =
        await Promise.all([
          this.getApps(userId),
          this.getBotoes(userId),
          this.getOrders(userId.toString()),
          this.getWallet(userId),
          // this.getUsuarios(userId)
        ]);

      const data = {
        apps: appsData,
        buttons: buttonsData,
        orders: ordersData,
        wallet: walletData,
        // usuarios: usuariosData
      };

      return data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  }
};

export default StaticDataService;
