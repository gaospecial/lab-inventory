'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

// 添加菌株权限
export async function addPermission(formData: FormData) {
  const admin = await checkAdmin();

  const userId = parseInt(formData.get('userId') as string);
  const strainCode = formData.get('strainCode') as string;

  if (!strainCode) {
    throw new Error('Strain code is required');
  }

  try {
    await query(
      `INSERT INTO strain_permissions (user_id, strain_code, granted_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, strain_code) DO NOTHING`,
      [userId, strainCode, admin.id]
    );
    
    revalidatePath(`/admin/users/${userId}/permissions`);
  } catch (error) {
    console.error('Error adding permission:', error);
    throw new Error('Failed to add permission');
  }
}

// 移除菌株权限
export async function removePermission(formData: FormData) {
  await checkAdmin();

  const userId = parseInt(formData.get('userId') as string);
  const strainCode = formData.get('strainCode') as string;

  try {
    await query(
      'DELETE FROM strain_permissions WHERE user_id = $1 AND strain_code = $2',
      [userId, strainCode]
    );
    
    revalidatePath(`/admin/users/${userId}/permissions`);
  } catch (error) {
    console.error('Error removing permission:', error);
    throw new Error('Failed to remove permission');
  }
}