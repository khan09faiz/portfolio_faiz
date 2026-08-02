/**
 * Content Layer
 * Barrel export for the portfolio content read path.
 *
 * Only the provider is re-exported here. ./schemas is intentionally excluded so
 * that Zod never reaches a client bundle through this entry point.
 */

export {
  getProjects,
  getSkills,
  getTimeline,
  getCertificates,
  getHomeContent,
} from './provider'
