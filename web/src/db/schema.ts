import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

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
  externalLink: text('external_link'),
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
  externalLink: text('external_link'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  totalAmount: integer('total_amount').notNull(),
  status: text('status').notNull().default('pending'), // pending, paid, shipped, delivered, cancelled
  paymentMethod: text('payment_method').notNull(), // stripe, cod
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, completed, failed
  shippingAddress: text('shipping_address'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  stripeSessionId: text('stripe_session_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtTime: integer('price_at_time').notNull(),
});

// --- Tunisian Legal Administrative Registers (Decree-law 2011-88) ---

// A. Registre des Membres (سجل الأعضاء)
export const associationMembers = sqliteTable('association_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // Link to portal user if applicable
  fullName: text('full_name').notNull(), // الاسم واللقب
  address: text('address').notNull(), // العنوان
  nationality: text('nationality').notNull(), // الجنسية
  age: integer('age').notNull(), // العمر
  profession: text('profession').notNull(), // المهنة
  registrationDate: text('registration_date').notNull(), // تاريخ الانخراط
  subscriptionAmount: real('subscription_amount'), // مبلغ الاشتراك
  status: text('status').notNull().default('active'), // active, former
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// B. Registre des Délibérations (سجل المداولات)
export const associationDeliberations = sqliteTable('association_deliberations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organ: text('organ').notNull(), // الهيكل (الجلسة العامة، المكتب التنفيذي)
  meetingDate: text('meeting_date').notNull(), // تاريخ الاجتماع
  location: text('location').notNull(), // مكان الاجتماع
  subject: text('subject').notNull(), // موضوع المداولة
  decisions: text('decisions').notNull(), // القرارات المتخذة
  fileUrl: text('file_url'), // lien vers le PV scanné et signé
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// C. Registre des Activités et Projets (سجل النشاطات والمشاريع)
export const administrativeProjects = sqliteTable('administrative_projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(), // عنوان المشروع
  nature: text('nature').notNull(), // طبيعة النشاط
  budget: real('budget').notNull(), // الميزانية التقديرية
  fundingSource: text('funding_source'), // مصدر التمويل
  partners: text('partners'), // الشركاء
  startDate: text('start_date'),
  endDate: text('end_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// D. Registre des Aides et Dons (سجل المساعدات والهبات)
export const associationDonations = sqliteTable('association_donations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  donorName: text('donor_name').notNull(), // هوية المانح
  nature: text('nature').notNull(), // (نقدي أو عيني) Nature : numéraire ou en nature
  source: text('source').notNull(), // (عمومي أو خاص) Source : public ou privé
  origin: text('origin').notNull(), // (وطني أو أجنبي) Origine : national ou étranger
  amount: real('amount').notNull(), // المبلغ
  purpose: text('purpose'), // الغرض من الهبة
  dateReceived: text('date_received').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// --- Accounting & Inventory (Tunisian Standard 45) ---

// Chart of Accounts (دليل الحسابات)
export const accountingAccounts = sqliteTable('accounting_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(), // e.g., 53 (Caisse), 70 (Recettes)
  nameAr: text('name_ar').notNull(),
  nameFr: text('name_fr'),
  type: text('type').notNull(), // asset, liability, revenue, expense
});

// Journal Général (الدفتر اليومي)
export const accountingJournal = sqliteTable('accounting_journal', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  description: text('description').notNull(),
  referenceNumber: text('reference_number'), // رقم الوثيقة (فاتورة، وصل...)
  documentUrl: text('document_url'), // Scan de la pièce justificative
  isLocked: integer('is_locked', { mode: 'boolean' }).default(false), // Verrouillage pour intégrité
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// General Ledger Entries (قيود المحاسبة - Double Entry)
export const accountingLedger = sqliteTable('accounting_ledger', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  journalId: integer('journal_id').notNull().references(() => accountingJournal.id, { onDelete: 'cascade' }),
  accountId: integer('account_id').notNull().references(() => accountingAccounts.id),
  debit: real('debit').default(0),
  credit: real('credit').default(0),
});

// Inventory (دفتر الجرد)
export const associationInventory = sqliteTable('association_inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemNameAr: text('item_name_ar').notNull(),
  quantity: integer('quantity').notNull(),
  value: real('value').notNull(), // Valeur d'acquisition
  acquisitionDate: text('acquisition_date').notNull(),
  location: text('location'),
  condition: text('condition'), // جيد، متوسط، يحتاج إصلاح
});

// Audit Log (سجل التتبع)
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(), // CREATE_MEMBER, UPDATE_PROJECT, LOCK_JOURNAL...
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  details: text('details'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// relations
export const journalRelations = relations(accountingJournal, ({ many }) => ({
  entries: many(accountingLedger),
}));

export const ledgerRelations = relations(accountingLedger, ({ one }) => ({
  journal: one(accountingJournal, {
    fields: [accountingLedger.journalId],
    references: [accountingJournal.id],
  }),
  account: one(accountingAccounts, {
    fields: [accountingLedger.accountId],
    references: [accountingAccounts.id],
  }),
}));
