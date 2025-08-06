import db from '../config/db';
import { shopifyCredentials } from '../controllers/userController';
import BusinessDetails from './appModel';
import UserDetails from './userDetailsModel';

const DynamicData = {
  async getApps(userId: any) {
    const [rows] = await db.query('SELECT * FROM app WHERE userid = ?', [
      userId
    ]);
    return rows;
  },
  async getbotoes(userId: any) {
    const [rows] = await db.query('SELECT * FROM button WHERE  userid = ?', [
      userId
    ]);
    return rows;
  },
  async getOrders(userId: any) {
    const [rows] = await db.query('SELECT * FROM orders WHERE  userid = ?', [
      userId
    ]);
    return rows;
  },
  async getTransactions(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM transaction WHERE  userid = ?',
      [userId]
    );
    return rows;
  },
  async getwallet(userId: any) {
    const [rows] = await db.query('SELECT * FROM wallet WHERE  userid = ?', [
      userId
    ]);
    return rows;
  },
  async getUsuarios(userId: any) {
    const [rows] = await db.query('SELECT * FROM user WHERE id = ? ', [userId]);
    return rows;
  },
  async getBusinessDetails(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM businessdetails WHERE  userId = ?',
      [userId]
    );
    return rows;
  },
  async getNotifications(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM notification WHERE userid = ?',
      [userId]
    );
    return rows;
  },
  async getProducts(userId: any) {
    const [rows] = await db.query('SELECT * FROM product WHERE  userid = ?', [
      userId
    ]);
    return rows;
  },
  async getUserDetails(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM userdetails WHERE userid = ?',
      [userId]
    );
    return rows;
  },
  async shopifyCredentials(userId: any) {
    const [rows] = await db.query('SELECT * FROM shopify WHERE userid = ?', [
      userId
    ]);
    return rows;
  },
  async getSubscription(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM subscription WHERE userid = ?',
      [userId]
    );
    return rows;
  },
  async getUserDataById(userid: any) {
    try {
      const [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12] =
        await Promise.all([
          this.getApps(userid),
          this.getOrders(userid),
          this.getbotoes(userid),
          this.getTransactions(userid),
          this.getwallet(userid),
          this.getUsuarios(userid),
          this.getBusinessDetails(userid),
          this.getNotifications(userid),
          this.getUserDetails(userid),
          this.getProducts(userid),
          this.shopifyCredentials(userid),
          this.getSubscription(userid)
        ]);

      const data = {
        app: d1,
        orders: d2,
        button: d3,
        transactions: d4,
        wallet: d5,
        usuarios: d6,
        businessDetails: d7,
        notification: d8,
        userDetails: d9,
        products: d10,
        shopifyCredentials: d11,
        subscription: d12
      };

      return data;
    } catch (error) {
      return error;
    }
  }
};

export default DynamicData;
