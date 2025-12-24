import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;
  const decodedBox = decodeURIComponent(code);
  const supabase = await createClient();

  const { data: strains, error } = await supabase
    .from('strains')
    .select('*')
    .ilike('location', `%${decodedBox}%`)
    .order('strain_code', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(strains || []);
}
