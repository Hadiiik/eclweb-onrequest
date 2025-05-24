import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if(request.nextUrl.pathname.startsWith('/dashboard')) {
        const cookies = request.cookies;
    const adminToken = cookies.get("admin_token")?.value;
    if (!adminToken) 
        return NextResponse.rewrite(new URL('/404', request.url));
    if (adminToken !== process.env.ADMITOKEN)
        return NextResponse.rewrite(new URL('/404', request.url));
    }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}