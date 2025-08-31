import { eq } from 'drizzle-orm';
import { db } from '../db';
import { apps } from '../schema';

export const App = {
  async findById(id: number) {
    const result = await db.select().from(apps).where(eq(apps.id, id));
    return result;
  },

  async findByName(name: string) {
    const result = await db.select().from(apps).where(eq(apps.name, name));
    return result;
  },
  async findByClientId(client: string) {
    const result = await db
      .select()
      .from(apps)
      .where(eq(apps.clientId, client));
    return result;
  },

  async create(app: typeof apps.$inferInsert) {
    const result = await db.insert(apps).values(app).returning();
    return result;
  },

  async update(id: number, appData: Partial<typeof apps.$inferInsert>) {
    const result = await db
      .update(apps)
      .set({ ...appData, updatedAt: new Date() })
      .where(eq(apps.id, id))
      .returning();
    return result;
  },

  async findAll() {
    const result = await db
      .select()
      .from(apps)
      .where(eq(apps.status, 'Active'));
    return result;
  },

  async deactivate(id: number) {
    const result = await db
      .update(apps)
      .set({ status: 'Inactive', updatedAt: new Date() })
      .where(eq(apps.id, id))
      .returning();
    return result;
  }
};

export default App;
