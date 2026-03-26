'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { put } from '@vercel/blob';
import { convertToWebP } from '@/lib/image';
import { desc, eq } from 'drizzle-orm';

export async function createEvent(formData: FormData) {
  const session = await auth();
  
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('Unauthorized');
  }

  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titleEn = formData.get('titleEn') as string;
  const contentAr = formData.get('contentAr') as string;
  const contentFr = formData.get('contentFr') as string;
  const contentEn = formData.get('contentEn') as string;
  const dateStr = formData.get('date') as string;
  const imageFile = formData.get('imageFile') as File;

  if (!titleAr || !contentAr) {
    throw new Error('Arabic Title and Content are required');
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const webpBuffer = await convertToWebP(imageFile);
    const filename = `events/${Date.now()}-${imageFile.name.split('.')[0]}.webp`;
    const blob = await put(filename, webpBuffer, { access: 'public' });
    imageUrl = blob.url;
  }

  await db.insert(events).values({
    id: uuidv4(),
    titleAr,
    titleFr: titleFr || null,
    titleEn: titleEn || null,
    contentAr,
    contentFr: contentFr || null,
    contentEn: contentEn || null,
    date: dateStr || null,
    imageUrl,
  });

  revalidatePath('/[locale]/admin/events', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function updateEvent(formData: FormData) {
  const session = await auth();
  
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;
  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titleEn = formData.get('titleEn') as string;
  const contentAr = formData.get('contentAr') as string;
  const contentFr = formData.get('contentFr') as string;
  const contentEn = formData.get('contentEn') as string;
  const dateStr = formData.get('date') as string;
  const imageFile = formData.get('imageFile') as File;

  const updateData: any = {
    titleAr,
    titleFr: titleFr || null,
    titleEn: titleEn || null,
    contentAr,
    contentFr: contentFr || null,
    contentEn: contentEn || null,
    date: dateStr || null,
    updatedAt: new Date(),
  };

  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const webpBuffer = await convertToWebP(imageFile);
    const filename = `events/${Date.now()}-${imageFile.name.split('.')[0]}.webp`;
    const blob = await put(filename, webpBuffer, { access: 'public' });
    updateData.imageUrl = blob.url;
  }

  await db.update(events).set(updateData).where(eq(events.id, id));

  revalidatePath('/[locale]/admin/events', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function deleteEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('Unauthorized');
  }
  const id = formData.get('id') as string;
  await db.delete(events).where(eq(events.id, id));
  revalidatePath('/[locale]/admin/events', 'page');
}
