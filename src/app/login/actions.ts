'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateToken, setAuthCookie, removeAuthCookie, type UserRole } from '@/lib/auth';

export async function login(formData: FormData) {
  const usernameOrEmail = formData.get('usernameOrEmail') as string;
  const password = formData.get('password') as string;

  if (!usernameOrEmail || !password) {
    redirect('/login?error=请输入用户名/邮箱和密码');
  }

  // 尝试用邮箱或用户名查找用户
  const result = await query(
    'SELECT id, email, name, password_hash, role FROM users WHERE email = $1 OR name = $1',
    [usernameOrEmail]
  );

  if (result.rows.length === 0) {
    redirect('/login?error=用户名/邮箱或密码错误');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    redirect('/login?error=Invalid email or password');
  }

  // 获取用户管理的菌株列表（如果是 manager）
  let managedStrains: string[] = [];
  if (user.role === 'manager') {
    const permissionsResult = await query(
      'SELECT strain_code FROM strain_permissions WHERE user_id = $1',
      [user.id]
    );
    managedStrains = permissionsResult.rows.map((row: { strain_code: string }) => row.strain_code);
  }

  // Generate token and set cookie
  const token = generateToken({ 
    userId: user.id, 
    email: user.email, 
    role: user.role as UserRole,
    managedStrains 
  });
  await setAuthCookie(token);

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    redirect('/login?error=请输入邮箱和密码');
  }

  // 检查邮箱是否已注册
  const existingEmail = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingEmail.rows.length > 0) {
    redirect('/login?error=该邮箱已被注册');
  }

  // 如果填写了用户名，检查是否已存在
  if (name) {
    const existingName = await query('SELECT id FROM users WHERE name = $1', [name]);
    if (existingName.rows.length > 0) {
      redirect('/login?error=该用户名已被使用');
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user (默认 role 为 'user')
  const result = await query(
    'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
    [email, passwordHash, name || null, 'user']
  );

  const user = result.rows[0];

  // Generate token and set cookie
  const token = generateToken({ 
    userId: user.id, 
    email: user.email, 
    role: user.role as UserRole,
    managedStrains: [] 
  });
  await setAuthCookie(token);

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout() {
  await removeAuthCookie();
  revalidatePath('/', 'layout');
  redirect('/login');
}