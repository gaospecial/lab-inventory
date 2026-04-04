import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// 公开字段白名单 — 与 strain 端点保持一致
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
  const decodedBox = decodeURIComponent(code);

  try {
    // 转义 ILIKE 通配符，防止通配符注入
    const escaped = decodedBox.replace(/[%_\\]/g, '\\$&');
    const result = await query(
      `SELECT ${PUBLIC_FIELDS} FROM strains WHERE location ILIKE $1 ORDER BY strain_code ASC`,
      [`%${escaped}%`]
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