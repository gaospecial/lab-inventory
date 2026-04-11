import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Beaker, ShieldCheck, FlaskConical, Globe, Tag, FileText, Edit } from 'lucide-react';
import DataMatrixLabel from '@/components/DataMatrixLabel';
import PrintButton from '@/components/PrintButton';
import Link from 'next/link';
import { getCurrentUser, canEditStrain } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

// Define a type for our strain data based on the new schema
type Strain = {
  id: string; // BIGINT as string
  strain_code: string;
  name_chinese: string;
  name_latin: string;
  catalog_name: string;
  taxon_kingdom: string;
  taxon_phylum: string;
  taxon_class: string;
  taxon_order: string;
  taxon_family: string;
  taxon_genus: string;
  taxon_species: string;
  country: string;
  province: string;
  collection_location: string;
  collection_date: string;
  isolation_date: string;
  isolated_by: string;
  source_history: string;
  isolation_substrate: string;
  resource_owner: string;
  save_method: string;
  provide_format: string;
  status_name: string;
  purpose: string;
  cultivation_temperature: string;
  medium_type: string;
  oxygen_requirement: string;
  biohazard_level: string;
  type_strain: string;
  original_number: string;
  rdna16s_login_number: string;
  create_time: number; // timestamp
  characteristics?: string;
  contact_person?: string;
  description?: string;
};

// Generate dynamic metadata
export async function generateMetadata(props: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { code } = params;
  const decodedCode = decodeURIComponent(code);

  try {
    const result = await query(
      'SELECT name_chinese, name_latin, strain_code FROM strains WHERE strain_code = $1',
      [decodedCode]
    );

    if (result.rows.length === 0) {
      return {
        title: 'Strain Not Found',
      };
    }

    const strain = result.rows[0];
    return {
      title: `${strain.name_chinese || strain.name_latin} (${strain.strain_code}) - Lab Inventory`,
      description: `Details for strain ${strain.strain_code}`,
    };
  } catch {
    return {
      title: 'Lab Inventory',
    };
  }
}

// Helper to format date
function formatDate(dateStr: string | number | null) {
  if (!dateStr) return '-';
  try {
    const date = new Date(typeof dateStr === 'number' ? dateStr : dateStr);
    return date.toLocaleDateString('zh-CN');
  } catch {
    return String(dateStr);
  }
}

// Helper Component for Info Rows
function InfoRow({ label, value }: { label: string, value?: string | number | null }) {
    return (
        <div className="flex items-start justify-between group">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] break-words">
                {value || '-'}
            </span>
        </div>
    );
}

