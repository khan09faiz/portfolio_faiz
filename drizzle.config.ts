import { existsSync, readFileSync } from 'node:fs'
import type { Config } from 'drizzle-kit'

/**
 * drizzle-kit config — used only by the CLI (`npm run db:push`,
 * `npm run db:generate`), never at runtime.
 *
 * drizzle-kit does not read .env.local on its own, so this loads it manually.
 * Deliberately no dotenv dependency: this is a dozen lines and only the CLI
 * needs it.
 *
 * Existing environment variables always win, so CI or a shell export is not
 * silently overridden by a stale local file.
 */
function loadEnvLocal() {
  if (!existsSync('.env.local')) return
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, '')
  }
}

loadEnvLocal()

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
} satisfies Config
