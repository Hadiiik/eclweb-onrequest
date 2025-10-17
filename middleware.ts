import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/dashboard')){
    const admin_token = request.cookies.get('admin_token')?.value
    if(!admin_token) return NextResponse.rewrite(new URL('/not-found', request.url))
    const ADMITOKEN = process.env.ADMITOKEN
    if(!ADMITOKEN) return NextResponse.rewrite(new URL('/not-found', request.url))
    const isAdmin = (admin_token == ADMITOKEN)
    if(!isAdmin) return NextResponse.rewrite(new URL('/not-found', request.url))
  }
  if (pathname.startsWith('/create-invite')){

    const issa_token = request.cookies.get('issa_token')?.value;
    if(!issa_token) return NextResponse.rewrite(new URL('/not-found', request.url))
    const ISSATOKEN = process.env.ISSATOKEN
    if(!ISSATOKEN) return NextResponse.rewrite(new URL('/not-found', request.url))
    const isIssa = (ISSATOKEN == issa_token);
    if(!isIssa) return NextResponse.rewrite(new URL('/not-found', request.url))
  }
  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}