// Server Component
export default async function StrainDetail(props: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ message?: string; error?: string; success?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { code } = params;
  const decodedCode = decodeURIComponent(code);

  // 获取当前用户及权限
  const user = await getCurrentUser();
  const canEdit = user ? await canEditStrain(user, decodedCode) : false;

  let strain: Strain;
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

    strain = result.rows[0] as Strain;
  } catch (error) {
    console.error('Database error:', error);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="h-2 bg-blue-600"></div>

          {/* 成功/错误消息 */}
          {searchParams.success === 'true' && (
            <div className="px-8 pt-6 bg-green-50">
              <div className="p-4 rounded-lg bg-green-100 text-green-800">
                保存成功
              </div>
            </div>
          )}
          {searchParams.error === 'save_failed' && (
            <div className="px-8 pt-6 bg-red-50">
              <div className="p-4 rounded-lg bg-red-100 text-red-800">
                保存失败，请重试
              </div>
            </div>
          )}
          {searchParams.error && searchParams.error !== 'save_failed' && (
            <div className="px-8 pt-6 bg-red-50">
              <div className="p-4 rounded-lg bg-red-100 text-red-800">
                {decodeURIComponent(searchParams.error)}
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex flex-col items-start gap-1">
                  {strain.name_chinese}
                  <span className="text-xl font-normal text-gray-500 italic">({strain.name_latin})</span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    {strain.strain_code}
                    </span>
                    {strain.type_strain === '模式菌株' && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-100">
                            模式菌株
                        </span>
                    )}
                     <span className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-medium rounded-full border border-gray-200">
                        {strain.catalog_name}
                    </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Icon or Status Indicator */}
                <div className={cn('h-12 w-12 rounded-full flex items-center justify-center', strain.status_name === '现货' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400')}>
                    <Beaker size={24} />
                </div>
                {/* Edit link - 根据权限显示 */}
                {canEdit && (
                  <Link
                    href={`/strain/${strain.strain_code}/edit`}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                    编辑
                  </Link>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">

                {/* Section: Basic & Classification */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Tag size={16} /> 基本信息
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                         <InfoRow label="原始编号" value={strain.original_number} />
                         <InfoRow label="界 (Kingdom)" value={strain.taxon_kingdom} />
                         <InfoRow label="门 (Phylum)" value={strain.taxon_phylum} />
                         <InfoRow label="纲 (Class)" value={strain.taxon_class} />
                         <InfoRow label="目 (Order)" value={strain.taxon_order} />
                         <InfoRow label="科 (Family)" value={strain.taxon_family} />
                         <InfoRow label="属 (Genus)" value={strain.taxon_genus} />
                         <InfoRow label="种 (Species)" value={strain.taxon_species} />
                    </div>
                </div>

                {/* Section: Origin & Isolation */}
                <div className="space-y-4">
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Globe size={16} /> 来源与分离
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <InfoRow label="原产国" value={strain.country} />
                        <InfoRow label="来源省份" value={strain.province} />
                        <InfoRow label="采集地点" value={strain.collection_location} />
                        <InfoRow label="分离基质" value={strain.isolation_substrate} />
                        <InfoRow label="采集日期" value={strain.collection_date} />
                        <InfoRow label="分离人" value={strain.isolated_by} />
                        <InfoRow label="来源历史" value={strain.source_history} />
                    </div>
                </div>

                {/* Section: Cultivation */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                        <FlaskConical size={16} /> 培养条件
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <InfoRow label="培养基" value={strain.medium_type} />
                        <InfoRow label="培养温度" value={strain.cultivation_temperature} />
                        <InfoRow label="需氧性" value={strain.oxygen_requirement} />
                        <InfoRow label="保存方法" value={strain.save_method} />
                         <InfoRow label="提供形式" value={strain.provide_format} />
                    </div>
                </div>

                {/* Section: Properties & Management */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                        <ShieldCheck size={16} /> 属性与管理
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <InfoRow label="生物危害等级" value={strain.biohazard_level} />
                        <InfoRow label="用途" value={strain.purpose} />
                        <InfoRow label="资源归属" value={strain.resource_owner} />
                        <InfoRow label="库存状态" value={strain.status_name} />
                        <InfoRow label="创建时间" value={formatDate(strain.create_time)} />
                        <InfoRow label="16S rDNA" value={strain.rdna16s_login_number} />
                        <InfoRow label="联系人" value={strain.contact_person} />
                    </div>
                </div>

            </div>

             {/* Characteristics / Description */}
            {(strain.characteristics || strain.description) && (
                <div className="mt-10">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2 mb-4">
                         <FileText size={16} /> 特征特性
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-lg text-gray-700 leading-relaxed text-sm">
                        {strain.characteristics || strain.description}
                    </div>
                </div>
            )}

          </div>

           <div className="bg-gray-50 px-8 py-4 text-center mt-auto border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">实验室资产管理系统 • 内部信息</p>
          </div>
        </div>

        {/* Sidebar / QR Code */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4">资产标签</h3>
                <div className="flex justify-center">
                     <DataMatrixLabel
                        value={strain.strain_code}
                        label={strain.strain_code}
                        subLabel={strain.name_chinese}
                        latinName={strain.name_latin}
                        isolatedBy={strain.isolated_by}
                        collectionDate={strain.collection_date}
                        type="strain"
                    />
                </div>
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 mb-2">扫描上方二维码查看详情</p>
                    <PrintButton />
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-900 font-bold mb-2">需要修改信息?</h3>
              {canEdit ? (
                <p className="text-blue-700 text-sm mb-4">
                  您有权限编辑此菌株信息，请点击上方的&quot;编辑&quot;按钮。
                </p>
              ) : user ? (
                <p className="text-blue-700 text-sm mb-4">
                  您当前无权限编辑此菌株，请联系全局管理员获取权限。
                </p>
              ) : (
                <p className="text-blue-700 text-sm mb-4">
                  请登录后联系管理员获取编辑权限。
                </p>
              )}
            </div>
        </div>

      </div>
    </div>
  );
}
