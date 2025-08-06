import db from '../config/db';

const Product = {
  async findById(id: any) {
    const result = await db.query('SELECT * FROM product WHERE id = ?', [id]);
    return result;
  },

  async findByOrderId(orderId: any) {
    const result = await db.query('SELECT * FROM product WHERE orderId = ?', [
      orderId
    ]);
    return result;
  },

  async findByUserId(userId: any) {
    const result = await db.query('SELECT * FROM product WHERE userId = ?', [
      userId
    ]);
    return result;
  },

  async create(product: Record<string, any>) {
    const result = await db.query('INSERT INTO product SET ?', product);
    return result;
  },

  async update(product: any, id: any) {
    const result = await db.query('UPDATE product SET ? WHERE id = ?', [
      product,
      id
    ]);
    return result;
  },

  async delete(id: any) {
    const result = await db.query('DELETE FROM product WHERE id = ?', [id]);
    return result;
  }
};

export default Product;
