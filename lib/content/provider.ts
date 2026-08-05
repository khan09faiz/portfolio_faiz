/**
 * Content Provider
 *
 * The single read path for portfolio content. Section components must not read
 * the datastore or the JSON files directly.
 *
 * TWO BACKING STORES, ONE CONTRACT:
 *
 *   DATABASE_URL set  -> reads the CMS tables, published rows only, ordered by
 *                        their explicit position column
 *   otherwise         -> reads the JSON files in src/data
 *
 * The fallback is not a nicety. It means the site builds and serves before Neon
 * is provisioned, preview deployments without the env var still work, and a
 * database outage degrades to the last-known-good content instead of an error
 * page. A portfolio that 500s because a database is asleep is worse than one
 * showing slightly stale projects.
 *
 * The two paths are distinguished in logs: a missing DATABASE_URL is expected
 * and silent, but a configured database that FAILS is logged as an error before
 * falling back, so a real outage is never mistaken for normal operation.
 *
 * Server-only — these run in server components (see app/page.tsx).
 */

import 'server-only'

import { asc, eq } from 'drizzle-orm'
import type { Project, SkillCategory, TimelineItem } from '@/lib/types'
import { getDb, isDatabaseConfigured } from '@/lib/db/client'
import { projects as projectsTable, skillCategories, timelineItems } from '@/lib/db/schema'
import projectsRaw from '@/src/data/projects.json'
import skillsRaw from '@/src/data/skills.json'
import timelineRaw from '@/src/data/timeline.json'

// Shapes are enforced by `npm run validate:content` against ./schemas.ts.
const jsonProjects = projectsRaw as Project[]
const jsonSkills = skillsRaw as SkillCategory[]
const jsonTimeline = timelineRaw as TimelineItem[]

/**
 * Runs a database read, falling back to the bundled JSON on any failure.
 * `label` only appears in error logs.
 */
async function withFallback<T>(
  label: string,
  read: (db: NonNullable<ReturnType<typeof getDb>>) => Promise<T>,
  fallback: T
): Promise<T> {
  const db = getDb()
  if (!db) return fallback

  try {
    return await read(db)
  } catch (error) {
    // Configured but unreachable is a real problem — say so loudly, then keep
    // the site up on the JSON.
    console.error(`[content] ${label} failed, serving bundled JSON instead:`, error)
    return fallback
  }
}

// ============================================================================
// Row -> domain mapping
// ============================================================================
// The DB stores nullable columns where the interfaces use optional properties,
// so nulls are stripped rather than passed through as `null`.

function toProject(row: typeof projectsTable.$inferSelect): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ...(row.longDescription ? { longDescription: row.longDescription } : {}),
    category: row.category as Project['category'],
    featured: row.featured,
    technologies: row.technologies,
    ...(row.links ? { links: row.links } : {}),
    date: row.date,
    ...(row.images?.length ? { images: row.images } : {}),
    ...(row.keyFeatures?.length ? { keyFeatures: row.keyFeatures } : {}),
    ...(row.impact?.length ? { impact: row.impact } : {}),
  }
}

function toSkillCategory(row: typeof skillCategories.$inferSelect): SkillCategory {
  return {
    category: row.category,
    proficiency: row.proficiency,
    color: row.color,
    skills: row.skills,
  }
}

function toTimelineItem(row: typeof timelineItems.$inferSelect): TimelineItem {
  return {
    id: row.id,
    type: row.type as TimelineItem['type'],
    title: row.title,
    organization: row.organization,
    location: row.location,
    startDate: row.startDate,
    ...(row.endDate ? { endDate: row.endDate } : {}),
    ...(row.description?.length ? { description: row.description } : {}),
    ...(row.technologies?.length ? { technologies: row.technologies } : {}),
    ...(row.icon ? { icon: row.icon } : {}),
  }
}

// ============================================================================
// Public read path — published content only
// ============================================================================

export async function getProjects(): Promise<Project[]> {
  return withFallback(
    'getProjects',
    async (db) => {
      const rows = await db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.published, true))
        .orderBy(asc(projectsTable.position))
      return rows.map(toProject)
    },
    jsonProjects
  )
}

export async function getSkills(): Promise<SkillCategory[]> {
  return withFallback(
    'getSkills',
    async (db) => {
      const rows = await db
        .select()
        .from(skillCategories)
        .where(eq(skillCategories.published, true))
        .orderBy(asc(skillCategories.position))
      return rows.map(toSkillCategory)
    },
    jsonSkills
  )
}

export async function getTimeline(): Promise<TimelineItem[]> {
  return withFallback(
    'getTimeline',
    async (db) => {
      const rows = await db
        .select()
        .from(timelineItems)
        .where(eq(timelineItems.published, true))
        .orderBy(asc(timelineItems.position))
      return rows.map(toTimelineItem)
    },
    jsonTimeline
  )
}

/**
 * Achievement-type entries, most recent first.
 * Centralises the "an achievement is a certificate" rule.
 */
export async function getCertificates(): Promise<TimelineItem[]> {
  const timeline = await getTimeline()
  return timeline
    .filter((item) => item.type === 'achievement')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}

/**
 * Everything the home page needs, in one call — one round trip to the datastore
 * rather than three sequential ones.
 */
export async function getHomeContent() {
  const [projects, skills, timeline] = await Promise.all([
    getProjects(),
    getSkills(),
    getTimeline(),
  ])
  return { projects, skills, timeline }
}

/** Which backing store is currently in use. Useful in admin and diagnostics. */
export function getContentSource(): 'database' | 'json' {
  return isDatabaseConfigured() ? 'database' : 'json'
}
