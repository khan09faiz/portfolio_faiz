/**
 * Seeds the CMS tables from the existing src/data JSON.
 *
 * Idempotent — re-running updates rows in place rather than duplicating them,
 * so it is safe to run after editing the JSON, and safe to run twice by
 * accident. It does NOT delete rows that are absent from the JSON: once the
 * CMS is in use those are content you created in the admin, and a seed script
 * has no business removing them.
 *
 * `position` is assigned from array index, preserving the order the JSON files
 * carried implicitly. Postgres has no inherent row order.
 *
 * Run with: npm run db:seed   (requires DATABASE_URL)
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { projects, skillCategories, timelineItems } from '../lib/db/schema.ts'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.')
  process.exit(1)
}

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', 'src', 'data')
const read = (file: string) => JSON.parse(readFileSync(join(dataDir, file), 'utf8'))

const db = drizzle(neon(url))

interface JsonProject {
  id: string
  title: string
  description: string
  longDescription?: string
  category: string
  featured: boolean
  technologies: string[]
  links?: { github?: string; live?: string }
  date: string
  images?: string[]
  keyFeatures?: string[]
  impact?: Array<{ label: string; value: string }>
}

interface JsonSkill {
  category: string
  proficiency: number
  color: string
  skills: string[]
}

interface JsonTimelineItem {
  id: string
  type: string
  title: string
  organization: string
  location: string
  startDate: string
  endDate?: string
  description?: string[]
  technologies?: string[]
  icon?: string
}

/** Stable id for skill categories, which have none in the JSON. */
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function seed() {
  const jsonProjects: JsonProject[] = read('projects.json')
  const jsonSkills: JsonSkill[] = read('skills.json')
  const jsonTimeline: JsonTimelineItem[] = read('timeline.json')

  for (const [i, p] of jsonProjects.entries()) {
    const row = {
      id: p.id,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription ?? null,
      category: p.category,
      featured: p.featured,
      technologies: p.technologies,
      links: p.links ?? null,
      date: p.date,
      images: p.images ?? [],
      keyFeatures: p.keyFeatures ?? [],
      impact: p.impact ?? null,
      published: true,
      position: i,
      updatedAt: new Date(),
    }
    await db.insert(projects).values(row).onConflictDoUpdate({ target: projects.id, set: row })
  }

  for (const [i, s] of jsonSkills.entries()) {
    const row = {
      id: slug(s.category),
      category: s.category,
      proficiency: s.proficiency,
      color: s.color,
      skills: s.skills,
      published: true,
      position: i,
      updatedAt: new Date(),
    }
    await db
      .insert(skillCategories)
      .values(row)
      .onConflictDoUpdate({ target: skillCategories.id, set: row })
  }

  for (const [i, t] of jsonTimeline.entries()) {
    const row = {
      id: t.id,
      type: t.type,
      title: t.title,
      organization: t.organization,
      location: t.location,
      startDate: t.startDate,
      endDate: t.endDate ?? null,
      description: t.description ?? [],
      technologies: t.technologies ?? [],
      icon: t.icon ?? null,
      published: true,
      position: i,
      updatedAt: new Date(),
    }
    await db
      .insert(timelineItems)
      .values(row)
      .onConflictDoUpdate({ target: timelineItems.id, set: row })
  }

  console.log(
    `Seeded ${jsonProjects.length} projects, ${jsonSkills.length} skill categories, ` +
      `${jsonTimeline.length} timeline items.`
  )
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
