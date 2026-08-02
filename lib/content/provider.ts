/**
 * Content Provider
 *
 * The single read path for portfolio content. Section components must not
 * import src/data/*.json directly — swapping the backing store for a headless
 * CMS should touch this file alone.
 *
 * ASYNC BY CONTRACT. The accessors are async even though the current backing
 * store is a synchronous JSON import, because every realistic replacement — a
 * database, a CMS HTTP API, a cached fetch — is asynchronous. Callers that
 * already `await` today keep working unchanged when that swap happens; making
 * them synchronous now would mean rewriting every call site later.
 *
 * These are called from SERVER components (see app/page.tsx), so the content
 * never enters the client bundle as code and a future datastore credential
 * never reaches the browser.
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
export async function getProjects(): Promise<Project[]> {
  return projects
}

/** All skill categories, in file order. */
export async function getSkills(): Promise<SkillCategory[]> {
  return skills
}

/** Every timeline entry — work, education and achievements combined. */
export async function getTimeline(): Promise<TimelineItem[]> {
  return timeline
}

/**
 * Achievement-type timeline entries, most recent first.
 * Centralises the "an achievement is a certificate" rule rather than leaving it
 * inlined in CertificatesSection.
 */
export async function getCertificates(): Promise<TimelineItem[]> {
  return timeline
    .filter((item) => item.type === 'achievement')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}

/**
 * Everything the home page needs, in one call.
 *
 * A single entry point means the page makes one round trip to whatever backs
 * this later, instead of four sequential ones. Promise.all keeps them parallel.
 */
export async function getHomeContent() {
  const [projects, skills, timeline] = await Promise.all([
    getProjects(),
    getSkills(),
    getTimeline(),
  ])
  return { projects, skills, timeline }
}
