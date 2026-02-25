import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;

  const decodedCode = decodeURIComponent(code);

  try {
    const result = await query(
      'SELECT * FROM strains WHERE strain_code = $1',
      [decodedCode]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Strain not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}