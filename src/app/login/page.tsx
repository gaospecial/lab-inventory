'use client'

import { useState, use } from 'react'
import { login, signup } from './actions'
import { Beaker, UserPlus, LogIn, Mail, Lock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function LoginPage(props: {
  searchParams: Promise<{ message: string; error: string }>
}) {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = use(props.searchParams)
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Beaker className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            实验室材料管理系统
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? '使用您的账户登录系统' : '创建新账户开始使用'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={cn(
                'flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <LogIn size={18} />
              登录
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={cn(
                'flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                !isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <UserPlus size={18} />
              注册
            </button>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {searchParams.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {searchParams.error}
              </div>
            )}
            
            {/* Success Message */}
            {searchParams.message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
                {searchParams.message}
              </div>
            )}

            <form className="space-y-6">
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="block w-full pl-10 rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      placeholder="请输入您的姓名（可作为用户名登录）"
                    />
                  </div>
                </div>
              )}

              {/* Email field - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱地址
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                </div>
              )}

              {/* Username/Email field - only for login */}
              {isLogin && (
                <div>
                  <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名或邮箱
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="usernameOrEmail"
                      name="usernameOrEmail"
                      type="text"
                      autoComplete="username"
                      required={isLogin}
                      className="block w-full pl-10 rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      placeholder="请输入用户名或邮箱"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    可以使用注册时填写的姓名或邮箱地址登录
                  </p>
                </div>
              )}

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="block w-full pl-10 rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    placeholder={isLogin ? "请输入密码" : "请设置密码（至少6位）"}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                formAction={isLogin ? login : signup}
                className="w-full flex justify-center items-center gap-2 rounded-lg border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              >
                {isLogin ? (
                  <>
                    <LogIn size={18} />
                    登录
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    创建账户
                  </>
                )}
              </button>
            </form>

            {/* Footer info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                {isLogin ? '还没有账户？点击上方"注册"标签创建' : '已有账户？点击上方"登录"标签'}
              </p>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
