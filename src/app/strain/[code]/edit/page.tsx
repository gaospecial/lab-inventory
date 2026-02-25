import { query } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { updateStrain } from './actions';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default async function EditStrainPage(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const { code } = params;

  // Check authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  try {
    const result = await query(
      'SELECT * FROM strains WHERE strain_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return notFound();
    }

    const strain = result.rows[0];

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/strain/${code}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回详情
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
               <h1 className="text-xl font-bold text-gray-900">编辑样品: {strain.name_chinese}</h1>
               <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono rounded">
                 {strain.strain_code}
               </span>
            </div>
            
            <form action={updateStrain} className="p-6 space-y-6">
              <input type="hidden" name="strain_code" value={strain.strain_code} />
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name_chinese" className="block text-sm font-medium text-gray-700">
                    中文名称
                  </label>
                  <input
                    type="text"
                    name="name_chinese"
                    id="name_chinese"
                    defaultValue={strain.name_chinese}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="name_latin" className="block text-sm font-medium text-gray-700">
                    拉丁学名
                  </label>
                  <input
                    type="text"
                    name="name_latin"
                    id="name_latin"
                    defaultValue={strain.name_latin}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    存放位置
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    defaultValue={strain.location}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="resource_owner" className="block text-sm font-medium text-gray-700">
                    资源归属
                  </label>
                  <input
                    type="text"
                    name="resource_owner"
                    id="resource_owner"
                    defaultValue={strain.resource_owner}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                    联系人
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    id="contact_person"
                    defaultValue={strain.contact_person}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    详细描述
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={6}
                    defaultValue={strain.description || strain.characteristics}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 font-mono text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Link
                  href={`/strain/${code}`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
  } catch (error) {
    console.error('Database error:', error);
    return notFound();
  }
}