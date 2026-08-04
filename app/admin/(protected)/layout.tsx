/**
 * Admin shell — applies to the PROTECTED admin pages only.
 *
 * It lives in a `(protected)` route group for a specific reason: this layout
 * redirects anyone without a session to /admin/signin. When it sat at
 * app/admin/layout.tsx it also wrapped the sign-in page itself, so signing in
 * required already being signed in — /admin/signin redirected to /admin/signin
 * forever, and curl gave up after 50 hops.
 *
 * Route groups scope a layout without changing the URL, so /admin and
 * /admin/projects still resolve here while /admin/signin escapes it entirely.
 *
 * Second line of defence: proxy.ts already redirects unauthenticated requests,
 * but defence that exists in exactly one place fails silently the day someone
 * edits a matcher. This checks the session again before rendering anything.
 *
 * Kept out of search engines with robots noindex as well as the disallow rule
 * in app/robots.ts — meta and robots.txt cover different crawler behaviours.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { LogOut, LayoutDashboard, FolderGit2, GraduationCap, Sparkles } from 'lucide-react'

export const metadata = {
  title: { default: 'Admin', template: '%s · Admin' },
  robots: { index: false, follow: false, nocache: true },
}

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/timeline', label: 'Timeline', icon: GraduationCap },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/signin')

  const login = (session.user as { login?: string }).login

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-accent/40 bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-mono text-sm font-bold tracking-wide">
              <span className="hanko-seal mr-2 inline-flex h-5 w-5 text-[10px]">印</span>
              admin
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover-brush relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-sumi"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-xs text-muted hover:text-crimson sm:block"
            >
              View site ↗
            </Link>
            {login && <span className="font-mono text-xs text-muted">@{login}</span>}
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/admin/signin' })
              }}
            >
              <button
                type="submit"
                className="press-ink flex items-center gap-1.5 rounded-md border border-accent/40 px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-crimson/40 hover:text-crimson"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-accent/30 px-4 py-2 sm:hidden">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
