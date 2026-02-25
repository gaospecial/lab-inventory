import { query } from '@/lib/db';
import { Archive } from 'lucide-react';
import StrainList from './StrainList';
import DataMatrixLabel from '@/components/DataMatrixLabel';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ box: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { box } = params;
  const decodedBox = decodeURIComponent(box);

  return {
    title: `${decodedBox} - Box Details - Lab Inventory`,
    description: `Inventory details for box ${decodedBox}`,
  };
}

export default async function BoxDetail(props: { params: Promise<{ box: string }> }) {
  const params = await props.params;
  const { box } = params;
  const decodedBox = decodeURIComponent(box);

  try {
    const result = await query(
      'SELECT * FROM strains WHERE location ILIKE $1 ORDER BY strain_code ASC',
      [`%${decodedBox}%`]
    );

    const strains = result.rows;

    const hasStrains = strains && strains.length > 0;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              {/* Minimalist Header */}
              <div className="flex items-center space-x-3 mb-6">
                <Archive className="text-gray-400 w-6 h-6" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{decodedBox}</h1>
                {hasStrains && (
                   <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                     {strains.length}
                   </span>
                )}
              </div>
              
              {/* Content */}
              {hasStrains ? (
                <StrainList strains={strains} />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                  <Archive className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">盒子为空</h3>
                  <p className="text-sm text-gray-500">"{decodedBox}" 中没有找到任何样品。</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-56 shrink-0">
               <DataMatrixLabel
                 value={box}
                 label={box}
                 subLabel={`${strains.length} 个样品`}
                 type="box"
               />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching strains:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">出错了</h1>
          <p className="mt-2 text-gray-600">无法加载数据，请稍后重试。</p>
        </div>
      </div>
    );
  }
}