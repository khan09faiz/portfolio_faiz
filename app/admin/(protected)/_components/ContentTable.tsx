/**
 * Shared table shell for the admin list views.
 *
 * Read-only for now, deliberately. Editing lands in the next phase, once there
 * is a database to write to — an edit form wired to the JSON fallback would
 * appear to save and then silently lose the change on the next deploy, which is
 * worse than having no form at all.
 */

import type { ReactNode } from 'react'

export function ContentTable({
  title,
  description,
  count,
  headers,
  children,
  editable,
}: {
  title: string
  description: string
  count: number
  headers: string[]
  children: ReactNode
  /** False when the backing store is JSON, which cannot be written to. */
  editable: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <span className="font-mono text-sm text-muted">{count}</span>
      </div>
      <p className="mb-6 text-sm text-muted">{description}</p>

      {!editable && (
        <p className="mb-6 rounded-lg border border-crimson/30 bg-crimson/[0.06] px-4 py-3 text-sm text-muted">
          Read-only — no <code className="font-mono text-xs">DATABASE_URL</code> is configured, so
          this is the bundled JSON. Editing appears once a database is connected.
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-accent/40 bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-accent/40 text-xs uppercase tracking-wide text-muted">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/25">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Pill({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'red' }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs ${
        tone === 'red' ? 'bg-crimson/12 text-crimson' : 'bg-sumi/10 text-sumi'
      }`}
    >
      {children}
    </span>
  )
}
