'use server';

import { db } from '@/db';
import { 
  associationMembers, 
  associationDeliberations, 
  administrativeProjects, 
  associationDonations 
} from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { eq, desc } from 'drizzle-orm';
import { put } from '@vercel/blob';

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
  revalidatePath('/admin/registres', 'layout');
}
