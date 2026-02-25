'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function updateStrain(formData: FormData) {
  // Authenticate user
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const strain_code = formData.get('strain_code') as string;
  const name_chinese = formData.get('name_chinese') as string;
  const name_latin = formData.get('name_latin') as string;
  const location = formData.get('location') as string;
  const resource_owner = formData.get('resource_owner') as string;
  const contact_person = formData.get('contact_person') as string;
  const description = formData.get('description') as string;

  try {
    const result = await query(
      `UPDATE strains 
       SET name_chinese = $1, 
           name_latin = $2, 
           location = $3, 
           resource_owner = $4, 
           contact_person = $5, 
           description = $6,
           updated_at = NOW()
       WHERE strain_code = $7`,
      [
        name_chinese,
        name_latin,
        location,
        resource_owner,
        contact_person,
        description,
        strain_code,
      ]
    );

    if (result.rowCount === 0) {
      redirect(`/strain/${strain_code}/edit?error=Strain not found or no permission`);
    }

    revalidatePath(`/strain/${strain_code}`);
    redirect(`/strain/${strain_code}`);
  } catch (error) {
    console.error('Error updating strain:', error);
    redirect(`/strain/${strain_code}/edit?error=Update failed`);
  }
}