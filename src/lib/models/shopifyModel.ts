import db from '../config/db';

const Shopify = {
  async findVariantProductById(productId: string, shop: any, accessToken: any) {
    console.log({ productId, shop, accessToken });
    // console.log({ productId, shop, accessToken });
    try {
      const response = await fetch(
        `https://${shop}/admin/api/2023-07/products/${productId}.json`,
        {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      //  if (!response.ok) {
      //    throw new Error(`Erro ao buscar o produto: ${response.statusText}`);
      // }

      const data = await response.json();
      if (data.product.images[0]) {
        data.product.variants[0].image = data.product.images[0].src;
      } else {
        data.product.variants[0].image = null;
      }

      data.product.variants[0].title = data.product.title;
      console.log(data.product.variants[0]);
      return data.product.variants[0]; // Retorna a primeira variante do produto
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return { message: error.message };
      }
      return { message: String(error) };
    }
  },

  async findById(id: string) {
    const result = await db.query('SELECT * FROM shopify WHERE id = ?', [id]);
    return result;
  },
  async findByUserId(id: string) {
    const result = await db.query('SELECT * FROM shopify WHERE userid = ?', [
      id
    ]);
    return result;
  },
  async findByClientId(id: string) {
    const result = await db.query('SELECT * FROM shopify WHERE clientid = ?', [
      id
    ]);

    return result;
  },
  async create(app: any) {
    const result = await db.query('INSERT INTO shopify SET ?', app);
    return result;
  },
  async update(app: any, id: string) {
    const result = await db.query('UPDATE shopify SET ? WHERE id = ?', [
      app,
      id
    ]);
    return result;
  }
};

export default Shopify;
