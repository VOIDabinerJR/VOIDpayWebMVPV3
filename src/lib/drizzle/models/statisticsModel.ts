// import { eq, and, sql } from 'drizzle-orm';
// import { db } from '../db';
// import { orders, statistics } from '../schema';

// export const Statistics = {
//   async findSalesByMonthYear(userId: string, month?: number, year?: number) {
//     const result = await db
//       .select()
//       .from(orders)
//       .where(
//         and(
//           eq(orders.userId, userId),
//           sql`EXTRACT(MONTH FROM ${orders.createdAt}) = ${month || 1}`,
//           sql`EXTRACT(YEAR FROM ${orders.createdAt}) = ${year || 2024}`
//         )
//       );
//     return result;
//   },

//   async findPendingPayments(userId: string) {
//     const result = await db
//       .select()
//       .from(orders)
//       .where(and(eq(orders.userId, userId), eq(orders.orderStatus, 'Pending')));
//     return result;
//   },

//   async findCompletedPayments(userId: string) {
//     const result = await db
//       .select()
//       .from(orders)
//       .where(
//         and(eq(orders.userId, userId), eq(orders.orderStatus, 'Completed'))
//       );
//     return result;
//   },

//   async findCancelledPayments(userId: string) {
//     const result = await db
//       .select()
//       .from(orders)
//       .where(
//         and(eq(orders.userId, userId), eq(orders.orderStatus, 'Cancelled'))
//       );
//     return result;
//   },

//   async findRefundedPayments(userId: string) {
//     const result = await db
//       .select()
//       .from(orders)
//       .where(
//         and(eq(orders.userId, userId), eq(orders.orderStatus, 'refunded'))
//       );
//     return result;
//   },

//   async calculateCancellationRate(userId: string) {
//     const totalOrders = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(orders)
//       .where(eq(orders.userId, userId));

//     const cancelledOrders = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(orders)
//       .where(
//         and(eq(orders.userId, userId), eq(orders.orderStatus, 'Cancelled'))
//       );

//     const total = totalOrders[0]?.count || 0;
//     const cancelled = cancelledOrders[0]?.count || 0;

//     return total > 0 ? (cancelled / total) * 100 : 0;
//   },

//   async create(statisticData: typeof statistics.$inferInsert) {
//     const result = await db
//       .insert(statistics)
//       .values(statisticData)
//       .returning();
//     return result;
//   },

//   async findByUserId(userId: number) {
//     const result = await db
//       .select()
//       .from(statistics)
//       .where(eq(statistics.userId, userId));
//     return result;
//   },

//   async findByMetric(metric: string) {
//     const result = await db
//       .select()
//       .from(statistics)
//       .where(eq(statistics.metric, metric));
//     return result;
//   }
// };

// export default Statistics;
