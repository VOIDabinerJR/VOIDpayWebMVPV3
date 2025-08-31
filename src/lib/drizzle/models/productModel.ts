import { eq } from 'drizzle-orm';
import { db } from '../db';
import { products } from '../schema';

export const Product = {
  async findById(id: number) {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result;
  },

  async findByOrderId(orderId: number) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.orderId, orderId));
    return result;
  },

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.userId, userId));
    return result;
  },

  async create(product: typeof products.$inferInsert) {
    const result = await db.insert(products).values(product).returning();
    return result;
  },

  async update(id: number, productData: Partial<typeof products.$inferInsert>) {
    const result = await db
      .update(products)
      .set({ ...productData })
      .where(eq(products.id, id))
      .returning();
    return result;
  },

  async delete(id: number) {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result;
  }
};

export default Product;
