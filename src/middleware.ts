import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/system/:path*', '/me', '/login', '/register'],
}

export function middleware1(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value

  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register')

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith('/system') ||
    req.nextUrl.pathname.startsWith('/me')

  // 🔴 BLOCK BEFORE RENDER
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/system', req.url))
  }

  return NextResponse.next()
}

export const config1 = {
  matcher: ['/system/:path*', '/me', '/login', '/register'],
}
