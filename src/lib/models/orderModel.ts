import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../config/db';

interface Order {
  id?: number | string;
  contactName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  orderStatus?: string;
  paymentMethod?: string;
  totalAmount?: number;
  buttonToken: string;
  ivaTax: number;
  iva: string;
  shippingCost: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItem {
  itemId?: number | string;
  name: string;
  price: number;
  quantity: number;
  productId: number | string;
  img: string;
  imgAlt: string;
  orderId: number | string;
  variantId: number | string;
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

const Order = {
  async create(order: Order): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO orders SET ?',
      order
    );
    return result;
  },

  async update(
    id: number | string,
    order: Partial<Order>
  ): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE orders SET ? WHERE id = ?',
      [order, id]
    );
    return result;
  },

  async updateStatus(
    id: number | string,
    status: string
  ): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE orders SET orderStatus = ? WHERE id = ?',
      [status, id]
    );
    return result;
  },

  async findById(id: number | string): Promise<Order> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return rows[0] as Order;
  },

  async findByIdOrderItems(id: number | string): Promise<OrderItem[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM orderitems WHERE orderId = ?',
      [id]
    );
    return rows as OrderItem[];
  },

  async findItemsIdByOrderId(
    id: number | string
  ): Promise<{ productId: number | string }[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT productId FROM orderitems WHERE orderId = ?',
      [id]
    );
    return rows as { productId: number | string }[];
  },

  async findvariantIdByOrderId(
    id: number | string
  ): Promise<{ variantId: number | string }[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT variantId FROM orderitems WHERE orderId = ?',
      [id]
    );
    return rows as { variantId: number | string }[];
  },

  async saveOrderItems(
    items: OrderItem[],
    orderId: number | string
  ): Promise<ResultSetHeader> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Você deve fornecer um array de itens para inserção.');
    }

    const values = items.map((item) => [
      item.name,
      item.price,
      item.quantity,
      item.productId,
      item.img,
      item.imgAlt,
      orderId,
      item.variantId
    ]);

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO orderitems (name, price, quantity, productId, img, imgAlt, orderId, variantId) VALUES ?',
      [values]
    );

    return result;
  },

  async deleteOrderItems(
    itemIds: (number | string)[]
  ): Promise<ResultSetHeader> {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error(
        'Você deve fornecer um array de IDs de itens para exclusão.'
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM orderitems WHERE itemId IN (?)',
      [itemIds]
    );
    return result;
  },

  async createShopifyOrder(
    order: Order,
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
