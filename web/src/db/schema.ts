import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

import type { AdapterAccountType } from "next-auth/adapters";
import { primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  role: text('role').notNull().default('user'),
  password: text('password'),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

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
