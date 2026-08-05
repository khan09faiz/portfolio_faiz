/**
 * Database connection.
 *
 * DELIBERATELY OPTIONAL. `getDb()` returns null when DATABASE_URL is not set,
 * and the content provider falls back to the JSON files. That means:
 *
 *   - the site keeps building and serving before Neon is provisioned
 *   - a preview deployment without the env var does not hard-fail
 *   - local development needs no database at all unless you want one
 *
 * Uses the neon-http driver rather than a pooled TCP connection: serverless
 * functions are short-lived and a connection pool that outlives the request is
 * worse than useless there.
 *
 * Server-only. Never import this from a client component — DATABASE_URL is not
 * NEXT_PUBLIC_ prefixed, so it would be undefined in the browser anyway, but
 * the import itself has no business in a client bundle.
 */

import 'server-only'

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type Database = ReturnType<typeof createDb>

function createDb(connectionString: string) {
  return drizzle(neon(connectionString), { schema })
}

let cached: Database | null = null

/** True when a connection string is configured. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/**
 * The Drizzle client, or null when no DATABASE_URL is configured.
 * Callers must handle null rather than assuming a database exists.
 */
export function getDb(): Database | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!cached) cached = createDb(url)
  return cached
}

export { schema }
