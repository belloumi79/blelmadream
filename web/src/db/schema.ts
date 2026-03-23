import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  role: text('role').notNull().default('user'),
  fullName: text('full_name'),
  email: text('email'),
  phone: text('phone'),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en'),
  titleFr: text('title_fr'),
  slug: text('slug').notNull().unique(),
  descriptionAr: text('description_ar'),
  descriptionEn: text('description_en'),
  descriptionFr: text('description_fr'),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  needsFunding: integer('needs_funding', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en'),
  nameFr: text('name_fr'),
  descriptionAr: text('description_ar'),
  descriptionEn: text('description_en'),
  descriptionFr: text('description_fr'),
  price: integer('price').notNull(), // Stores in cents/millimes to avoid floating point issues
  stockStatus: text('stock_status').notNull().default('in_stock'),
  producerNameAr: text('producer_name_ar'),
  producerNameEn: text('producer_name_en'),
  producerNameFr: text('producer_name_fr'),
  imageUrl: text('image_url'),
});

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en'),
  titleFr: text('title_fr'),
  contentAr: text('content_ar').notNull(),
  contentEn: text('content_en'),
  contentFr: text('content_fr'),
  date: text('date'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
