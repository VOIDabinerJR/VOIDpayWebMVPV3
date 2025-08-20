import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  uuid,
  decimal,
  json,
  pgEnum,
  date,
  integer
} from 'drizzle-orm/pg-core';

// Enums
export const appTypeEnum = pgEnum('app_type', ['test', 'production']);
export const appStatusEnum = pgEnum('app_status', ['Active', 'Inactive']);
export const transactionTypeEnum = pgEnum('transaction_type', [
  'withdraw',
  'deposit',
  'refund'
]);
export const orderStatusEnum = pgEnum('order_status', [
  'Pending',
  'Completed',
  'Cancelled',
  'refunded'
]);
export const planEnum = pgEnum('plan', ['free', 'basic', 'advanced']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  userStatus: boolean('user_status').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User Details table
export const userDetails = pgTable('user_details', {
  id: serial('id').primaryKey(),
  address: text('address'),
  dateOfBirth: date('date_of_birth'),
  country: text('country').default('MZ').notNull(),
  postalCode: text('postal_code'),
  phone: text('phone'),
  alternativeEmail: text('alternative_email'),
  documentId: text('document_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' })
});

// Business Details table
export const businessDetails = pgTable('business_details', {
  id: serial('id').primaryKey(),
  businessName: text('business_name'),
  legalDocument: text('legal_document'),
  email: text('email'),
  address: text('address'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' })
});

// App table
export const apps = pgTable('apps', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  clientId: text('client_id').notNull(),
  clientSecret: text('client_secret').notNull(),
  name: text('name'),
  type: appTypeEnum('type').notNull(),
  status: appStatusEnum('status').default('Active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Wallet table
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  balance: decimal('balance', { precision: 10, scale: 2 })
    .default('0.00')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  appId: integer('app_id').references(() => apps.id, { onDelete: 'cascade' })
});

// Button table
export const buttons = pgTable('buttons', {
  id: serial('id').primaryKey(),
  name: text('name'),
  destination: text('destination').notNull(),
  buttonToken: text('button_token').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  appId: integer('app_id').references(() => apps.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  status: boolean('status').default(true)
});

// Transaction table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  walletId: integer('wallet_id')
    .notNull()
    .references(() => wallets.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  originAccount: text('origin_account'),
  destinationAccount: text('destination_account'),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' })
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  description: text('description'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  paymentMethod: text('payment_method'),
  orderStatus: orderStatusEnum('order_status').default('Pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('MZN').notNull(),
  exchangeRate: decimal('exchange_rate', { precision: 10, scale: 4 }),
  transactionReference: text('transaction_reference'),
  buttonToken: text('button_token'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  walletId: integer('wallet_id').references(() => wallets.id, {
    onDelete: 'cascade'
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Order Items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  name: text('name'),
  price: text('price'),
  quantity: integer('quantity'),
  productId: text('product_id'),
  img: text('img'),
  imgAlt: text('img_alt'),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Product table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  originProductId: text('origin_product_id'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantityOrdered: integer('quantity_ordered').notNull(),
  orderId: integer('order_id').references(() => orders.id, {
    onDelete: 'cascade'
  }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' })
});

// Notification table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sender: text('sender'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false)
});

// Subscription table
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  walletId: integer('wallet_id')
    .notNull()
    .references(() => wallets.id, { onDelete: 'cascade' }),
  plan: planEnum('plan').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  nextPayment: date('next_payment').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
