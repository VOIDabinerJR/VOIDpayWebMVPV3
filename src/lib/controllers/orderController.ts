import { Request, Response } from 'express';
import Order from '../drizzle/models/orderModel';
import Button from '../drizzle/models/buttonModel';
import Notification from '../drizzle/models/notificationModel';
// import Shopify from "../drizzle/models/shopifyModel";

interface Product {
  name: string;
  quantity: number;
  price: number;
  // Optional fields for different order types
  productId?: string;
  variantId?: string;
  img?: string;
}

interface OrderData {
  buttonToken: string;
  orderItems: Product[];
  // Other possible fields from req.body
  [key: string]: any;
}

interface Order {
  buttonToken: string;
  products: number;
  description: string;
  totalAmount: number;
  orderStatus: string;
  userId: string | null;
}

interface ValidationError {
  index: number;
  field: string;
  message: string;
}

interface ValidationResult {
  errors?: ValidationError[];
  message?: string;
  there: boolean;
}

interface ButtonInfo {
  userId?: string;
  status: boolean;
  buttonToken: string;
  [key: string]: any;
}

interface ShopifyConfig {
  urlShopify: string;
  accessTokenShopify: string;
  [key: string]: any;
}

export const createOrder = async (req: Request, res: Response) => {
  const data: OrderData = req.body;

  const validateProducts = (products: Product[]): ValidationResult => {
    const errors: ValidationError[] = [];

    products.forEach((product, index) => {
      if (!product.name || product.name.trim() === '') {
        errors.push({
          index: index,
          field: 'name',
          message: 'Nome do produto não pode estar vazio.'
        });
      }

      if (!Number.isInteger(product.quantity) || product.quantity <= 0) {
        errors.push({
          index: index,
          field: 'quantity',
          message: 'Quantidade deve ser um número inteiro positivo.'
        });
      }

      if (isNaN(product.price) || product.price <= 0) {
        errors.push({
          index: index,
          field: 'price',
          message: 'Preço deve ser um número positivo.'
        });
      }
    });

    if (errors.length > 0) {
      return { errors: errors, there: true };
    } else {
      return {
        message: 'Todos os produtos estão corretamente formatados.',
        there: false
      };
    }
  };

  const result = validateProducts(data.orderItems);

  if (result.there && result.errors) {
    return res.json({ status: false, error: result.errors });
  }

  const totalAmount = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.quantity;
  }, 0);

  const buttonInfoArr = (await Button.findByToken(
    data.buttonToken
  )) as ButtonInfo[];
  const buttonInfo = buttonInfoArr[0];

  const order: Order = {
    buttonToken: data.buttonToken,
    products: totalItems,
    description: 'None desc.',
    totalAmount,
    orderStatus: 'pending',
    userId: buttonInfo[0].userId || null
  };

  const orderItems = data.orderItems;

  if (!buttonInfo[0].status) {
    return res.json({ err: 'botton not valid' });
  } else {
    try {
      const [insertResult] = (await Order.create(order)) as any[];

      await Order.saveOrderItems(orderItems, insertResult.insertId);

      if (insertResult.affectedRows === 1) {
        const maxAge = 3 * 24 * 60 * 60 * 1000;
        res.cookie('orderid', '13', { httpOnly: true, maxAge });

        return res.json({
          orderId: insertResult.insertId,
          buttonToken: buttonInfo[0].buttonToken,
          status: true
        });
      } else {
        return res.status(500).json({ error: 'Order creation failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const { orderid, status, bottontoken } = req.body;

  const buttonInfo = (await Button.findByToken(bottontoken)) as ButtonInfo[];

  if (!buttonInfo[0].status) {
    return res.json({ err: 'botton not valid' });
  }

  try {
    const [updateResult] = (await Order.update(orderid, { status })) as any[];

    if (updateResult.affectedRows === 1) {
      return res.status(200).json({ message: 'Order updated' });
    } else {
      return res.status(500).json({ error: 'Order update failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createShopifyOrder = async (req: Request, res: Response) => {
  const data: OrderData = req.body;

  try {
    const [buttonInfo] = (await Button.findByToken(data.buttonToken)) as [
      ButtonInfo[]
    ];
    const [shopifyConfig] = (await Shopify.findByUserId(
      buttonInfo[0].userId
    )) as [ShopifyConfig[]];

    const items: Product[] = [];

    for (const variantId of data.rid) {
      const product = await Shopify.findVariantProductById(
        variantId,
        shopifyConfig[0].urlShopify,
        shopifyConfig[0].accessTokenShopify
      );

      items.push({
        img: product.image,
        name: product.title,
        price: product.price,
        quantity: 1,
        productId: product.product_id,
        variantId: product.id
      });
    }

    const validateProducts = (products: Product[]): ValidationResult => {
      const errors: ValidationError[] = [];

      products.forEach((product, index) => {
        if (!product.name || product.name.trim() === '') {
          errors.push({
            index: index,
            field: 'name',
            message: 'Nome do produto não pode estar vazio.'
          });
        }

        if (!Number.isInteger(product.quantity) || product.quantity <= 0) {
          errors.push({
            index: index,
            field: 'quantity',
            message: 'Quantidade deve ser um número inteiro positivo.'
          });
        }

        if (isNaN(product.price) || product.price <= 0) {
          errors.push({
            index: index,
            field: 'price',
            message: 'Preço deve ser um número positivo.'
          });
        }
      });

      if (errors.length > 0) {
        return { errors: errors, there: true };
      } else {
        return {
          message: 'Todos os produtos estão corretamente formatados.',
          there: false
        };
      }
    };

    const result = validateProducts(items);
    if (result.there && result.errors) {
      return res.json({ status: false, error: result.errors });
    }

    const totalAmount = items.reduce((total: number, item: Product) => {
      return total + item.price * item.quantity;
    }, 0);

    const totalItems = items.reduce((total: number, item: Product) => {
      return total + item.quantity;
    }, 0);

    const order: Order = {
      buttonToken: data.buttonToken,
      products: totalItems,
      description: 'None desc.',
      totalAmount,
      orderStatus: 'pending',
      userId: buttonInfo[0].userId || null
    };

    if (!buttonInfo[0].status) {
      return res.json({ err: 'botton not valid' });
    } else {
      try {
        const [insertResult] = (await Order.create(order)) as any[];

        await Order.saveOrderItems(items, insertResult.insertId);

        if (insertResult.affectedRows === 1) {
          const maxAge = 3 * 24 * 60 * 60 * 1000;
          res.cookie('orderid', '13', { httpOnly: true, maxAge });

          return res.json({
            orderId: insertResult.insertId,
            buttonToken: buttonInfo[0].buttonToken,
            rid: data.rid,
            status: true
          });
        } else {
          return res.status(500).json({ error: 'Order creation failed' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createOrderbyLink = async (req: Request, res: Response) => {
  const data: OrderData = req.body;

  const validateProducts = (products: Product[]): ValidationResult => {
    const errors: ValidationError[] = [];

    products.forEach((product, index) => {
      if (!product.name || product.name.trim() === '') {
        errors.push({
          index: index,
          field: 'name',
          message: 'Nome do produto não pode estar vazio.'
        });
      }

      if (!Number.isInteger(product.quantity) || product.quantity <= 0) {
        errors.push({
          index: index,
          field: 'quantity',
          message: 'Quantidade deve ser um número inteiro positivo.'
        });
      }

      if (isNaN(product.price) || product.price <= 0) {
        errors.push({
          index: index,
          field: 'price',
          message: 'Preço deve ser um número positivo.'
        });
      }
    });

    if (errors.length > 0) {
      return { errors: errors, there: true };
    } else {
      return {
        message: 'Todos os produtos estão corretamente formatados.',
        there: false
      };
    }
  };

  const result = validateProducts(data.orderItems);

  if (result.there && result.errors) {
    return res.json({ status: false, error: result.errors });
  }

  const totalAmount = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.quantity;
  }, 0);

  const [buttonInfo] = (await Button.findByToken(data.buttonToken)) as [
    ButtonInfo[]
  ];

  const order: Order = {
    buttonToken: data.buttonToken,
    products: totalItems,
    description: 'None desc.',
    totalAmount,
    orderStatus: 'pending',
    userId: buttonInfo[0].userId || null
  };

  const orderItems = data.orderItems;

  if (!buttonInfo[0].status) {
    return res.json({ err: 'botton not valid' });
  } else {
    try {
      const [insertResult] = (await Order.create(order)) as any[];

      await Order.saveOrderItems(orderItems, insertResult.insertId);

      if (insertResult.affectedRows === 1) {
        const maxAge = 3 * 24 * 60 * 60 * 1000;
        res.cookie('orderid', '13', { httpOnly: true, maxAge });

        return res.json({
          orderId: insertResult.insertId,
          buttonToken: buttonInfo[0].buttonToken,
          status: true
        });
      } else {
        return res.status(500).json({ error: 'Order creation failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

export const createWoocommerceOrder = async (req: Request, res: Response) => {
  // Implementation to be added
  return res.status(501).json({ message: 'Not implemented' });
};

export const createWixOrder = async (req: Request, res: Response) => {
  // Implementation to be added
  return res.status(501).json({ message: 'Not implemented' });
};
