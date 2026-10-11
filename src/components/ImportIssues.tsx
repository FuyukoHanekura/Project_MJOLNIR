import { useTranslation } from 'react-i18next'
import type { ImportIssue } from '../lib/exportFormat'

const MAX_SHOWN = 10

interface Props {
  issues: readonly ImportIssue[]
  /** Invalid sets skipped in imported sessions. */
  droppedSets?: number
}

/** Items skipped on import, with their position in the file and the reason. */
export default function ImportIssues({ issues, droppedSets = 0 }: Props) {
  const { t } = useTranslation()
  if (issues.length === 0 && droppedSets === 0) return null
  return (
    <div className="mt-3 rounded-lg border border-line bg-surface p-3 text-sm text-ink2">
      {issues.length > 0 && (
        <>
          <p className="font-semibold text-ink">{t('data.issuesTitle', { count: issues.length })}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {issues.slice(0, MAX_SHOWN).map((i) => (
              <li key={`${i.kind}-${i.index}`}>
                {t('data.issue', {
                  kind: t(`data.kind.${i.kind}`),
                  index: i.index,
                  label: i.label ? ` (${i.label})` : '',
                  reason: t(`data.reason.${i.reason}`),
                })}
              </li>
            ))}
          </ul>
          {issues.length > MAX_SHOWN && <p className="mt-1 text-muted">{t('data.moreIssues', { count: issues.length - MAX_SHOWN })}</p>}
        </>
      )}
      {droppedSets > 0 && <p className="mt-1">{t('data.droppedSets', { count: droppedSets })}</p>}
    </div>
  )
}
