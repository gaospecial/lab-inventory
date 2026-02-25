import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Shield, User, UserCog } from 'lucide-react';
import { updateUserRole, deleteUser } from './actions';

export const metadata = {
  title: '用户管理 - Lab Inventory',
};

export default async function AdminUsersPage() {
  // 检查是否为管理员
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/');
  }

  // 获取所有用户
  const result = await query(
    'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
  );
  const users = result.rows;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <Shield size={12} />
            全局管理员
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <UserCog size={12} />
            局部管理员
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            <User size={12} />
            普通用户
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回首页
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">用户管理</h1>
              <p className="text-sm text-gray-500 mt-1">管理系统用户和权限</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || '未设置姓名'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'admin' && (
                          <form action={updateUserRole} className="inline">
                            <input type="hidden" name="userId" value={user.id} />
                            <input
                              type="hidden"
                              name="role"
                              value={user.role === 'manager' ? 'user' : 'manager'}
                            />
                            <button
                              type="submit"
                              className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                            >
                              {user.role === 'manager' ? '设为普通用户' : '设为局部管理员'}
                            </button>
                          </form>
                        )}
                        {user.id !== currentUser.id && user.role !== 'admin' && (
                          <form action={deleteUser} className="inline">
                            <input type="hidden" name="userId" value={user.id} />
                            <button
                              type="submit"
                              className="text-red-600 hover:text-red-900 text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                            >
                              删除
                            </button>
                          </form>
                        )}
                        {user.role === 'manager' && (
                          <Link
                            href={`/admin/users/${user.id}/permissions`}
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                          >
                            管理权限
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无用户</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-blue-900 font-medium mb-2">角色说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>全局管理员</strong>：可以编辑所有菌株信息，管理用户和权限</li>
            <li>• <strong>局部管理员</strong>：只能编辑被授权的特定菌株信息</li>
            <li>• <strong>普通用户</strong>：只能查看菌株信息，无法编辑</li>
          </ul>
        </div>
      </div>
    </div>
  );
}