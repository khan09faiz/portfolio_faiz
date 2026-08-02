/**
 * Content Provider
 *
 * The single read path for portfolio content. Section components must go
 * through these accessors rather than importing src/data/*.json directly, so
 * that swapping the backing store for a headless CMS touches this file alone.
 *
 * Phase 1 keeps the existing JSON files as the backing store — this layer is
 * pure indirection and changes no rendered output.
 *
 * Accessors are synchronous on purpose. Every consumer is currently a client
 * component; going async here would force a server-component conversion or a
 * React Query provider, which belongs to a later phase. When a real datastore
 * lands, these become async and the components migrate with it.
 */

import type { Project, SkillCategory, TimelineItem } from '@/lib/types'
import projectsRaw from '@/src/data/projects.json'
import skillsRaw from '@/src/data/skills.json'
import timelineRaw from '@/src/data/timeline.json'

// Shapes are enforced by `npm run validate:content` against lib/content/schemas.ts.
const projects = projectsRaw as Project[]
const skills = skillsRaw as SkillCategory[]
const timeline = timelineRaw as TimelineItem[]

/** All projects, in file order. Callers apply their own filtering and sorting. */
export function getProjects(): Project[] {
  return projects
}

/** All skill categories, in file order. */
export function getSkills(): SkillCategory[] {
  return skills
}

/** Every timeline entry — work, education and achievements combined. */
export function getTimeline(): TimelineItem[] {
  return timeline
}

/**
 * Achievement-type timeline entries, most recent first.
 * Centralises the "an achievement is a certificate" rule that was previously
 * inlined in CertificatesSection.
 */
export function getCertificates(): TimelineItem[] {
  return timeline
    .filter((item) => item.type === 'achievement')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}
