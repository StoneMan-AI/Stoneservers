import { NextResponse } from 'next/server'

export function middleware(request) {
  // 保护 AI 生图页面
  if (request.nextUrl.pathname.startsWith('/ai-generator')) {
    // 检查是否有认证 cookie
    const sessionCookie = request.cookies.get('stoneservers.sid')
    
    if (!sessionCookie) {
      // 没有认证 cookie，重定向到首页
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/ai-generator/:path*',
    '/api/protected/:path*'
  ]
}