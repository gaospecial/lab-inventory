import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 只保护编辑页面和管理页面
  if (pathname.includes('/edit') || pathname.startsWith('/admin/')) {
    const token = request.cookies.get('auth-token')?.value;

    // 只检查 cookie 是否存在，JWT 验证在 Server Component/Action 中进行
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 简化的 matcher - 只匹配需要保护的路径
export const config = {
  matcher: [
    '/strain/:path*/edit',
    '/admin/:path*',
  ],
};