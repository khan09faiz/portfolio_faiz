/**
 * Content Validation Schemas
 *
 * Runtime shape contracts for everything under src/data. These exist so that a
 * malformed content file fails a build gate instead of rendering a broken
 * section in production.
 *
 * IMPORTANT: this module is deliberately NOT re-exported from lib/content/index.ts.
 * Importing it pulls Zod into whatever bundle references it, and the section
 * components are client components. Validation runs from scripts/validate-content.ts
 * only, so the browser bundle stays unchanged.
 *
 * lib/types.ts remains the type source of truth. The assertions at the bottom of
 * this file fail the TypeScript build if a schema here drifts away from it.
 */

import { z } from 'zod'
import type { Project, SkillCategory, TimelineItem } from '../types'

// ============================================================================
// Primitives
// ============================================================================

/** ISO calendar date, e.g. 2025-09-01 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

/** Year-month, e.g. 2025-06 */
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'Expected YYYY-MM')

/** Six-digit hex colour, e.g. #3b82f6 */
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected a #rrggbb hex colour')

const nonEmpty = z.string().min(1)

// ============================================================================
// Projects
// ============================================================================

export const projectSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  description: nonEmpty,
  longDescription: z.string().optional(),
  category: z.enum(['AI/ML', 'Frontend', 'Backend', 'Full-Stack']),
  featured: z.boolean(),
  technologies: z.array(nonEmpty),
  links: z
    .object({
      github: z.string().optional(),
      live: z.string().optional(),
    })
    .optional(),
  date: isoDate,
  images: z.array(z.string()).optional(),
  keyFeatures: z.array(nonEmpty).optional(),
  impact: z
    .array(
      z.object({
        label: nonEmpty,
        value: nonEmpty,
      })
    )
    .optional(),
})

export const projectsSchema = z.array(projectSchema)

// ============================================================================
// Skills
// ============================================================================

export const skillCategorySchema = z.object({
  category: nonEmpty,
  proficiency: z.number().min(0).max(100),
  color: hexColor,
  skills: z.array(nonEmpty).min(1),
})

export const skillsSchema = z.array(skillCategorySchema)

// ============================================================================
// Timeline
// ============================================================================

export const timelineItemSchema = z.object({
  id: nonEmpty,
  type: z.enum(['work', 'education', 'achievement']),
  title: nonEmpty,
  organization: nonEmpty,
  location: nonEmpty,
  startDate: yearMonth,
  endDate: yearMonth.optional(),
  description: z.array(nonEmpty).optional(),
  technologies: z.array(nonEmpty).optional(),
  icon: z.string().optional(),
})

export const timelineSchema = z.array(timelineItemSchema)

// ============================================================================
// Drift guards
// ============================================================================
// If a schema above stops matching its hand-written interface in lib/types.ts,
// the corresponding alias resolves to Assert<false> and the build fails here
// rather than silently at a call site.

type Assert<T extends true> = T
type Extends<A, B> = A extends B ? true : false

export type ProjectSchemaMatchesType = Assert<Extends<z.infer<typeof projectSchema>, Project>>
export type SkillSchemaMatchesType = Assert<
  Extends<z.infer<typeof skillCategorySchema>, SkillCategory>
>
export type TimelineSchemaMatchesType = Assert<
  Extends<z.infer<typeof timelineItemSchema>, TimelineItem>
>
