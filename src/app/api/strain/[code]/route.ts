import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;
  const supabase = await createClient();

  const { data: strain, error } = await supabase
    .from('strains')
    .select('*')
    .eq('strain_code', code)
    .single();

  if (error) {
    // If code matches the format but not found, Supabase returns error code PGRST116
    if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Strain not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(strain);
}
