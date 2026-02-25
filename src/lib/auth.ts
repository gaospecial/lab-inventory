import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    
    // Fetch user from database
    const { query } = await import('./db');
    const result = await query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0] as User;
  } catch {
    return null;
  }
}