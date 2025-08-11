import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema';

export const User = {
  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email) && eq(users.userStatus, true));
    return result;
  },

  async returnEmail(id: string) {
    const result = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, id) && eq(users.userStatus, true));
    return result;
  },

  async findById(id: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id) && eq(users.userStatus, true));
    return result;
  },

  async create(user: typeof users.$inferInsert) {
    const result = await db.insert(users).values(user).returning();
    return result;
  },

  async update(id: string, userData: Partial<typeof users.$inferInsert>) {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result;
  },

  async activateUser(id: string) {
    const result = await db
      .update(users)
      .set({ userStatus: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result;
  },

  async deactivateUser(id: string) {
    const result = await db
      .update(users)
      .set({ userStatus: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result;
  }
};

export default User;
