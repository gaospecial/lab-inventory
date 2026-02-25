const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Pool } = require('pg');

// 读取 CSV 文件
const csvFilePath = path.join(__dirname, '..', 'data', 'example.csv');
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

// 解析 CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

console.log(`读取到 ${records.length} 条记录`);

// 数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 将 CSV 记录转换为数据库字段
function mapRecordToStrain(record) {
  return {
    strain_code: record.strain_code,
    name_chinese: record.name_chinese,
    name_latin: record.name_latin,
    catalog_name: record.catalog_name,
    catalog_id: record.catalog_id,
    taxon_kingdom: record.taxon_kingdom,
    taxon_phylum: record.taxon_phylum,
    taxon_class: record.taxon_class,
    taxon_order: record.taxon_order,
    taxon_family: record.taxon_family,
    taxon_genus: record.taxon_genus,
    taxon_species: record.taxon_species,
    taxon_kingdom2: record.taxon_kingdom2,
    taxon_phylum2: record.taxon_phylum2,
    taxon_class2: record.taxon_class2,
    taxon_order2: record.taxon_order2,
    taxon_family2: record.taxon_family2,
    taxon_genus2: record.taxon_genus2,
    taxon_species2: record.taxon_species2,
    country: record.country,
    country_origin: record.country_origin,
    province: record.province,
    city: record.city,
    district: record.district,
    collection_location: record.collection_location,
    collection_date: record.collection_date,
    isolation_date: record.isolation_date,
    sampling_date: record.sampling_date,
    sampling_number: record.sampling_number,
    isolated_by: record.isolated_by,
    source_history: record.source_history,
    isolation_substrate: record.isolation_substrate,
    resource_owner: record.resource_owner,
    save_method: record.save_method,
    provide_format: record.provide_format,
    physical_state: record.physical_state,
    status_id: record.status_id ? parseInt(record.status_id) : null,
    status_name: record.status_name,
    purpose: record.purpose,
    cultivation_temperature: record.cultivation_temperature,
    cultivation_conditions: record.cultivation_conditions,
    medium_type: record.medium_type,
    oxygen_requirement: record.oxygen_requirement,
    biohazard_level: record.biohazard_level,
    pathogenicity_target: record.pathogenicity_target,
    type_strain: record.type_strain,
    original_number: record.original_number,
    other_strain_code: record.other_strain_code,
    platform_resource_code: record.platform_resource_code,
    rdna16s_login_number: record.rdna16s_login_number,
    rdna16s_sequence: record.rdna16s_sequence,
    func_gene_type: record.func_gene_type,
    genome_sequencing: record.genome_sequencing,
    characteristics: record.characteristics,
    extra_attribute_obj: record.extra_attribute_obj,
    create_time: record.create_time ? BigInt(record.create_time) : null,
    update_time: record.update_time ? BigInt(record.update_time) : null,
    create_user_id: record.create_user_id,
    create_user_name: record.create_user_name,
    update_user_id: record.update_user_id,
    update_user_name: record.update_user_name,
    sorter: record.sorter ? parseInt(record.sorter) : 1,
    show_pic: record.show_pic ? parseInt(record.show_pic) : 1,
    show_flag: record.show_flag ? parseInt(record.show_flag) : 1,
    del_flag: record.del_flag ? parseInt(record.del_flag) : 0,
    views: record.views ? parseInt(record.views) : 0,
    price: record.price,
    share_way: record.share_way,
    transmission_route: record.transmission_route,
    location: record.sampling_number || '', // 使用 sampling_number 作为 location
    contact_person: record.contact_person,
    file_upload: record.file_upload,
    host_name: record.host_name
  };
}

async function importData() {
  const client = await pool.connect();
  
  try {
    console.log('开始导入数据...');
    
    for (const record of records) {
      const strain = mapRecordToStrain(record);
      
      // 构建插入语句
      const columns = Object.keys(strain).filter(key => strain[key] !== null && strain[key] !== undefined);
      const values = columns.map(col => strain[col]);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO strains (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (strain_code) DO UPDATE SET
        ${columns.map(col => `${col} = EXCLUDED.${col}`).join(', ')}
      `;
      
      await client.query(query, values);
      console.log(`✓ 导入: ${strain.strain_code} - ${strain.name_chinese}`);
    }
    
    console.log(`\n成功导入 ${records.length} 条记录`);
    
    // 验证导入
    const result = await client.query('SELECT COUNT(*) FROM strains');
    console.log(`数据库中共有 ${result.rows[0].count} 条菌株记录`);
    
  } catch (error) {
    console.error('导入失败:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importData().catch(console.error);