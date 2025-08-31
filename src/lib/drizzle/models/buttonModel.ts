import { eq } from 'drizzle-orm';
import { db } from '../db';
import { buttons } from '../schema';

export const Button = {
  async findByToken(token: string) {
    const result = await db
      .select()
      .from(buttons)
      .where(eq(buttons.buttonToken, token));
    return result;
  },

  async create(button: typeof buttons.$inferInsert) {
    const result = await db.insert(buttons).values(button).returning();
    return result;
  },

  async findById(id: number) {
    const result = await db.select().from(buttons).where(eq(buttons.id, id));
    return result;
  },

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(buttons)
      .where(eq(buttons.userId, userId));
    return result;
  },

  async update(id: number, buttonData: Partial<typeof buttons.$inferInsert>) {
    const result = await db
      .update(buttons)
      .set(buttonData)
      .where(eq(buttons.id, id))
      .returning();
    return result;
  }

  // async deactivate(id: number) {
  //   const result = await db
  //     .update(buttons)
  //     .where(eq(buttons.id, id))
  //     .returning();
  //   return result;
  // }
};

export default Button;
