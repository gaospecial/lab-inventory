'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { getCurrentUser, canEditStrain } from '@/lib/auth';

export async function updateStrain(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const strain_code = formData.get('strain_code') as string;

  const hasPermission = await canEditStrain(user, strain_code);
  if (!hasPermission) {
    redirect(`/strain/${strain_code}?error=无权限编辑此菌株`);
  }

  // 获取所有表单字段
  const fields = [
    'name_chinese',
    'name_latin',
    'catalog_name',
    'original_number',
    'type_strain',
    'taxon_kingdom',
    'taxon_phylum',
    'taxon_class',
    'taxon_order',
    'taxon_family',
    'taxon_genus',
    'taxon_species',
    'country',
    'province',
    'collection_location',
    'isolation_substrate',
    'collection_date',
    'isolated_by',
    'source_history',
    'medium_type',
    'cultivation_temperature',
    'oxygen_requirement',
    'save_method',
    'provide_format',
    'biohazard_level',
    'purpose',
    'resource_owner',
    'status_name',
    'rdna16s_login_number',
    'contact_person',
    'characteristics',
    'description',
  ];

  const values: (string | null)[] = fields.map(field => {
    const value = formData.get(field);
    return value === null || value === '' ? null : value as string;
  });

  try {
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const result = await query(
      `UPDATE strains 
       SET ${setClause}, 
           updated_at = NOW()
       WHERE strain_code = $${fields.length + 1}`,
      [...values, strain_code]
    );

    if (result.rowCount === 0) {
      throw new Error('Strain not found or no permission');
    }

    revalidatePath(`/strain/${strain_code}`);
  } catch (error) {
    console.error('Error updating strain:', error);
    const encodedStrainCode = encodeURIComponent(strain_code);
    // 使用英文错误代码，避免 HTTP 头中的中文字符问题
    redirect(`/strain/${encodedStrainCode}/edit?error=save_failed`);
  }

  // 成功后的重定向放在 try-catch 之外
  const encodedStrainCode = encodeURIComponent(strain_code);
  // 使用英文成功代码，避免 HTTP 头中的中文字符问题
  redirect(`/strain/${encodedStrainCode}?success=true`);
}