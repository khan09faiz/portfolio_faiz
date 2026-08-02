import type { Config } from 'drizzle-kit'

/**
 * drizzle-kit config — used only by the CLI (`npm run db:generate`,
 * `npm run db:push`), never at runtime.
 *
 * The connection string is read from the environment rather than committed.
 * See .env.example.
 */
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
