import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  // Check if the request is for an edit page
  if (request.nextUrl.pathname.includes('/edit')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};