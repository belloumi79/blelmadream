'use server';

import { db } from '@/db';
import { 
  associationMembers, 
  associationDeliberations, 
  administrativeProjects, 
  associationDonations,
  accountingAccounts,
  accountingJournal,
  accountingLedger,
  associationInventory,
  auditLogs
} from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { eq, desc, sql } from 'drizzle-orm';
import { put } from '@vercel/blob';

// Audit Log Helper
async function logAction(action: string, entityType: string, entityId: string | null, details: string) {
  const session = await auth();
  await db.insert(auditLogs).values({
    userId: session?.user?.id,
    action,
    entityType,
    entityId: entityId ? String(entityId) : null,
    details,
  });
}

async function assertAccess() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('لم يمر الطلب بنجاح: ليس لديك الصلاحيات الكافية للوصول إلى السجلات الإدارية.');
  }
}

// A. Register des Membres (سجل الأعضاء)
export async function createMember(formData: FormData) {
  await assertAccess();

  const fullName = formData.get('fullName') as string;
  const address = formData.get('address') as string;
  const nationality = formData.get('nationality') as string;
  const age = parseInt(formData.get('age') as string);
  const profession = formData.get('profession') as string;
  const registrationDate = formData.get('registrationDate') as string;
  const subscriptionAmount = parseFloat(formData.get('subscriptionAmount') as string || '0');
  const userId = formData.get('userId') as string || null;

  await db.insert(associationMembers).values({
    fullName,
    address,
    nationality,
    age,
    profession,
    registrationDate,
    subscriptionAmount,
    userId: userId || null,
  });

  revalidatePath('/admin/registres', 'layout');
}

// B. Registre des Délibérations (سجل المداولات)
export async function createDeliberation(formData: FormData) {
  await assertAccess();

  const organ = formData.get('organ') as string;
  const meetingDate = formData.get('meetingDate') as string;
  const location = formData.get('location') as string;
  const subject = formData.get('subject') as string;
  const decisions = formData.get('decisions') as string;
  const file = formData.get('pvFile') as File | null;

  let fileUrl = null;
  if (file && file.size > 0 && file.name !== 'undefined') {
    const filename = `registres/pv-${Date.now()}-${file.name}`;
    const blob = await put(filename, file, { access: 'public' });
    fileUrl = blob.url;
  }

  await db.insert(associationDeliberations).values({
    organ,
    meetingDate,
    location,
    subject,
    decisions,
    fileUrl,
  });

  revalidatePath('/admin/registres', 'layout');
}

// C. Registre des Activités et Projets (سجل النشاطات والمشاريع)
export async function createAdministrativeProject(formData: FormData) {
  await assertAccess();

  const title = formData.get('title') as string;
  const nature = formData.get('nature') as string;
  const budget = parseFloat(formData.get('budget') as string || '0');
  const fundingSource = formData.get('fundingSource') as string;
  const partners = formData.get('partners') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  await db.insert(administrativeProjects).values({
    title,
    nature,
    budget,
    fundingSource,
    partners,
    startDate,
    endDate,
  });

  revalidatePath('/admin/registres', 'layout');
}

// D. Registre des Aides et Dons (سجل المساعدات والهبات)
export async function createDonation(formData: FormData) {
  await assertAccess();

  const donorName = formData.get('donorName') as string;
  const nature = formData.get('nature') as string; // نقدي أو عيني
  const source = formData.get('source') as string; // عمومي أو خاص
  const origin = formData.get('origin') as string; // وطني أو أجنبي
  const amount = parseFloat(formData.get('amount') as string || '0');
  const purpose = formData.get('purpose') as string;
  const dateReceived = formData.get('dateReceived') as string;

  await db.insert(associationDonations).values({
    donorName,
    nature,
    source,
    origin,
    amount,
    purpose,
    dateReceived,
  });

  revalidatePath('/admin/registres', 'layout');
}

// Basic Delete Actions
export async function deleteMember(id: number) {
  await assertAccess();
  await db.delete(associationMembers).where(eq(associationMembers.id, id));
  revalidatePath('/admin/registres', 'layout');
}

