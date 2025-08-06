import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Button from '../models/buttonModel';
import Notification from '../models/notificationModel';
import Shopify from '../models/shopifyModel';

interface Product {
  name: string;
  quantity: number | string;
  price: number | string;
  [key: string]: any; // Additional properties
}

interface OrderData {
  buttonToken: string;
  products: number;
  description: string;
  totalAmount: number;
  orderStatus: string;
  userId: number | null;
}

interface ValidationResult {
  errors?: Array<{
    index: number;
    field: string;
    message: string;
  }>;
  message?: string;
  there: boolean;
}

interface ShopifyProduct {
  image: string;
  title: string;
  price: string;
  product_id: string;
  id: string;
}

export const createOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  const { buttonToken } = req.body;

  const validateProducts = (products: Product[]): ValidationResult => {
    let errors: Array<{ index: number; field: string; message: string }> = [];

    products.forEach((product, index) => {
      if (!product.name || product.name.trim() === '') {
        errors.push({
          index: index,
          field: 'name',
          message: 'Nome do produto não pode estar vazio.'
        });
      }

      if (!Number.isInteger(parseInt(product.quantity.toString()))) {
        errors.push({
          index: index,
          field: 'quantity',
          message: 'Quantidade deve ser um número inteiro positivo.'
        });
      }

      if (isNaN(parseFloat(product.price.toString()))) {
        errors.push({
          index: index,
          field: 'price',
          message: 'Preço deve ser um número positivo.'
        });
      }
    });

    return errors.length > 0
      ? { errors, there: true }
      : {
          message: 'Todos os produtos estão corretamente formatados.',
          there: false
        };
  };

  const result = validateProducts(data.orderItems);

  if (result.there && result.errors) {
    return res.json({ status: false, error: result.errors });
  }

  const totalAmount = data.orderItems.reduce((total: number, item: Product) => {
    return (
      total +
      parseFloat(item.price.toString()) * parseInt(item.quantity.toString())
    );
  }, 0);

  const totalItems = data.orderItems.reduce((total: number, item: Product) => {
    return total + parseInt(item.quantity.toString());
  }, 0);

  const [buttonInfo] = await Button.findByToken(buttonToken);

  const order: OrderData = {
    buttonToken: data.buttonToken,
    products: totalItems,
    description: 'None desc.',
    totalAmount,
    orderStatus: 'pending',
    userId: buttonInfo && buttonInfo.userId ? buttonInfo.userId : null
  };

  const orderItems = data.orderItems;

  if (buttonInfo[0].status !== true) {
    return res.json({ err: 'button not valid' });
  }

  try {
    const [insertResult] = await Order.create(order);
    await Order.saveOrderItems(orderItems, insertResult.insertId);

    if (insertResult.affectedRows === 1) {
      const maxAge = 3 * 24 * 60 * 60 * 1000;
      res.cookie('orderid', '13', { httpOnly: true, maxAge });

      return res.json({
        orderId: insertResult.insertId,
        buttonToken: buttonInfo[0].buttonToken,
        status: true
      });
    }
    return res.status(500).json({ error: 'Order creation failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { orderid, status, bottontoken } = req.body;

  const buttonInfo = await Button.findByToken(bottontoken);

  if (buttonInfo.status !== true) {
    return res.json({ err: 'button not valid' });
  }

  try {
    const [updateResult] = await Order.update(orderid, { status });

    if (updateResult.affectedRows === 1) {
      return res.status(200).json({ message: 'Order updated' });
    }
    return res.status(500).json({ error: 'Order update failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createShopifyOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;

  try {
    const [buttonInfo] = await Button.findByToken(data.buttonToken);
    const [shopInfo] = await Shopify.findByUserId(buttonInfo[0].userId);

    const items: Product[] = await Promise.all(
      data.rid.map(async (id: string) => {
        const product = await Shopify.findVariantProductById(
          id,
          shopInfo[0].urlShopify,
          shopInfo[0].accessTokenShopify
        );

        return {
          img: product.image,
          name: product.title,
          price: product.price,
          quantity: 1,
          productId: product.product_id,
          variantId: product.id
        };
      })
    );

    const validateProducts = (products: Product[]): ValidationResult => {
      const errors: Array<{ index: number; field: string; message: string }> =
        [];

      products.forEach((product, index) => {
        if (!product.name || product.name.trim() === '') {
          errors.push({
            index: index,
            field: 'name',
            message: 'Nome do produto não pode estar vazio.'
          });
        }

        if (!Number.isInteger(parseInt(product.quantity.toString()))) {
          errors.push({
            index: index,
            field: 'quantity',
            message: 'Quantidade deve ser um número inteiro positivo.'
          });
        }

        if (isNaN(parseFloat(product.price.toString()))) {
          errors.push({
            index: index,
            field: 'price',
            message: 'Preço deve ser um número positivo.'
          });
        }
      });

      return errors.length > 0
        ? { errors, there: true }
        : {
            message: 'Todos os produtos estão corretamente formatados.',
            there: false
          };
    };

    const result = validateProducts(items);
    if (result.there && result.errors) {
      return res.json({ status: false, error: result.errors });
    }

    const totalAmount = items.reduce((total: number, item: Product) => {
      return (
        total +
        parseFloat(item.price.toString()) * parseInt(item.quantity.toString())
      );
    }, 0);

    const totalItems = items.reduce((total: number, item: Product) => {
      return total + parseInt(item.quantity.toString());
    }, 0);

    const order: OrderData = {
      buttonToken: data.buttonToken,
      products: totalItems,
      description: 'None desc.',
      totalAmount,
      orderStatus: 'pending',
      userId: (buttonInfo as any)[0]?.userId || null
    };

    if ((buttonInfo as any)[0]?.status !== true) {
      return res.json({ err: 'button not valid' });
    }

    try {
      const [insertResult] = await Order.create(order);
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
      }
      return res.status(500).json({ error: 'Order creation failed' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createOrderbyLink = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return createOrder(req, res); // Reuse the same implementation
};

export const createWoocommerceOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implementation pending
  res.status(501).json({ error: 'Not implemented' });
};

export const createWixOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implementation pending
  res.status(501).json({ error: 'Not implemented' });
};
