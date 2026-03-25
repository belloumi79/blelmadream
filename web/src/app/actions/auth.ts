'use server';

import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/mail';

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) throw new Error('Email and password required');

  const [existingUser] = await db.select().from(users).where(eq(users.email, email));
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  await sendVerificationEmail(email, token);
  
  return { success: true };
}
