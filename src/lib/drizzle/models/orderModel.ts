import { eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { orders, orderItems } from '../schema';
import { orderStatusEnum } from '../schema';
interface OrderInsert {
  userId: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  orderStatus?: 'Pending' | 'Completed' | 'Cancelled' | 'refunded';
  paymentMethod?: string;
  totalAmount?: string;
  buttonToken: string;
  ivaTax: string;
  iva: string;
  shippingCost: string;
}

interface OrderItemInsert {
  name: string;
  price: string;
  quantity: number;
  productId: string;
  img: string;
  imgAlt: string;
  orderId: number;
  variantId: string;
}

interface ShopifyVariant {
  variantId: number | string;
  quantity: number;
}

interface ShopifyOrderResponse {
  order?: any;
  message?: string;
}

interface ShopifyOrderData {
  order: {
    line_items: Array<{
      variant_id: number | string;
      quantity: number;
    }>;
    customer: {
      email: string;
    };
    financial_status: string;
    transactions: Array<{
      kind: string;
      status: string;
      amount: number;
    }>;
    shipping_address: {
      first_name: string;
      last_name: string;
      address1: string;
      phone: string;
      city: string;
      province: string;
      country: string;
      zip: string;
    };
    billing_address: {
      first_name: string;
      last_name: string;
      address1: string;
      phone: string;
      city: string;
      province: string;
      country: string;
      zip: string;
    };
  };
}

export const Order = {
  async create(order: OrderInsert) {
    if (order.totalAmount === undefined) {
      throw new Error('totalAmount is required');
    }
    const result = await db
      .insert(orders)
      .values({ ...order, totalAmount: order.totalAmount })
      .returning();
    return result;
  },

  async update(id: number, orderData: Partial<OrderInsert>) {
    const result = await db
      .update(orders)
      .set({ ...orderData, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return result;
  },

  async updateStatus(id: number, status: string) {
    const allowedStatuses = ['Pending', 'Completed', 'Cancelled', 'refunded'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    const result = await db
      .update(orders)
      .set({
        orderStatus: status as
          | 'Pending'
          | 'Completed'
          | 'Cancelled'
          | 'refunded',
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return result;
  },
  async findById(id: number) {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  },

  async findByIdOrderItems(id: number) {
    const result = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    return result;
  },

  async findItemsIdByOrderId(id: number) {
    const result = await db
      .select({ productId: orderItems.productId })
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    return result;
  },

  // async findVariantIdByOrderId(id: number) {
  //   const result = await db
  //     .select({ variantId: orderItems.variantId })
  //     .from(orderItems)
  //     .where(eq(orderItems.orderId, id));
  //   return result;
  // },

  async saveOrderItems(items: OrderItemInsert[], orderId: number) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Você deve fornecer um array de itens para inserção.');
    }

    const itemsWithOrderId = items.map((item) => ({
      ...item,
      orderId
    }));

    const result = await db
      .insert(orderItems)
      .values(itemsWithOrderId)
      .returning();
    return result;
  },

  async deleteOrderItems(itemIds: number[]) {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error(
        'Você deve fornecer um array de IDs de itens para exclusão.'
      );
    }

    const result = await db
      .delete(orderItems)
      .where(inArray(orderItems.orderId, itemIds))
      .returning();
    return result;
  },

  async createShopifyOrder(
    order: OrderInsert,
    amount: number,
    variants: ShopifyVariant[],
    shop: string,
    accessToken: string
  ): Promise<ShopifyOrderResponse> {
    const lineItems = variants.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity || 1
    }));

    const orderData: ShopifyOrderData = {
      order: {
        line_items: lineItems,
        customer: {
          email: order.email
        },
        financial_status: 'paid',
        transactions: [
          {
            kind: 'sale',
            status: 'success',
            amount: amount
          }
        ],
        shipping_address: {
          first_name: order.contactName,
          last_name: order.contactName,
          address1: order.address,
          phone: order.phoneNumber,
          city: order.city,
          province: order.city,
          country: 'MOZAMBIQUE',
          zip: order.postCode
        },
        billing_address: {
          first_name: order.contactName,
          last_name: order.contactName,
          address1: order.address,
          phone: order.phoneNumber,
          city: order.city,
          province: order.city,
          country: 'MOZAMBIQUE',
          zip: order.postCode
        }
      }
    };

    console.log(orderData);

    try {
      const response = await fetch(
        `https://${shop}/admin/api/2023-07/orders.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao criar pedido: ${response.statusText}`);
      }

      const data = await response.json();
      return { order: data.order };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};

export default Order;
