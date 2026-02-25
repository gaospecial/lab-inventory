'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateToken, setAuthCookie, removeAuthCookie } from '@/lib/auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Find user by email
  const result = await query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [
    email,
  ]);

  if (result.rows.length === 0) {
    redirect('/login?error=Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    redirect('/login?error=Invalid email or password');
  }

  // Generate token and set cookie
  const token = generateToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // Check if user already exists
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    redirect('/login?error=Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const result = await query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email',
    [email, passwordHash, name || null]
  );

  const user = result.rows[0];

  // Generate token and set cookie
  const token = generateToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout() {
  await removeAuthCookie();
  revalidatePath('/', 'layout');
  redirect('/login');
}