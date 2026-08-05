/**
 * Executes SQL statements against the configured database.
 *
 * Exists because `drizzle-kit push` requires an interactive TTY to confirm its
 * plan, which makes it unusable from a script, CI, or an agent session. This
 * runs a .sql file (or inline statements) non-interactively.
 *
 *   npm run db:exec -- drizzle/0000_woozy_siren.sql
 *   npm run db:exec -- --sql "ALTER TABLE projects ALTER COLUMN images SET DEFAULT '{}'"
 *
 * Statements run one at a time over the Neon HTTP driver, which does not accept
 * multiple statements per request. BEGIN/COMMIT lines are stripped for the same
 * reason — the HTTP driver has no session to hold a transaction open across
 * separate requests.
 */

import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const args = process.argv.slice(2)
let statements: string[] = []

if (args[0] === '--sql') {
  statements = [args.slice(1).join(' ')]
} else if (args[0]) {
  const raw = readFileSync(args[0], 'utf8')
  statements = raw
    // strip line comments and drizzle's statement-breakpoint markers
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    // BEGIN/COMMIT cannot span separate HTTP requests
    .filter((s) => !/^(BEGIN|COMMIT|ROLLBACK)$/i.test(s))
} else {
  console.error('Usage: db:exec -- <file.sql> | --sql "<statement>"')
  process.exit(1)
}

const sql = neon(url)

let ok = 0
for (const [i, statement] of statements.entries()) {
  const preview = statement.replace(/\s+/g, ' ').slice(0, 70)
  try {
    await sql.query(statement)
    ok++
    console.log(`  [${i + 1}/${statements.length}] ok   ${preview}…`)
  } catch (error) {
    console.error(`  [${i + 1}/${statements.length}] FAIL ${preview}…`)
    console.error(`        ${(error as Error).message}`)
    process.exit(1)
  }
}

console.log(`\n${ok}/${statements.length} statements applied.`)
