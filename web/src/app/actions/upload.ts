'use server';

import { put } from '@vercel/blob';
import { auth } from '@/auth';

export async function uploadImage(file: File) {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'coadmin')) {
    throw new Error('Unauthorized');
  }

  const filename = `${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: 'public',
  });

  return blob.url;
}
