import { query } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, canEditStrain } from '@/lib/auth';
import { updateStrain } from './actions';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  required?: boolean;
  colSpan?: number;
}

function InputField({ label, name, value, type = "text", required = false, colSpan = 1 }: InputFieldProps) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        defaultValue={value || ''}
        required={required}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-gray-900"
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  value?: string | null;
  rows?: number;
}

function TextAreaField({ label, name, value, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        rows={rows}
        defaultValue={value || ''}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 text-gray-900 font-mono"
      />
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="col-span-2 border-b border-gray-200 pb-2 mb-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default async function EditStrainPage(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const { code } = params;
  const decodedCode = decodeURIComponent(code);

  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const hasPermission = await canEditStrain(user, decodedCode);
  if (!hasPermission) {
    redirect(`/strain/${code}?error=无权限编辑此菌株`);
  }

  let strain;
  try {
    const result = await query(
      `SELECT strain_code, name_chinese, name_latin, catalog_name, taxon_kingdom, taxon_phylum,
       taxon_class, taxon_order, taxon_family, taxon_genus, taxon_species, country, province,
       collection_location, collection_date, isolation_date, isolated_by, source_history,
       isolation_substrate, resource_owner, save_method, provide_format, status_name, purpose,
       cultivation_temperature, medium_type, oxygen_requirement, biohazard_level, type_strain,
       original_number, rdna16s_login_number, create_time, characteristics, contact_person, description
       FROM strains WHERE strain_code = $1`,
      [decodedCode]
    );

    if (result.rows.length === 0) {
      return notFound();
    }

    strain = result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/strain/${code}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回详情
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">编辑菌株信息</h1>
              <p className="text-sm text-gray-500 mt-1">修改样品详细信息</p>
            </div>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-mono rounded-lg border border-blue-200">
              {strain.strain_code}
            </span>
          </div>
          
          <form action={updateStrain} className="p-8">
            <input type="hidden" name="strain_code" value={strain.strain_code} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* 基本信息 */}
              <SectionTitle title="基本信息" />
              <InputField label="中文名称" name="name_chinese" value={strain.name_chinese} required colSpan={2} />
              <InputField label="拉丁学名" name="name_latin" value={strain.name_latin} colSpan={2} />
              <InputField label="菌种目录" name="catalog_name" value={strain.catalog_name} />
              <InputField label="原始编号" name="original_number" value={strain.original_number} />
              <InputField label="模式菌株" name="type_strain" value={strain.type_strain} />

              {/* 分类信息 */}
              <SectionTitle title="分类信息" />
              <InputField label="界 (Kingdom)" name="taxon_kingdom" value={strain.taxon_kingdom} />
              <InputField label="门 (Phylum)" name="taxon_phylum" value={strain.taxon_phylum} />
              <InputField label="纲 (Class)" name="taxon_class" value={strain.taxon_class} />
              <InputField label="目 (Order)" name="taxon_order" value={strain.taxon_order} />
              <InputField label="科 (Family)" name="taxon_family" value={strain.taxon_family} />
              <InputField label="属 (Genus)" name="taxon_genus" value={strain.taxon_genus} />
              <InputField label="种 (Species)" name="taxon_species" value={strain.taxon_species} colSpan={2} />

              {/* 来源与分离 */}
              <SectionTitle title="来源与分离" />
              <InputField label="原产国" name="country" value={strain.country} />
              <InputField label="来源省份" name="province" value={strain.province} />
              <InputField label="采集地点" name="collection_location" value={strain.collection_location} colSpan={2} />
              <InputField label="分离基质" name="isolation_substrate" value={strain.isolation_substrate} colSpan={2} />
              <InputField label="采集日期" name="collection_date" value={strain.collection_date} />
              <InputField label="分离人" name="isolated_by" value={strain.isolated_by} />
              <TextAreaField label="来源历史" name="source_history" value={strain.source_history} rows={2} />

              {/* 培养条件 */}
              <SectionTitle title="培养条件" />
              <InputField label="培养基" name="medium_type" value={strain.medium_type} />
              <InputField label="培养温度" name="cultivation_temperature" value={strain.cultivation_temperature} />
              <InputField label="需氧性" name="oxygen_requirement" value={strain.oxygen_requirement} />
              <InputField label="保存方法" name="save_method" value={strain.save_method} />
              <InputField label="提供形式" name="provide_format" value={strain.provide_format} />

              {/* 属性与管理 */}
              <SectionTitle title="属性与管理" />
              <InputField label="生物危害等级" name="biohazard_level" value={strain.biohazard_level} />
              <InputField label="用途" name="purpose" value={strain.purpose} />
              <InputField label="资源归属" name="resource_owner" value={strain.resource_owner} />
              <InputField label="库存状态" name="status_name" value={strain.status_name} />
              <InputField label="16S rDNA 登录号" name="rdna16s_login_number" value={strain.rdna16s_login_number} />
              <InputField label="联系人" name="contact_person" value={strain.contact_person} colSpan={2} />

              {/* 特征描述 */}
              <SectionTitle title="特征描述" />
              <TextAreaField label="特征特性" name="characteristics" value={strain.characteristics} rows={4} />
              <TextAreaField label="详细描述" name="description" value={strain.description} rows={4} />

            </div>

            <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
              <Link
                href={`/strain/${code}`}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                保存更改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}