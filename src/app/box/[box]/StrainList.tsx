'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Tag } from 'lucide-react';

type Strain = {
  name: string;
  strain_code: string;
  location: string;
  created_at: string;
  description: string;
  type: string;
  updated_at: string;
  owner: string;
  admin: string;
};

export default function StrainList({ strains }: { strains: Strain[] }) {
  const [query, setQuery] = useState('');

  const filtered = strains.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.strain_code.toLowerCase().includes(query.toLowerCase()) ||
    (s.type && s.type.toLowerCase().includes(query.toLowerCase())) ||
    (s.location && s.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="搜索编号、名称、类型..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xs">{filtered.length} 个样品</span>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  编号
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 hidden sm:table-cell">
                  类型
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 hidden md:table-cell">
                  拥有人
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 hidden lg:table-cell">
                  管理员
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 hidden lg:table-cell">
                  创建时间
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 hidden lg:table-cell">
                  更新时间
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((strain) => (
                  <tr key={strain.strain_code} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/strain/${strain.strain_code}`} className="hover:underline focus:outline-none block">
                        {strain.strain_code}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <Link href={`/strain/${strain.strain_code}`} className="block group-hover:text-blue-700">
                        {strain.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {strain.type && (
                        <div className="flex items-center">
                          <Tag className="w-3 h-3 mr-1 text-gray-400" />
                          {strain.type}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {strain.owner || '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {strain.admin || '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {strain.created_at ? new Date(strain.created_at).toISOString().split('T')[0] : '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {strain.updated_at ? new Date(strain.updated_at).toISOString().split('T')[0] : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    没有找到匹配的样品
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
