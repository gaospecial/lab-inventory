'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 检查是否为管理员
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}

// 更新用户角色
export async function updateUserRole(formData: FormData) {
  await checkAdmin();

  const userId = parseInt(formData.get('userId') as string);
  const role = formData.get('role') as string;

  if (!['admin', 'manager', 'user'].includes(role)) {
    throw new Error('Invalid role');
  }

  try {
    await query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

// 删除用户
export async function deleteUser(formData: FormData) {
  await checkAdmin();

  const userId = parseInt(formData.get('userId') as string);

  try {
    // 先删除用户的权限记录
    await query('DELETE FROM strain_permissions WHERE user_id = $1', [userId]);
    
    // 删除用户
    await query('DELETE FROM users WHERE id = $1', [userId]);
    
    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}