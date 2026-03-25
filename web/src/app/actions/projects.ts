'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access only');
  }
}

import { put } from '@vercel/blob';

export async function createProject(formData: FormData) {
  await assertAdmin();

  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titleEn = formData.get('titleEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('imageFile') as File;
  const needsFunding = formData.get('needsFunding') === 'on';

  if (!titleAr || !category) {
    throw new Error('Title (AR) and Category are required');
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const filename = `projects/${Date.now()}-${imageFile.name}`;
    const blob = await put(filename, imageFile, { access: 'public' });
    imageUrl = blob.url;
  }

  // Simple slug generation
  const slug = titleAr.trim().replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();

  await db.insert(projects).values({
    id: uuidv4(),
    titleAr,
    titleFr: titleFr || null,
    titleEn: titleEn || null,
    slug,
    descriptionAr: descriptionAr || null,
    category,
    imageUrl,
    needsFunding,
  });

  revalidatePath('/[locale]/admin/projects', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();

  const projectId = formData.get('projectId') as string;
  await db.delete(projects).where(eq(projects.id, projectId));

  revalidatePath('/[locale]/admin/projects', 'page');
  revalidatePath('/[locale]', 'page');
}
