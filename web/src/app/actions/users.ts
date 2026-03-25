'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'belloumi.karim.professional@gmail.com';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || session.user.email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized: Admin access only');
  }
}

export async function updateUserRole(formData: FormData) {
  await assertAdmin();

  const userId = formData.get('userId') as string;
  const newRole = formData.get('role') as string;

  const allowedRoles = ['user', 'subscriber', 'friend'];
  if (!allowedRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

  revalidatePath('/admin/users');
}

export async function deleteUser(formData: FormData) {
  await assertAdmin();

  const userId = formData.get('userId') as string;

  // Prevent deleting the admin account itself
  const [targetUser] = await db.select().from(users).where(eq(users.id, userId));
  if (targetUser?.email === ADMIN_EMAIL) {
    throw new Error('Cannot delete the admin account');
  }

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath('/admin/users');
}
