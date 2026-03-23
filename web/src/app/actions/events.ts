'use server'

import { db } from '@/db';
import { events } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const titleAr = formData.get('titleAr') as string;
  const contentAr = formData.get('contentAr') as string;
  const dateStr = formData.get('date') as string;
  const imageUrl = formData.get('imageUrl') as string;

  if (!titleAr || !contentAr) {
    throw new Error('Title and Content are required');
  }

  await db.insert(events).values({
    id: uuidv4(),
    titleAr,
    contentAr,
    date: dateStr || null,
    imageUrl: imageUrl || null,
  });

  revalidatePath('/[locale]/admin/events', 'page');
}