export async function deleteDeliberation(id: number) {
  await assertAccess();
  await db.delete(associationDeliberations).where(eq(associationDeliberations.id, id));
  await logAction('DELETE', 'DELIBERATION', String(id), 'Suppression d\'une délibération');
  revalidatePath('/admin/registres', 'layout');
}

// --- NEW COMPLIANT ACCOUNTING ACTIONS ---

export async function createAccountingEntry(formData: FormData) {
  await assertAccess();

  const date = formData.get('date') as string;
  const description = formData.get('description') as string;
  const refNum = formData.get('referenceNumber') as string;
  const debitAccId = parseInt(formData.get('debitAccountId') as string);
  const creditAccId = parseInt(formData.get('creditAccountId') as string);
  const amount = parseFloat(formData.get('amount') as string);
  const file = formData.get('docFile') as File | null;

  // RULE: Tunisian Law - Cash transactions > 500 TND must be via check/transfer
  // We assume account code starting with '53' (e.g., 531) is Caisse/Cash.
  const debitAcc = await db.query.accountingAccounts.findFirst({ where: eq(accountingAccounts.id, debitAccId) });
  const creditAcc = await db.query.accountingAccounts.findFirst({ where: eq(accountingAccounts.id, creditAccId) });
  
  const isCash = debitAcc?.code?.startsWith('53') || creditAcc?.code?.startsWith('53');
  if (isCash && amount > 500) {
    throw new Error('قانونياً: يمنع إجراء معاملات نقدية تتجاوز 500 دينار. يرجى استخدام شيك أو تحويل بنكي.');
  }

  let documentUrl = null;
  if (file && file.size > 0 && file.name !== 'undefined') {
    const filename = `compta/doc-${Date.now()}-${file.name}`;
    const blob = await put(filename, file, { access: 'public' });
    documentUrl = blob.url;
  }

  // 1. Create Journal Header
  const [journal] = await db.insert(accountingJournal).values({
    date,
    description,
    referenceNumber: refNum,
    documentUrl,
  }).returning();

  // 2. Create Double Entry
  await db.insert(accountingLedger).values([
    { journalId: journal.id, accountId: debitAccId, debit: amount, credit: 0 },
    { journalId: journal.id, accountId: creditAccId, debit: 0, credit: amount },
  ]);

  await logAction('CREATE_ENTRY', 'JOURNAL', String(journal.id), `قيد محاسبي: ${description}`);
  revalidatePath('/admin/registres', 'layout');
}

export async function createInventoryItem(formData: FormData) {
  await assertAccess();

  const itemNameAr = formData.get('itemNameAr') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const value = parseFloat(formData.get('value') as string);
  const acquisitionDate = formData.get('acquisitionDate') as string;
  const location = formData.get('location') as string;
  const condition = formData.get('condition') as string;

  const [item] = await db.insert(associationInventory).values({
    itemNameAr,
    quantity,
    value,
    acquisitionDate,
    location,
    condition,
  }).returning();

  await logAction('CREATE_INVENTORY', 'INVENTORY', String(item.id), `جرد قطعة: ${itemNameAr}`);
  revalidatePath('/admin/registres', 'layout');
}

export async function seedAccounts() {
  await assertAccess();
  
  const existing = await db.select().from(accountingAccounts).limit(1);
  if (existing.length > 0) return;

  const initialAccounts = [
    { code: '531', nameAr: 'الصندوق (نقدا)', nameFr: 'Caisse (Espèces)', type: 'asset' },
    { code: '512', nameAr: 'البنك (حساب جاري)', nameFr: 'Banque (Compte Courant)', type: 'asset' },
    { code: '701', nameAr: 'إيرادات الانخراطات', nameFr: 'Recettes des cotisations', type: 'revenue' },
    { code: '702', nameAr: 'الهبات والمساعدات', nameFr: 'Dons et legs', type: 'revenue' },
    { code: '601', nameAr: 'مصاريف التسيير', nameFr: 'Frais de gestion', type: 'expense' },
    { code: '602', nameAr: 'مصاريف المشاريع', nameFr: 'Frais des projets', type: 'expense' },
    { code: '101', nameAr: 'الأصول الصافية (رأس المال)', nameFr: 'Fonds associatif', type: 'liability' },
  ];

  await db.insert(accountingAccounts).values(initialAccounts);
  revalidatePath('/admin/registres', 'layout');
}
