import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ImportIssues from '../components/ImportIssues'
import { applyImport, exerciseContext, readAll } from '../db/dataIo'
import { MAX_IMPORT_BYTES } from '../lib/download'
import { bulkExerciseArray, computeImport, parseExerciseList, type ImportIssue } from '../lib/exportFormat'
import { useNames } from '../lib/useNames'
import type { Exercise } from '../types'

const EXAMPLE = `[
  {
    "name": "Développé nuque",
    "nameEn": "Behind-the-neck press",
    "group": "shoulders",
    "equipmentType": "barbell",
    "primaryMuscles": ["shoulders"],
    "secondaryMuscles": ["triceps", "traps"],
    "instructions": "Descends la barre derrière la tête, sans forcer.",
    "videoUrl": "https://exemple.org/video"
  }
]`

interface Ready {
  fileName: string
  exercises: Exercise[]
  issues: ImportIssue[]
}

const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

/** Bulk import of custom exercises from a JSON file, with a report of skipped lines. */
export default function BulkImportPage() {
  const { t } = useTranslation()
  const names = useNames()
  const [ready, setReady] = useState<Ready | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ added: number; updated: number; issues: ImportIssue[] } | null>(null)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    setReady(null)
    setDone(null)
    setError(null)
    if (!file) return
    if (file.size > MAX_IMPORT_BYTES) return setError(t('data.error.tooLarge'))
    try {
      let raw: unknown
      try {
        raw = JSON.parse(await file.text())
      } catch {
        return setError(t('data.error.notJson'))
      }
      const list = bulkExerciseArray(raw)
      if (!list) return setError(t('bulk.notList'))
      const parsed = parseExerciseList(list, await exerciseContext())
      setReady({ fileName: file.name, exercises: parsed.exercises, issues: parsed.issues })
    } catch (err) {
      console.error(err)
      setError(t('data.error.readFailed'))
    }
  }

  const runImport = async () => {
    if (!ready) return
    try {
      // Same path as the backup import: links to non-existent exercises are removed.
      const plan = computeImport(await readAll(), { sessions: [], bodyWeights: [], exercises: ready.exercises, exerciseNotes: [] }, 'merge')
      await applyImport(plan)
      setDone({ ...plan.summary.exercises, issues: ready.issues })
      setReady(null)
    } catch (err) {
      console.error(err)
      setError(t('data.error.importFailed', { message: message(err) }))
    }
  }

  return (
    <section>
      <Link to="/exercices" className="inline-flex min-h-11 items-center font-semibold text-accent">
        ← {t('bulk.back')}
      </Link>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('bulk.title')}</h1>
      <p className="mt-2 text-ink2">{t('bulk.help')}</p>

      <details className="mt-3 rounded-lg border border-line bg-surface p-3">
        <summary className="min-h-11 cursor-pointer font-semibold text-accent">{t('bulk.formatTitle')}</summary>
        <pre className="mt-2 overflow-x-auto rounded bg-bg p-3 text-xs text-ink" lang="en">
          {EXAMPLE}
        </pre>
        <p className="mt-2 text-sm text-ink2">{t('bulk.formatNote')}</p>
      </details>

      <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-accent px-4 font-semibold text-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
        {t('bulk.file')}
        <input type="file" accept=".json,application/json" onChange={(e) => void onFile(e)} className="sr-only" />
      </label>

      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-danger p-3 text-sm text-danger">
          {error}
        </p>
      )}

      {ready && (
        <div className="mt-4 rounded-xl border border-line bg-surface p-4">
          <p className="font-semibold text-ink">{t('data.fileChosen', { name: ready.fileName })}</p>
          <p className="mt-1 text-sm text-ink2">{ready.exercises.length ? t('bulk.ready', { count: ready.exercises.length }) : t('bulk.none')}</p>
          {ready.exercises.length > 0 && (
            <ul className="mt-2 max-h-48 list-disc space-y-0.5 overflow-y-auto pl-5 text-sm text-ink2">
              {ready.exercises.map((e) => (
                <li key={e.id}>{names.exercise(e)}</li>
              ))}
            </ul>
          )}
          <ImportIssues issues={ready.issues} />
          {ready.exercises.length > 0 && (
            <button type="button" onClick={() => void runImport()} className="mt-4 min-h-11 rounded-lg bg-brand px-4 font-semibold text-brand-ink">
              {t('bulk.import', { count: ready.exercises.length })}
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="mt-4 rounded-xl border border-accent bg-accent/10 p-4" role="status">
          <p className="font-semibold text-ink">{t('data.done')}</p>
          <p className="text-sm text-ink2">{t('bulk.done', { added: done.added, updated: done.updated })}</p>
          <ImportIssues issues={done.issues} />
          <Link to="/exercices" className="mt-2 inline-flex min-h-11 items-center font-semibold text-accent underline">
            {t('bulk.back')}
          </Link>
        </div>
      )}
    </section>
  )
}
