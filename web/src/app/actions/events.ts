'use server'

import { db } from '@/db';
import { events } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

import { put } from '@vercel/blob';

export async function createEvent(formData: FormData) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access only');
  }

  const titleAr = formData.get('titleAr') as string;
  const contentAr = formData.get('contentAr') as string;
  const dateStr = formData.get('date') as string;
  const imageFile = formData.get('imageFile') as File;

  if (!titleAr || !contentAr) {
    throw new Error('Title and Content are required');
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const filename = `events/${Date.now()}-${imageFile.name}`;
    const blob = await put(filename, imageFile, { access: 'public' });
    imageUrl = blob.url;
  }

  await db.insert(events).values({
    id: uuidv4(),
    titleAr,
    contentAr,
    date: dateStr || null,
    imageUrl,
  });

  revalidatePath('/[locale]/admin/events', 'page');
  revalidatePath('/[locale]', 'page');
}
