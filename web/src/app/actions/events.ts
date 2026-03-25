'use server'

import { db } from '@/db';
import { events } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createEvent(formData: FormData) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access only');
  }

  const titleAr = formData.get('titleAr') as string;
// ... (rest of function)
  revalidatePath('/[locale]/admin/events', 'page');
}
