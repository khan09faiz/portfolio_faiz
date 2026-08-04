import { getContentSource, getTimeline } from '@/lib/content'
import { ContentTable, Pill } from '../_components/ContentTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Timeline' }

export default async function AdminTimeline() {
  const timeline = await getTimeline()
  const editable = getContentSource() === 'database'

  return (
    <ContentTable
      title="Timeline"
      description="Work, education and achievements. Achievements also feed the certificates view."
      count={timeline.length}
      headers={['Title', 'Organisation', 'Type', 'Period']}
      editable={editable}
    >
      {timeline.map((t) => (
        <tr key={t.id} className="align-top">
          <td className="px-4 py-3">
            <div className="font-medium">{t.title}</div>
            <div className="mt-0.5 text-xs text-muted">{t.location}</div>
          </td>
          <td className="px-4 py-3 text-sm">{t.organization}</td>
          <td className="px-4 py-3">
            <Pill tone={t.type === 'work' ? 'red' : 'ink'}>{t.type}</Pill>
          </td>
          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
            {t.startDate} — {t.endDate ?? 'present'}
          </td>
        </tr>
      ))}
    </ContentTable>
  )
}
