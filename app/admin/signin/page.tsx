/**
 * Admin sign-in.
 *
 * Deliberately says nothing about who the allowed account is, and gives the
 * same message whether a sign-in failed because the GitHub account was wrong or
 * because something else went wrong. A login page that distinguishes those
 * cases tells an attacker which accounts are worth targeting.
 */

import { redirect } from 'next/navigation'
import { auth, signIn, isAuthConfigured } from '@/auth'
import { Github } from 'lucide-react'
import { Enso } from '@/components/ui/sumie/SumieArt'

export const metadata = {
  title: 'Sign in',
  // Never let the admin into search results.
  robots: { index: false, follow: false },
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const { from, error } = await searchParams
  const session = await auth()
  if (session?.user) redirect(from || '/admin')

  const configured = isAuthConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Enso className="mb-5 h-16 w-16 text-sumi" roughness={4} />
          <h1 className="text-2xl font-bold">
            <span className="brush-band">Admin</span>
          </h1>
          <p className="mt-4 text-sm text-muted">Portfolio content management</p>
        </div>

        <div className="rounded-xl border border-accent/40 bg-card p-6 shadow-[0_2px_10px_rgb(var(--sumi)/0.06)]">
          {!configured ? (
            <div className="text-sm">
              <p className="mb-2 font-semibold text-crimson">Authentication is not configured</p>
              <p className="text-muted">
                Set <code className="font-mono text-xs">AUTH_GITHUB_ID</code>,{' '}
                <code className="font-mono text-xs">AUTH_GITHUB_SECRET</code>,{' '}
                <code className="font-mono text-xs">AUTH_SECRET</code> and{' '}
                <code className="font-mono text-xs">ADMIN_GITHUB_LOGIN</code>, then redeploy. See
                .env.example.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 rounded-md border border-crimson/30 bg-crimson/10 px-3 py-2 text-sm text-crimson">
                  Sign-in was refused.
                </p>
              )}
              <form
                action={async () => {
                  'use server'
                  await signIn('github', { redirectTo: from || '/admin' })
                }}
              >
                <button
                  type="submit"
                  className="press-ink flex w-full items-center justify-center gap-2 rounded-lg bg-sumi px-4 py-3 font-medium text-paper transition-colors hover:bg-sumi/90"
                >
                  <Github className="h-5 w-5" />
                  Continue with GitHub
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-muted">
                Only the portfolio owner&apos;s account is permitted.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
