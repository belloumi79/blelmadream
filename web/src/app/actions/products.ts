'use server';

import { db } from '@/db';
import { products } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function createProduct(formData: FormData) {
  await assertAdmin();

  const nameAr = formData.get('nameAr') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const price = parseFloat(formData.get('price') as string) || 0;
  const imageFile = formData.get('imageFile') as File;
  const isAvailable = formData.get('isAvailable') === 'on';

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const filename = `products/${Date.now()}-${imageFile.name}`;
    const blob = await put(filename, imageFile, { access: 'public' });
    imageUrl = blob.url;
  }

  await db.insert(products).values({
    id: uuidv4(),
    nameAr,
    descriptionAr,
    price,
    imageUrl,
    isAvailable,
  });

  revalidatePath('/[locale]/admin/products', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  await db.delete(products).where(eq(products.id, id));
  revalidatePath('/[locale]/admin/products', 'page');
  revalidatePath('/[locale]', 'page');
}
