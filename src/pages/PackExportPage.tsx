import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { db } from '../db/db'
import { buildExercisePack, packFileName } from '../lib/exercisePack'
import { downloadJson } from '../lib/download'
import { sortExercises } from '../lib/exercises'
import { useNames } from '../lib/useNames'

const fieldClass = 'mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink'

/** Exports a selection of custom exercises as a shareable pack (personal notes excluded). */
export default function PackExportPage() {
  const { t } = useTranslation()
  const names = useNames()
  const all = useLiveQuery(() => db.exercises.toArray())
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set())
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [done, setDone] = useState<string | null>(null)

  const custom = useMemo(() => (all ? sortExercises(all.filter((e) => e.isCustom), names.lang) : []), [all, names.lang])
  const selected = custom.filter((e) => picked.has(e.id))
  const canExport = selected.length > 0 && name.trim() !== ''

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const exportPack = () => {
    if (!all || !canExport) return
    const seedIds = new Set(all.filter((e) => !e.isCustom).map((e) => e.id))
    const pack = buildExercisePack(selected, { name, description }, seedIds)
    const file = packFileName(pack.name)
    downloadJson(file, pack)
    setDone(file)
  }

  return (
    <section>
      <Link to="/exercices" className="inline-flex min-h-11 items-center font-semibold text-accent">
        ← {t('pack.back')}
      </Link>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('pack.title')}</h1>
      <p className="mt-2 text-ink2">{t('pack.help')}</p>

      {all && custom.length === 0 && <p className="mt-4 text-ink2">{t('pack.empty')}</p>}

      {custom.length > 0 && (
        <>
          <label className="mt-4 block font-semibold text-ink">
            {t('pack.name')}
            <input type="text" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} className={fieldClass} />
          </label>
          <label className="mt-3 block font-semibold text-ink">
            {t('pack.description')}
            <textarea value={description} maxLength={500} rows={2} onChange={(e) => setDescription(e.target.value)} className={`${fieldClass} py-2`} />
          </label>

          <fieldset className="mt-4">
            <legend className="font-semibold text-ink">{t('pack.selection')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setPicked(new Set(custom.map((e) => e.id)))} className="min-h-11 rounded-lg border border-line bg-surface px-4 font-semibold text-accent">
                {t('pack.all')}
              </button>
              <button type="button" onClick={() => setPicked(new Set())} className="min-h-11 rounded-lg border border-line bg-surface px-4 font-semibold text-accent">
                {t('pack.none')}
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {custom.map((e) => (
                <li key={e.id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface px-3 text-ink">
                    <input type="checkbox" checked={picked.has(e.id)} onChange={() => toggle(e.id)} className="size-5 accent-[var(--accent)]" />
                    {names.exercise(e)}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <p className="mt-3 text-sm text-muted" role="status" aria-live="polite">
            {t('pack.selected', { count: selected.length })}
          </p>
          <button
            type="button"
            disabled={!canExport}
            onClick={exportPack}
            className="mt-3 min-h-11 rounded-lg bg-brand px-4 font-semibold text-brand-ink disabled:opacity-50"
          >
            {t('pack.export')}
          </button>
          {done && (
            <p className="mt-3 rounded-lg border border-accent bg-accent/10 p-3 text-sm text-ink" role="status">
              {t('pack.done', { file: done })}
            </p>
          )}
        </>
      )}
    </section>
  )
}
