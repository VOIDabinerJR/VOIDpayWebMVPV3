// import { eq } from 'drizzle-orm';
// import { db } from '../db';
// import { shopify } from '../schema';

// export const Shopify = {
//   async findVariantProductById(
//     productId: string,
//     shop: string,
//     accessToken: string
//   ) {
//     console.log({ productId, shop, accessToken });

//     try {
//       const response = await fetch(
//         `https://${shop}/admin/api/2023-07/products/${productId}.json`,
//         {
//           method: 'GET',
//           headers: {
//             'X-Shopify-Access-Token': accessToken,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const data = await response.json();
//       if (data.product.images[0]) {
//         data.product.variants[0].image = data.product.images[0].src;
//       } else {
//         data.product.variants[0].image = null;
//       }

//       data.product.variants[0].title = data.product.title;
//       console.log(data.product.variants[0]);
//       return data.product.variants[0]; // Retorna a primeira variante do produto
//     } catch (error) {
//       console.log(error);
//       if (error instanceof Error) {
//         return { message: error.message };
//       }
//       return { message: String(error) };
//     }
//   },

//   async findById(id: number) {
//     const result = await db.select().from(shopify).where(eq(shopify.id, id));
//     return result;
//   },

//   async findByUserId(userId: number) {
//     const result = await db
//       .select()
//       .from(shopify)
//       .where(eq(shopify.userId, userId));
//     return result;
//   },

//   async findByShopName(shopName: string) {
//     const result = await db
//       .select()
//       .from(shopify)
//       .where(eq(shopify.shopName, shopName));
//     return result;
//   },

//   async create(shopifyData: typeof shopify.$inferInsert) {
//     const result = await db.insert(shopify).values(shopifyData).returning();
//     return result;
//   },

//   async update(id: number, shopifyData: Partial<typeof shopify.$inferInsert>) {
//     const result = await db
//       .update(shopify)
//       .set({ ...shopifyData, updatedAt: new Date() })
//       .where(eq(shopify.id, id))
//       .returning();
//     return result;
//   },

//   async deactivate(id: number) {
//     const result = await db
//       .update(shopify)
//       .set({ isActive: false, updatedAt: new Date() })
//       .where(eq(shopify.id, id))
//       .returning();
//     return result;
//   }
// };

// export default Shopify;
