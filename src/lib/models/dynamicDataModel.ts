import db from '../config/db';
const DynamicData = {
  async getDataFromTable(tableName: string, userId: any) {
    const query = `
            SELECT * FROM ${tableName}
            WHERE  USUARIOID = ?
        `;
    const [rows] = await db.query(query, [userId, userId]);
    return rows;
  },

  async getApps(userId: any) {
    return this.getDataFromTable('app', userId);
  },

  async getBotoes(userId: any) {
    return this.getDataFromTable('botoes', userId);
  },

  async getOrders(userId: any) {
    return this.getDataFromTable('orders', userId);
  },

  async getTransactions(userId: any) {
    return this.getDataFromTable('transactions', userId);
  },

  async getWallet(userId: any) {
    return this.getDataFromTable('wallet', userId);
  },

  async getUsuarios(userId: any) {
    return this.getDataFromTable('usuarios', userId);
  },

  async getUserDataById(userId: any) {
    try {
      const [apps, botoes, orders, transactions, wallet, usuarios] =
        await Promise.all([
          this.getApps(userId),
          this.getBotoes(userId),
          this.getOrders(userId),
          this.getTransactions(userId),
          this.getWallet(userId),
          this.getUsuarios(userId)
        ]);

      const data = {
        apps,
        botoes,
        orders,
        transactions,
        wallet,
        usuarios
      };

      return data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  }
};

export default DynamicData;
