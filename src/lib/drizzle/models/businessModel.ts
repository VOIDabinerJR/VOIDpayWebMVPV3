import { eq } from 'drizzle-orm';
import { db } from '../db';
import { businessDetails } from '../schema';
const businesses = businessDetails;
export const BusinessDetails = {
  async findById(id: number) {
    const result = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id));
    return result;
  },

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, userId));
    return result;
  },

  async create(businessData: typeof businesses.$inferInsert) {
    const result = await db.insert(businesses).values(businessData).returning();
    return result;
  },

  async update(
    id: number,
    businessData: Partial<typeof businesses.$inferInsert>
  ) {
    const result = await db
      .update(businesses)
      .set({ ...businessData, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return result;
  }
};

export default BusinessDetails;
