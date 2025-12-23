'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateStrain(formData: FormData) {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const strain_code = formData.get('strain_code') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const location = formData.get('location') as string
  const owner = formData.get('owner') as string
  const admin = formData.get('admin') as string
  const description = formData.get('description') as string

  const { error, count } = await supabase
    .from('strains')
    .update({
      name,
      type,
      location,
      owner,
      admin,
      description,
      updated_at: new Date().toISOString(),
    }, { count: 'exact' })
    .eq('strain_code', strain_code)

  if (error) {
    console.error('Error updating strain:', error)
    redirect(`/strain/${strain_code}/edit?error=Update failed: ${error.message}`)
  }

  if (count === 0) {
    console.error('No rows updated. Check RLS policies or strain_code mismatch.')
    redirect(`/strain/${strain_code}/edit?error=No permission to update or strain not found (RLS)`)
  }

  revalidatePath(`/strain/${strain_code}`)
  redirect(`/strain/${strain_code}`)
}
