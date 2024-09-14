import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {  } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  // ログイン済みの場合
  if (token && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/top', request.url))
  }
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/top', request.url))
  }
  // ログインしてない場合
  if (!token && request.nextUrl.pathname === '/top') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}