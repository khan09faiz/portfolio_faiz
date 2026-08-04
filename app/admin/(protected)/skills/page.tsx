import { getContentSource, getSkills } from '@/lib/content'
import { ContentTable } from '../_components/ContentTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Skills' }

export default async function AdminSkills() {
  const skills = await getSkills()
  const editable = getContentSource() === 'database'

  return (
    <ContentTable
      title="Skill categories"
      description="Drives the 3D skills globe and its legend."
      count={skills.length}
      headers={['Category', 'Colour', 'Proficiency', 'Skills']}
      editable={editable}
    >
      {skills.map((s) => (
        <tr key={s.category} className="align-top">
          <td className="px-4 py-3 font-medium">{s.category}</td>
          <td className="px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-xs text-muted">
              <span
                className="inline-block h-3.5 w-3.5 rounded-sm border border-accent/40"
                style={{ backgroundColor: s.color }}
              />
              {s.color}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-sumi/10">
                <div
                  className="h-full rounded-full bg-crimson"
                  style={{ width: `${s.proficiency}%` }}
                />
              </div>
              <span className="font-mono text-xs text-muted">{s.proficiency}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-xs text-muted">{s.skills.join(', ')}</td>
        </tr>
      ))}
    </ContentTable>
  )
}
