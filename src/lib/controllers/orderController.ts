import Order from '../drizzle/models/orderModel';
import Button from '../drizzle/models/buttonModel';

interface Product {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
  variantId?: string;
  img?: string;
}

interface OrderData {
  buttonToken: string;
  orderItems: Product[];
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
export const orderService = {
 createOrder :async (data: OrderData) => {
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
    return { status: false, error: result.errors };
  }

  const totalAmount = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.quantity;
  }, 0);

  const buttonInfoArr = await Button.findByToken(data.buttonToken);
  const buttonInfo = buttonInfoArr[0];

  const order: Order = {
    buttonToken: data.buttonToken,
    products: totalItems,
    description: 'None desc.',
    totalAmount,
    orderStatus: 'Pending',
    userId: buttonInfo.userId || null
  };

  const orderItems = data.orderItems;

  if (!buttonInfo.status) {
    return { err: 'botton not valid' };
  } else {
    try {
      const [insertResult] = await Order.create(order as any);

      await Order.saveOrderItems(orderItems as any, insertResult.id);

      if (insertResult) {
        return {
          orderId: insertResult.id,
          buttonToken: buttonInfo.buttonToken,
          status: true
        };
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Server error');
    }
  }
},

updateOrder : async (
  orderid: number,
  status: string,
  bottontoken: string
) => {
  const buttonInfo = await Button.findByToken(bottontoken);

  if (!buttonInfo[0].status) {
    return { err: 'botton not valid' };
  }

  try {
    const [updateResult] = await Order.update(orderid, { status } as any);

    if (updateResult) {
      return { message: 'Order updated' };
    } else {
      throw new Error('Order update failed');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Server error');
  }
},

createShopifyOrder : async (data: OrderData) => {
  try {
    const buttonInfo = await Button.findByToken(data.buttonToken);
    // const [shopifyConfig] = await Shopify.findByUserId(buttonInfo[0].userId);

    const items: Product[] = [];

    // Mock implementation since Shopify model is not provided
    // You'll need to implement this based on your Shopify integration
    for (const variantId of (data as any).rid) {
      items.push({
        img: '',
        name: 'Product',
        price: 0,
        quantity: 1,
        productId: '1',
        variantId: variantId
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
      return { status: false, error: result.errors };
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
      return { err: 'botton not valid' };
    } else {
      try {
        const [insertResult] = await Order.create(order as any);

        await Order.saveOrderItems(items as any, insertResult.id);

        if (insertResult) {
          return {
            orderId: insertResult.id,
            buttonToken: buttonInfo[0].buttonToken,
            rid: (data as any).rid,
            status: true
          };
        } else {
          throw new Error('Order creation failed');
        }
      } catch (error) {
        console.error(error);
        throw new Error('Server error');
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Server error');
  }
},

 createOrderbyLink :async (data: OrderData) => {
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
    return { status: false, error: result.errors };
  }

  const totalAmount = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.price * item.quantity;
  }, 0);

  const totalItems = data.orderItems.reduce((total: number, item: Product) => {
    return total + item.quantity;
  }, 0);

  const buttonInfo = await Button.findByToken(data.buttonToken);

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
    return { err: 'botton not valid' };
  } else {
    try {
      const [insertResult] = await Order.create(order as any);

      await Order.saveOrderItems(orderItems as any, insertResult.id);

      if (insertResult) {
        return {
          orderId: insertResult.id,
          buttonToken: buttonInfo[0].buttonToken,
          status: true
        };
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Server error');
    }
  }
},
createWoocommerceOrder : async () => {
  throw new Error('Not implemented');
},
createWixOrder : async () => {
  throw new Error('Not implemented');
}
};
