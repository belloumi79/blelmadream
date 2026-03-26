'use server';

import { db } from '@/db';
import { products } from '@/db/schema';
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

export async function createProduct(formData: FormData) {
  await assertAdmin();

  const nameAr = formData.get('nameAr') as string;
  const nameEn = formData.get('nameEn') as string;
  const nameFr = formData.get('nameFr') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const descriptionEn = formData.get('descriptionEn') as string;
  const descriptionFr = formData.get('descriptionFr') as string;
  const producerNameAr = formData.get('producerNameAr') as string;
  const producerNameEn = formData.get('producerNameEn') as string;
  const producerNameFr = formData.get('producerNameFr') as string;
  
  // Price in millimes/cents (e.g., 10.500 DT -> 10500)
  const priceInput = parseFloat(formData.get('price') as string) || 0;
  const price = Math.round(priceInput * 1000); 
  
  const imageFile = formData.get('imageFile') as File;
  const stockStatus = formData.get('stockStatus') as 'in_stock' | 'out_of_stock' | 'on_order' || 'in_stock';

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const webpBuffer = await convertToWebP(imageFile);
    const filename = `products/${Date.now()}-${imageFile.name.split('.')[0]}.webp`;
    const blob = await put(filename, webpBuffer, { access: 'public' });
    imageUrl = blob.url;
  }

  await db.insert(products).values({
    id: uuidv4(),
    nameAr,
    nameEn: nameEn || null,
    nameFr: nameFr || null,
    descriptionAr: descriptionAr || null,
    descriptionEn: descriptionEn || null,
    descriptionFr: descriptionFr || null,
    producerNameAr: producerNameAr || null,
    producerNameEn: producerNameEn || null,
    producerNameFr: producerNameFr || null,
    price,
    imageUrl,
    stockStatus,
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
