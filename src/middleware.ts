import { NextResponse, type NextRequest } from 'next/server'

/**
 * Structural auth gate for the custom admin (audit F1): every `/manage/*` route
 * except the login page requires a session cookie. This is a coarse gate (cookie
 * presence only — middleware can't hit the DB); the real validation stays in
 * requireUser()/getCurrentUser() as defense-in-depth. It closes the gap where an
 * individual page forgot to guard itself.
 */
const COOKIE = 'sds_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/manage/login') return NextResponse.next()

  const token = req.cookies.get(COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/manage/login'
    url.search = ''
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*'],
}
