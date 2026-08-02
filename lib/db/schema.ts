/**
 * Database schema — the CMS content model.
 *
 * Mirrors the interfaces in lib/types.ts one-for-one so the existing JSON seeds
 * without transformation and the public site keeps rendering identically. If
 * you change a column here, change the matching interface and the Zod schema in
 * lib/content/schemas.ts too — all three are meant to describe the same shape.
 *
 * Two deliberate additions the JSON does not have:
 *
 *   published — docs/03_SOURCE_OF_TRUTH.md requires the public site to read
 *               only published content. Drafts live in the same table and are
 *               filtered out by the public read path, never by the admin one.
 *
 *   position  — the JSON files carried an implicit order (file order) that a
 *               database does not preserve. Without an explicit sort key, rows
 *               come back in whatever order Postgres finds convenient, which
 *               would quietly reshuffle the site on every deploy.
 */

import { boolean, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/** Shared audit columns. */
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}

// ============================================================================
// Projects
// ============================================================================

export const projects = pgTable(
  'projects',
  {
    // Text ids, not serial — the existing content uses human-readable slugs
    // like 'gig-idea-generation', which are also better URLs later.
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    longDescription: text('long_description'),
    category: text('category').notNull(),
    featured: boolean('featured').default(false).notNull(),
    technologies: text('technologies').array().notNull().default([]),
    /** { github?: string; live?: string } */
    links: jsonb('links').$type<{ github?: string; live?: string }>(),
    /** ISO calendar date, kept as text to match the existing YYYY-MM-DD data. */
    date: text('date').notNull(),
    images: text('images').array().default([]),
    keyFeatures: text('key_features').array().default([]),
    /** Array of { label, value } */
    impact: jsonb('impact').$type<Array<{ label: string; value: string }>>(),
    published: boolean('published').default(true).notNull(),
    position: integer('position').default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    // The public read path always filters on published and sorts on position.
    index('projects_published_position_idx').on(table.published, table.position),
  ]
)

// ============================================================================
// Skill categories
// ============================================================================

export const skillCategories = pgTable(
  'skill_categories',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    /** 0–100 */
    proficiency: integer('proficiency').notNull(),
    /** #rrggbb */
    color: text('color').notNull(),
    skills: text('skills').array().notNull().default([]),
    published: boolean('published').default(true).notNull(),
    position: integer('position').default(0).notNull(),
    ...timestamps,
  },
  (table) => [index('skills_published_position_idx').on(table.published, table.position)]
)

// ============================================================================
// Timeline — work, education and achievements
// ============================================================================

export const timelineItems = pgTable(
  'timeline_items',
  {
    id: text('id').primaryKey(),
    /** 'work' | 'education' | 'achievement' */
    type: text('type').notNull(),
    title: text('title').notNull(),
    organization: text('organization').notNull(),
    location: text('location').notNull(),
    /** YYYY-MM, kept as text to match the existing data and avoid timezone
        rounding — see the formatDate note in TimelineSection. */
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    description: text('description').array().default([]),
    technologies: text('technologies').array().default([]),
    icon: text('icon'),
    published: boolean('published').default(true).notNull(),
    position: integer('position').default(0).notNull(),
    ...timestamps,
  },
  (table) => [
    index('timeline_published_position_idx').on(table.published, table.position),
    index('timeline_type_idx').on(table.type),
  ]
)

export type ProjectRow = typeof projects.$inferSelect
export type SkillCategoryRow = typeof skillCategories.$inferSelect
export type TimelineItemRow = typeof timelineItems.$inferSelect
