import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userDetails } from '../schema';

export const UserDetails = {
  async findById(id: number) {
    const result = await db
      .select()
      .from(userDetails)
      .where(eq(userDetails.id, id));
    return result;
  },

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(userDetails)
      .where(eq(userDetails.userId, userId));
    return result;
  },

  async create(userDetailsData: typeof userDetails.$inferInsert) {
    const result = await db
      .insert(userDetails)
      .values(userDetailsData)
      .returning();
    return result;
  },

  async update(
    id: number,
    userDetailsData: Partial<typeof userDetails.$inferInsert>
  ) {
    const result = await db
      .update(userDetails)
      .set({ ...userDetailsData, updatedAt: new Date() })
      .where(eq(userDetails.id, id))
      .returning();
    return result;
  }
};

export default UserDetails;
