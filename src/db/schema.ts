import { pgTable, serial, text, integer, boolean, timestamp, jsonb, varchar } from 'drizzle-orm/pg-core';

export const productOverrides = pgTable('product_overrides', {
  reference: varchar('reference', { length: 64 }).primaryKey(),
  collectionSlug: varchar('collection_slug', { length: 64 }).notNull(),
  price: integer('price'),
  available: boolean('available').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  customerName: text('customer_name'),
  customerContact: text('customer_contact'),
  items: jsonb('items').notNull().$type<OrderItem[]>(),
  total: integer('total').notNull(),
  status: varchar('status', { length: 24 }).notNull().default('nouveau'),
  notes: text('notes'),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 24 }).notNull().default('nouveau'),
});

export type OrderItem = {
  reference: string;
  productName: string;
  collectionName: string;
  collectionSlug: string;
  price: number;
  quantity: number;
};

export type ProductOverride = typeof productOverrides.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
