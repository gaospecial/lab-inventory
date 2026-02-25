import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';
import { addPermission, removePermission } from './actions';

export const metadata = {
  title: '管理菌株权限 - Lab Inventory',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPermissionsPage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  // 检查是否为管理员
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/');
  }

  // 获取目标用户信息
  const userResult = await query(
    'SELECT id, email, name, role FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    return notFound();
  }

  const targetUser = userResult.rows[0];

  // 如果用户不是局部管理员，重定向回用户管理页面
  if (targetUser.role !== 'manager') {
    redirect('/admin/users');
  }

  // 获取用户已有的权限
  const permissionsResult = await query(
    `SELECT sp.strain_code, sp.granted_at, s.name_chinese, s.name_latin
     FROM strain_permissions sp
     JOIN strains s ON sp.strain_code = s.strain_code
     WHERE sp.user_id = $1
     ORDER BY sp.granted_at DESC`,
    [userId]
  );
  const permissions = permissionsResult.rows;

  // 获取所有菌株供选择
  const strainsResult = await query(
    'SELECT strain_code, name_chinese, name_latin FROM strains ORDER BY strain_code'
  );
  const allStrains = strainsResult.rows;

  // 过滤出未授权的菌株
  const permittedCodes = new Set(permissions.map((p: any) => p.strain_code));
  const availableStrains = allStrains.filter(
    (s: any) => !permittedCodes.has(s.strain_code)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回用户管理
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h1 className="text-xl font-bold text-gray-900">
              管理菌株权限
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              用户: {targetUser.name || targetUser.email} ({targetUser.email})
            </p>
          </div>

          <div className="p-6">
            {/* 添加权限表单 */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-700 mb-3">添加菌株权限</h2>
              <form action={addPermission} className="flex gap-2">
                <input type="hidden" name="userId" value={userId} />
                <select
                  name="strainCode"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  required
                >
                  <option value="">选择菌株...</option>
                  {availableStrains.map((strain: any) => (
                    <option key={strain.strain_code} value={strain.strain_code}>
                      {strain.strain_code} - {strain.name_chinese || strain.name_latin || '未命名'}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </button>
              </form>
              {availableStrains.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  所有菌株已授权给此用户
                </p>
              )}
            </div>

            {/* 当前权限列表 */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                已授权的菌株 ({permissions.length})
              </h2>
              
              {permissions.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          菌株代码
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          名称
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          授权时间
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {permissions.map((perm: any) => (
                        <tr key={perm.strain_code} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                            {perm.strain_code}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {perm.name_chinese || perm.name_latin || '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(perm.granted_at).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <form action={removePermission} className="inline">
                              <input type="hidden" name="userId" value={userId} />
                              <input type="hidden" name="strainCode" value={perm.strain_code} />
                              <button
                                type="submit"
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">暂无授权的菌株</p>
                  <p className="text-sm text-gray-400 mt-1">
                    此用户目前无法编辑任何菌株信息
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}