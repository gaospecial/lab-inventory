import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;
  const decodedBox = decodeURIComponent(code);

  try {
    const result = await query(
      'SELECT * FROM strains WHERE location ILIKE $1 ORDER BY strain_code ASC',
      [`%${decodedBox}%`]
    );

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}