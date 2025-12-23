import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Beaker, MapPin, FileText, Calendar } from 'lucide-react';

// Define a type for our strain data
type Strain = {
  name: string;
  strain_code: string;
  location: string;
  created_at: string;
  description: string;
};

// Server Component
export default async function StrainDetail(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const { code } = params;

  const { data: strain, error } = await supabase
    .from('strains')
    .select('*')
    .eq('strain_code', code)
    .single();

  if (error || !strain) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-2 bg-blue-600"></div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{strain.name}</h1>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                编号: {strain.strain_code}
              </span>
            </div>
            <Beaker className="text-blue-200 h-12 w-12" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start space-x-3">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">存储位置</h3>
                <p className="text-gray-900 font-medium">{strain.location}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">入库日期</h3>
                <p className="text-gray-900 font-medium text-sm">
                   {new Date(strain.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <hr className="my-8 border-gray-100" />
          <div className="flex items-start space-x-3">
            <FileText className="text-gray-400 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">详细描述 / 基因型</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {strain.description || "暂无描述信息"}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-400 italic">实验室资产管理系统 • 内部信息</p>
        </div>
      </div>
    </div>
  );
}
