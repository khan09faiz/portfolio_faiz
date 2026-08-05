import { getContentSource, getProjects } from '@/lib/content'
import { ContentTable, Pill } from '../_components/ContentTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Projects' }

export default async function AdminProjects() {
  const projects = await getProjects()
  const editable = getContentSource() === 'database'

  return (
    <ContentTable
      title="Projects"
      description="Shown in the Featured Projects section, featured first then newest."
      count={projects.length}
      headers={['Title', 'Category', 'Date', 'Tech', 'Flags']}
      editable={editable}
    >
      {projects.map((p) => (
        <tr key={p.id} className="align-top">
          <td className="px-4 py-3">
            <div className="font-medium">{p.title}</div>
            <div className="mt-0.5 line-clamp-1 text-xs text-muted">{p.description}</div>
          </td>
          <td className="px-4 py-3">
            <Pill tone={p.category === 'AI/ML' ? 'red' : 'ink'}>{p.category}</Pill>
          </td>
          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">{p.date}</td>
          <td className="px-4 py-3 text-xs text-muted">
            {p.technologies.slice(0, 3).join(', ')}
            {p.technologies.length > 3 && ` +${p.technologies.length - 3}`}
          </td>
          <td className="px-4 py-3">{p.featured && <Pill tone="red">featured</Pill>}</td>
        </tr>
      ))}
    </ContentTable>
  )
}
