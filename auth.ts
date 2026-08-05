/**
 * Admin authentication — Auth.js with GitHub.
 *
 * This is a SINGLE-USER CMS. GitHub proves who someone is; it does not decide
 * whether they may edit this portfolio. Anyone on earth can authenticate with
 * GitHub successfully, so the `signIn` callback below is the actual gate: it
 * compares the GitHub login against ADMIN_GITHUB_LOGIN and refuses everyone
 * else. Without that check, adding the GitHub provider would effectively hand
 * the admin to the entire internet.
 *
 * No database adapter. Sessions are stateless JWTs, which suits one user and
 * keeps auth working even when the content database is asleep — locking
 * yourself out of the CMS because Postgres scaled to zero would be a poor trade.
 *
 * Required environment (see .env.example):
 *   AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET, ADMIN_GITHUB_LOGIN
 */

import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

/** The one GitHub account allowed into the admin. */
const ADMIN_LOGIN = process.env.ADMIN_GITHUB_LOGIN?.toLowerCase().trim()

/**
 * True when every variable Auth.js needs is present. Used to render a helpful
 * message instead of a stack trace on a deployment where auth is not yet set up.
 */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET && process.env.AUTH_SECRET
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  pages: {
    signIn: '/admin/signin',
    error: '/admin/signin',
  },

  callbacks: {
    /**
     * THE authorisation gate. Returning false rejects the sign-in.
     *
     * Fails closed: if ADMIN_GITHUB_LOGIN is unset, nobody gets in. An
     * unconfigured allow-list must never mean "allow everyone".
     */
    signIn({ profile }) {
      if (!ADMIN_LOGIN) {
        console.error('[auth] ADMIN_GITHUB_LOGIN is not set — refusing all sign-ins.')
        return false
      }
      const login = typeof profile?.login === 'string' ? profile.login.toLowerCase() : null
      if (login !== ADMIN_LOGIN) {
        console.warn(`[auth] refused sign-in for GitHub login "${login ?? 'unknown'}".`)
        return false
      }
      return true
    },

    jwt({ token, profile }) {
      if (typeof profile?.login === 'string') token.login = profile.login
      return token
    },

    session({ session, token }) {
      if (typeof token.login === 'string') {
        ;(session.user as { login?: string }).login = token.login
      }
      return session
    },
  },

  session: { strategy: 'jwt' },
  trustHost: true,
})
