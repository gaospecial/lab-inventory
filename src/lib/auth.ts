import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: UserRole;
  managedStrains: string[];
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
    
    // Fetch user from database with role
    const { query } = await import('./db');
    const result = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0] as User;
  } catch {
    return null;
  }
}

// 获取当前用户及权限信息（包含管理的菌株列表）
export async function getCurrentUserWithPermissions(): Promise<{ user: User; managedStrains: string[] } | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    const { query } = await import('./db');
    
    // 获取用户信息
    const userResult = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [payload.userId]
    );

    if (userResult.rows.length === 0) return null;
    const user = userResult.rows[0] as User;

    // 获取管理的菌株列表（仅对 manager 角色有意义）
    let managedStrains: string[] = [];
    if (user.role === 'manager') {
      const permissionsResult = await query(
        'SELECT strain_code FROM strain_permissions WHERE user_id = $1',
        [user.id]
      );
      managedStrains = permissionsResult.rows.map((row: { strain_code: string }) => row.strain_code);
    }

    return { user, managedStrains };
  } catch {
    return null;
  }
}

// 检查用户是否有权限编辑指定菌株
export async function canEditStrain(user: User, strainCode: string): Promise<boolean> {
  if (user.role === 'admin') return true;
  if (user.role === 'user') return false;
  
  // manager 需要检查具体权限
  const { query } = await import('./db');
  const result = await query(
    'SELECT 1 FROM strain_permissions WHERE user_id = $1 AND strain_code = $2',
    [user.id, strainCode]
  );
  
  return result.rows.length > 0;
}
