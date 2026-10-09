import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { applyImport, exerciseContext, exportAndDownload, readAll } from '../db/dataIo'
import { getSetting, setSetting } from '../db/settings'
import { diffDaysText } from '../lib/agoText'
import { todayLocal } from '../lib/date'
import { MAX_IMPORT_BYTES } from '../lib/download'
import {
  computeImport,
  DEFAULT_REMINDER_WEEKS,
  parseExportText,
  REMINDER_WEEK_OPTIONS,
  type ImportIssue,
  type ImportMode,
  type ImportSummary,
  type ParsedExport,
} from '../lib/exportFormat'
import ConfirmDeleteButton from './ConfirmDeleteButton'
import ImportIssues from './ImportIssues'

const sectionTitle = 'font-display text-2xl font-extrabold tracking-wide text-ink uppercase'
const button = 'min-h-11 rounded-lg px-4 font-semibold'

interface Chosen {
  name: string
  data: ParsedExport
  issues: ImportIssue[]
  droppedSets: number
}

interface Done {
  summary: ImportSummary
  issues: ImportIssue[]
}

const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

/** Réglages > Données : export, import (fusion ou remplacement) et rappel d'export. */
export default function DataPanel() {
  const { t } = useTranslation()
  const lastExportAt = useLiveQuery(async () => (await getSetting<string>('lastExportAt')) ?? null)
  const weeks = useLiveQuery(async () => (await getSetting<number>('exportReminderWeeks')) ?? DEFAULT_REMINDER_WEEKS)

  const [exported, setExported] = useState<string | null>(null)
  const [chosen, setChosen] = useState<Chosen | null>(null)
  const [mode, setMode] = useState<ImportMode>('merge')
  const [done, setDone] = useState<Done | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const exportNow = async () => {
    setError(null)
    try {
      setExported(await exportAndDownload())
    } catch (e) {
      console.error(e)
      setError(t('data.error.exportFailed', { message: message(e) }))
    }
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de rechoisir le même fichier
    setChosen(null)
    setDone(null)
    setError(null)
    if (!file) return
    if (file.size > MAX_IMPORT_BYTES) return setError(t('data.error.tooLarge'))
    try {
      const result = parseExportText(await file.text(), await exerciseContext())
      if (!result.ok) return setError(t(`data.error.${result.error}`))
      setChosen({ name: file.name, data: result.data, issues: result.issues, droppedSets: result.droppedSets })
    } catch (err) {
      console.error(err)
      setError(t('data.error.readFailed'))
    }
  }

  const runImport = async () => {
    if (!chosen) return
    setBusy(true)
    setError(null)
    try {
      const plan = computeImport(await readAll(), chosen.data, mode)
      await applyImport(plan)
      setDone({ summary: plan.summary, issues: [...chosen.issues, ...plan.issues] })
      setChosen(null)
    } catch (err) {
      console.error(err)
      setError(t('data.error.importFailed', { message: message(err) }))
    } finally {
      setBusy(false)
    }
  }

  const today = todayLocal()
  const { data } = chosen ?? {}

  return (
    <div>
      <section>
        <h2 className={sectionTitle}>{t('data.exportTitle')}</h2>
        <p className="mt-2 text-sm text-ink2">{t('data.exportHelp')}</p>
        <button type="button" onClick={() => void exportNow()} className={`${button} mt-3 bg-accent text-accent-ink`}>
          {t('data.exportButton')}
        </button>
        <p className="mt-2 text-sm text-muted" role="status">
          {exported
            ? t('data.exportDone', { name: exported })
            : lastExportAt === undefined
              ? ''
              : lastExportAt
                ? t('data.lastExport', { when: diffDaysText(lastExportAt, today, t) })
                : t('data.neverExported')}
        </p>

        <label className="mt-4 block text-sm font-semibold text-ink2">
          {t('data.reminderLabel')}
          <select
            className="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base font-normal text-ink"
            value={weeks ?? DEFAULT_REMINDER_WEEKS}
            onChange={(e) => void setSetting('exportReminderWeeks', Number(e.target.value))}
          >
            {REMINDER_WEEK_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w === 0 ? t('data.reminderOff') : t('data.reminderEvery', { count: w })}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-1 text-sm text-muted">{t('data.reminderHelp')}</p>
      </section>

      <section className="mt-10">
        <h2 className={sectionTitle}>{t('data.importTitle')}</h2>
        <p className="mt-2 text-sm text-ink2">{t('data.importHelp')}</p>

        <label className={`${button} mt-3 inline-flex cursor-pointer items-center border border-accent text-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent`}>
          {t('data.importFile')}
          <input type="file" accept=".json,application/json" onChange={(e) => void onFile(e)} className="sr-only" />
        </label>

        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-danger p-3 text-sm text-danger">
            {error}
          </p>
        )}

        {chosen && data && (
          <div className="mt-4 rounded-xl border border-line bg-surface p-4">
            <p className="font-semibold text-ink">{t('data.fileChosen', { name: chosen.name })}</p>
            <ul className="mt-1 text-sm text-ink2">
              <li>{t('data.countSessions', { n: data.sessions.length })}</li>
              <li>{t('data.countWeights', { n: data.bodyWeights.length })}</li>
              <li>{t('data.countExercises', { n: data.exercises.length })}</li>
              <li>{t('data.countNotes', { n: data.exerciseNotes.length })}</li>
            </ul>
            <ImportIssues issues={chosen.issues} droppedSets={chosen.droppedSets} />

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink2">{t('data.mode')}</legend>
              {(['merge', 'replace'] as const).map((m) => (
                <label key={m} className="mt-2 flex cursor-pointer items-start gap-3">
                  <input type="radio" name="import-mode" checked={mode === m} onChange={() => setMode(m)} className="mt-1 size-5 accent-[var(--accent)]" />
                  <span>
                    <span className="block font-semibold text-ink">{t(m === 'merge' ? 'data.modeMerge' : 'data.modeReplace')}</span>
                    <span className="block text-sm text-ink2">{t(m === 'merge' ? 'data.modeMergeHelp' : 'data.modeReplaceHelp')}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mt-4">
              {mode === 'merge' ? (
                <button type="button" disabled={busy} onClick={() => void runImport()} className={`${button} bg-accent text-accent-ink disabled:opacity-50`}>
                  {t('data.importButton')}
                </button>
              ) : (
                <ConfirmDeleteButton
                  ariaLabel={t('data.replaceButton')}
                  label={t('data.replaceButton')}
                  confirmLabel={t('data.replaceConfirm')}
                  onConfirm={() => void runImport()}
                />
              )}
            </div>
          </div>
        )}

        {done && (
          <div className="mt-4 rounded-xl border border-accent bg-accent/10 p-4" role="status">
            <p className="font-semibold text-ink">{t('data.done')}</p>
            <ul className="mt-1 text-sm text-ink2">
              <li>{t('data.resultSessions', { ...done.summary.sessions })}</li>
              <li>{t('data.resultWeights', { ...done.summary.bodyWeights })}</li>
              <li>{t('data.resultExercises', { ...done.summary.exercises })}</li>
              <li>{t('data.resultNotes', { n: done.summary.notes })}</li>
            </ul>
            <ImportIssues issues={done.issues} />
          </div>
        )}
      </section>
    </div>
  )
}
