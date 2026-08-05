/**
 * Admin overview.
 *
 * Leads with which backing store is live, because that is the single most
 * confusing thing about this setup: with no DATABASE_URL the site serves the
 * bundled JSON, and edits made here would appear to save and then have no
 * effect. Better to say so plainly at the top of the dashboard than to let
 * someone discover it by losing work.
 */

import Link from 'next/link'
import { Database, FileJson, FolderGit2, GraduationCap, Sparkles } from 'lucide-react'
import { getContentSource, getProjects, getSkills, getTimeline } from '@/lib/content'

// Always reflect the current database state — a cached dashboard defeats the
// purpose of a dashboard.
export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  const source = getContentSource()
  const [projects, skills, timeline] = await Promise.all([
    getProjects(),
    getSkills(),
    getTimeline(),
  ])

  const counts = [
    { label: 'Projects', value: projects.length, href: '/admin/projects', icon: FolderGit2 },
    { label: 'Skill categories', value: skills.length, href: '/admin/skills', icon: Sparkles },
    { label: 'Timeline entries', value: timeline.length, href: '/admin/timeline', icon: GraduationCap },
  ]

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Overview</h1>
      <p className="mb-8 text-sm text-muted">Manage the content the public portfolio renders.</p>

      {/* Backing store */}
      <div
        className={`mb-8 flex items-start gap-3 rounded-xl border p-4 ${
          source === 'database'
            ? 'border-accent/40 bg-card'
            : 'border-crimson/30 bg-crimson/[0.06]'
        }`}
      >
        {source === 'database' ? (
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-sumi" />
        ) : (
          <FileJson className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
        )}
        <div className="text-sm">
          {source === 'database' ? (
            <>
              <p className="font-semibold">Reading from the database</p>
              <p className="mt-1 text-muted">
                Edits here are saved to Postgres and the public pages are revalidated on save.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-crimson">Reading from bundled JSON</p>
              <p className="mt-1 text-muted">
                No <code className="font-mono text-xs">DATABASE_URL</code> is configured, so the
                site is serving <code className="font-mono text-xs">src/data/*.json</code>. Editing
                is disabled — changes would have nowhere to go. Add the connection string and
                redeploy to enable it.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Counts */}
      <div className="grid gap-4 sm:grid-cols-3">
        {counts.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="press-ink group rounded-xl border border-accent/40 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-crimson/45"
          >
            <div className="mb-3 flex items-center justify-between">
              <Icon className="h-5 w-5 text-muted transition-colors group-hover:text-crimson" />
              <span className="text-2xl font-bold">{value}</span>
            </div>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
