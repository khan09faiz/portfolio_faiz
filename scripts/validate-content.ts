/**
 * Content validation gate.
 *
 * Parses every file under src/data against lib/content/schemas.ts and exits
 * non-zero on the first invalid file. Run via `npm run validate:content`.
 *
 * This runs OUTSIDE `next build` by design: it is a CI/local gate, so a problem
 * here can never take the production deploy down with it. Uses Node's built-in
 * type stripping, so it needs no extra dependency.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import type { ZodType } from 'zod'
import { projectsSchema, skillsSchema, timelineSchema } from '../lib/content/schemas.ts'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')

const targets: Array<{ file: string; schema: ZodType }> = [
  { file: 'projects.json', schema: projectsSchema },
  { file: 'skills.json', schema: skillsSchema },
  { file: 'timeline.json', schema: timelineSchema },
]

let failed = false

for (const { file, schema } of targets) {
  const path = join(dataDir, file)

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    console.error(`✖ ${file} — could not be read or is not valid JSON`)
    console.error(`  ${(error as Error).message}`)
    failed = true
    continue
  }

  const result = schema.safeParse(parsed)

  if (result.success) {
    const count = Array.isArray(result.data) ? result.data.length : 1
    console.log(`✓ ${file} — ${count} record(s) valid`)
    continue
  }

  failed = true
  console.error(`✖ ${file} — ${result.error.issues.length} issue(s)`)
  for (const issue of result.error.issues) {
    const location = issue.path.length ? issue.path.join('.') : '(root)'
    console.error(`  ${location}: ${issue.message}`)
  }
}

if (failed) {
  console.error('\nContent validation failed.')
  process.exit(1)
}

console.log('\nAll content files valid.')
