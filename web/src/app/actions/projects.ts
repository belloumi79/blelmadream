'use server';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import { convertToWebP } from '@/lib/image';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('Unauthorized');
  }
}

export async function createProject(formData: FormData) {
  await assertAdmin();

  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titleEn = formData.get('titleEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const descriptionFr = formData.get('descriptionFr') as string;
  const descriptionEn = formData.get('descriptionEn') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('imageFile') as File;
  const needsFunding = formData.get('needsFunding') === 'on';

  if (!titleAr || !category) {
    throw new Error('Title (AR) and Category are required');
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const webpBuffer = await convertToWebP(imageFile);
    const filename = `projects/${Date.now()}-${imageFile.name.split('.')[0]}.webp`;
    const blob = await put(filename, webpBuffer, { access: 'public' });
    imageUrl = blob.url;
  }

  // Simple slug generation
  const slug = titleFr 
    ? titleFr.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4)
    : titleAr.trim().replace(/\s+/g, '-').slice(0, 50) + '-' + Date.now().toString().slice(-4);

  await db.insert(projects).values({
    id: uuidv4(),
    titleAr,
    titleFr: titleFr || null,
    titleEn: titleEn || null,
    slug,
    descriptionAr: descriptionAr || null,
    descriptionFr: descriptionFr || null,
    descriptionEn: descriptionEn || null,
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

export async function updateProject(formData: FormData) {
  await assertAdmin();

  const id = formData.get('id') as string;
  const titleAr = formData.get('titleAr') as string;
  const titleFr = formData.get('titleFr') as string;
  const titleEn = formData.get('titleEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const descriptionFr = formData.get('descriptionFr') as string;
  const descriptionEn = formData.get('descriptionEn') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('imageFile') as File;
  const needsFunding = formData.get('needsFunding') === 'on';

  const updateData: any = {
    titleAr,
    titleFr: titleFr || null,
    titleEn: titleEn || null,
    descriptionAr: descriptionAr || null,
    descriptionFr: descriptionFr || null,
    descriptionEn: descriptionEn || null,
    category,
    needsFunding,
    updatedAt: new Date(),
  };

  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const webpBuffer = await convertToWebP(imageFile);
    const filename = `projects/${Date.now()}-${imageFile.name.split('.')[0]}.webp`;
    const blob = await put(filename, webpBuffer, { access: 'public' });
    updateData.imageUrl = blob.url;
  }

  await db.update(projects).set(updateData).where(eq(projects.id, id));

  revalidatePath('/[locale]/admin/projects', 'page');
  revalidatePath('/[locale]', 'page');
}
