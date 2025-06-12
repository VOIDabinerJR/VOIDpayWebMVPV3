////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering
import { App } from './data';
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
  quantidade: number;         // Novo campo
  payment_link: string;       // Novo campo
};


// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Toys',
    'Groceries',
    'Books',
    'Jewelry',
    'Beauty Products'
  ];

  const name = faker.commerce.productName();

  return {
    id,
    name,
    description: faker.commerce.productDescription(),
    created_at: faker.date
      .between({ from: '2022-01-01', to: '2023-12-31' })
      .toISOString(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
    category: faker.helpers.arrayElement(categories),
    updated_at: faker.date.recent().toISOString(),
    quantidade: faker.number.int({ min: 1, max: 100 }), // Valor entre 1 e 100
    payment_link: `https://pay.voidpay.com/checkout/${id}-${name.replace(/\s+/g, '-').toLowerCase()}`
  };
}


    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

export const mockApps = {
  getApps: async (filters: any) => {
    // Simulação de delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

  const mockData: App[] = [
  {
    id: 'app_1',
    name: 'E-commerce Store',
    description: 'Main online store integration',
    client_id: 'client_123456',
    status: 'active',
    environment: 'production',
    created_at: '2023-01-15',
    updated_at: '2023-06-20',
    last_used: '2023-06-25T14:30:00Z',
    webhook_url: 'https://store.com/api/webhooks',
    ip_restrictions: ['192.168.1.1'],
    permissions: ['payments_read', 'payments_write']
  },
  {
    id: 'app_2',
    name: 'Mobile App',
    description: 'Android application',
    client_id: 'client_789012',
    status: 'active',
    environment: 'sandbox',
    created_at: '2023-03-10',
    updated_at: '2023-06-18',
    last_used: '2023-06-24T09:15:00Z',
    permissions: ['payments_read']
  },
  {
    id: 'app_3',
    name: 'POS System',
    description: 'Point of Sale terminal integration',
    client_id: 'client_345678',
    status: 'active',
    environment: 'production',
    created_at: '2023-02-28',
    updated_at: '2023-06-22',
    last_used: '2023-06-23T16:45:00Z',
    webhook_url: 'https://pos.example.com/webhook',
    ip_restrictions: ['10.0.0.1', '10.0.0.2'],
    permissions: ['payments_read', 'payments_write', 'refunds']
  },
  {
    id: 'app_4',
    name: 'Booking Platform',
    description: 'Hotel reservation system',
    client_id: 'client_901234',
    status: 'inactive',
    environment: 'production',
    created_at: '2022-11-05',
    updated_at: '2023-05-30',
    last_used: '2023-05-28T11:20:00Z',
    permissions: ['payments_read']
  },
  {
    id: 'app_5',
    name: 'Subscription Service',
    description: 'Recurring billing system',
    client_id: 'client_567890',
    status: 'active',
    environment: 'sandbox',
    created_at: '2023-04-15',
    updated_at: '2023-06-19',
    last_used: '2023-06-21T13:10:00Z',
    webhook_url: 'https://subs.example.com/api/events',
    ip_restrictions: ['172.16.0.5'],
    permissions: ['payments_read', 'subscriptions']
  },
  {
    id: 'app_6',
    name: 'Marketplace',
    description: 'Multi-vendor platform',
    client_id: 'client_123789',
    status: 'active',
    environment: 'production',
    created_at: '2023-01-30',
    updated_at: '2023-06-15',
    last_used: '2023-06-20T10:05:00Z',
    webhook_url: 'https://marketplace.com/webhooks/payments',
    ip_restrictions: ['192.168.2.10', '192.168.2.11'],
    permissions: ['payments_read', 'payments_write', 'disputes']
  }
];
    // Aplicar filtros
    let filteredData = [...mockData];

    if (filters.search) {
      filteredData = filteredData.filter(
        (app) =>
          app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Paginação correta
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
      total_apps: filteredData.length,
      apps: paginatedData,
      page,
      limit,
      total_pages: Math.ceil(filteredData.length / limit)
    };
  }
};
// Initialize sample products
fakeProducts.initialize();
