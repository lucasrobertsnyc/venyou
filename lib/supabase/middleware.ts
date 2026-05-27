import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/log', '/stats', '/rankings', '/wishlist']
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  )

  if (!isProtected) return NextResponse.next()

  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(
    c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token') && c.value.length > 0
  )

  if (!hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
