import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// 公开字段白名单 — 只暴露菌株目录信息，不含内部管理字段
const PUBLIC_FIELDS = [
  'strain_code', 'name_chinese', 'name_latin', 'catalog_name',
  'original_number', 'type_strain',
  'taxon_kingdom', 'taxon_phylum', 'taxon_class', 'taxon_order',
  'taxon_family', 'taxon_genus', 'taxon_species',
  'country', 'province', 'collection_location', 'collection_date',
  'isolation_substrate', 'isolated_by', 'source_history',
  'medium_type', 'cultivation_temperature', 'oxygen_requirement',
  'save_method', 'provide_format',
  'biohazard_level', 'purpose', 'resource_owner', 'status_name',
  'rdna16s_login_number', 'characteristics', 'description',
  'location', 'contact_person', 'create_time',
].join(', ');

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const { code } = params;

  const decodedCode = decodeURIComponent(code);

  try {
    const result = await query(
      `SELECT ${PUBLIC_FIELDS} FROM strains WHERE strain_code = $1`,
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