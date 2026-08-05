/**
 * Protects the admin (Next 16 "proxy" convention — the former middleware.ts).
 *
 * This is the outermost gate: an unauthenticated request to /admin never
 * reaches the page, so no admin markup, data or bundle is served to a stranger.
 * The individual server actions check the session again — middleware guards
 * navigation, not mutations, and a POST to an action must not rely on someone
 * having passed through a page first. Renamed from middleware.ts because Next 16
 * deprecates that convention.
 *
 * /admin/signin is excluded, or signing in would require being signed in.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname.startsWith('/admin/signin')) return NextResponse.next()

  const session = await auth()
  if (session?.user) return NextResponse.next()

  const signInUrl = new URL('/admin/signin', request.url)
  // Preserve where they were heading so sign-in can return them there.
  signInUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  // Only run on admin routes. Matching everything would put auth on the
  // critical path of the public portfolio for no benefit.
  matcher: ['/admin/:path*'],
}
