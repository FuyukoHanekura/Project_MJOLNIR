import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BilingualName from '../components/BilingualName'
import ConfirmDeleteButton from '../components/ConfirmDeleteButton'
import ExerciseLink from '../components/ExerciseLink'
import ExerciseProgress from '../components/ExerciseProgress'
import Silhouette from '../components/Silhouette'
import { MUSCLE_BY_ID } from '../data/muscles'
import { db } from '../db/db'
import { useNames } from '../lib/useNames'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { exerciseHistory, formatSets } from '../lib/sessions'
import type { Exercise } from '../types'

/** N'affiche un lien que pour http(s) : jamais de javascript: venant d'un import. */
const isHttpUrl = (url: string) => /^https?:\/\//i.test(url)

const sectionTitle ='font-display text-2xl font-extrabold tracking-wide text-ink uppercase'

/** Liste d'exercices liés (alternatives, antagonistes, complémentaires), cliquables. */
function RelatedList({ title, ids }: { title: string; ids: string[] }) {
  const related = useLiveQuery(() => db.exercises.bulkGet(ids), [ids.join(',')])
  const found = (related ?? []).filter((e): e is Exercise => Boolean(e))
  if (!found.length) return null
  return (
    <section className="mt-8">
      <h2 className={sectionTitle}>{title}</h2>
      <ul className="mt-3 space-y-2">
        {found.map((e) => (
          <li key={e.id}>
            <ExerciseLink exercise={e} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function MuscleList({ title, ids }: { title: string; ids: string[] }) {
  const { t } = useTranslation()
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink2">{title}</h3>
      {ids.length === 0 ? (
        <p className="mt-1 text-muted">{t('detail.none')}</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {ids.map((id) => {
            const m = MUSCLE_BY_ID.get(id)
            return (
              <li key={id}>
                {m ? <BilingualName name={m.name} nameEn={m.nameEn} mainClassName="text-base text-ink" /> : id}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** Dernières performances de l'utilisateur sur cet exercice. */
function History({ exerciseId }: { exerciseId: string }) {
  const { t, i18n } = useTranslation()
  const sessions = useLiveQuery(() => db.sessions.toArray())
  if (!sessions) return null
  const fmt = numberFormatter(i18n.language)
  const history = exerciseHistory(sessions, exerciseId).slice(0, 10)
  return (
    <section className="mt-8">
      <h2 className={sectionTitle}>{t('detail.history')}</h2>
      {history.length === 0 ? (
        <p className="mt-2 text-muted">{t('detail.historyEmpty')}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {history.map((p) => (
            <li key={p.sessionId}>
              <Link
                to={`/seances/${p.sessionId}`}
                aria-label={`${t('detail.historyLink')} : ${formatLocalDate(p.date, i18n.language)}`}
                className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 rounded-xl border border-line bg-surface px-4 py-2 hover:border-accent"
              >
                <span className="text-sm text-muted">{formatLocalDate(p.date, i18n.language)}</span>
                <span className="font-semibold text-ink">{formatSets(p.sets, fmt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Records et courbes de l'exercice, affichés seulement une fois qu'il a été pratiqué. */
function Progress({ exerciseId }: { exerciseId: string }) {
  const sessions = useLiveQuery(() => db.sessions.toArray())
  if (!sessions || exerciseHistory(sessions, exerciseId).length === 0) return null
  return (
    <div className="mt-8">
      <ExerciseProgress exerciseId={exerciseId} sessions={sessions} />
    </div>
  )
}

/** Modifier ou supprimer un exercice personnalisé (la base de départ n'est pas modifiable). */
function CustomActions({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation()
  const names = useNames()
  const navigate = useNavigate()
  const usedIn = useLiveQuery(
    async () => (await db.sessions.toArray()).filter((s) => s.entries.some((e) => e.exerciseId === exercise.id)).length,
    [exercise.id],
  )
  return (
    <section className="mt-10 border-t border-line pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to={`/exercices/${exercise.id}/modifier`} className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 font-semibold text-accent">
          {t('detail.edit')}
        </Link>
        <ConfirmDeleteButton
          label={t('detail.deleteExercise')}
          ariaLabel={t('detail.deleteExerciseAria', { name: names.exercise(exercise) })}
          onConfirm={() => void db.exercises.delete(exercise.id).then(() => navigate('/exercices', { replace: true }))}
        />
      </div>
      {usedIn !== undefined && usedIn > 0 && <p className="mt-2 text-sm text-muted">{t('detail.usedIn', { count: usedIn })}</p>}
    </section>
  )
}

function Notes({ exercise }: { exercise: Exercise }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(exercise.notes ?? '')


  const save = () => {
    const notes = value.trim() || undefined
    if (notes !== exercise.notes) void db.exercises.update(exercise.id, { notes })
  }

  return (
    <section className="mt-8">
      <h2 className={sectionTitle}>
        <label htmlFor="exercise-notes">{t('detail.notes')}</label>
      </h2>
      <textarea
        id="exercise-notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        placeholder={t('detail.notesPlaceholder')}
        rows={4}
        className="mt-3 w-full rounded-lg border border-line bg-surface p-3 text-base text-ink"
      />
    </section>
  )
}

export default function ExerciseDetailPage() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  // null = introuvable, undefined = chargement
  const exercise = useLiveQuery(async () => (await db.exercises.get(id)) ?? null, [id])

  const back = (
    <Link to="/exercices" className="inline-flex min-h-11 items-center font-semibold text-accent">
      ← {t('detail.backToList')}
    </Link>
  )

  if (exercise === undefined) return <p className="text-muted">{t('common.loading')}</p>
  if (exercise === null) {
    return (
      <section>
        {back}
        <p className="mt-2 text-ink2">{t('detail.notFound')}</p>
      </section>
    )
  }

  const instructions = i18n.language === 'en' ? exercise.instructionsEn : exercise.instructions

  return (
    <article>
      {back}
      <h1 className="mt-2">
        <BilingualName
          name={exercise.name}
          nameEn={exercise.nameEn}
          mainClassName="font-display text-4xl leading-tight font-extrabold tracking-wide text-ink uppercase"
        />
      </h1>
      <p className="mt-2 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">{t(`groups.${exercise.group}`)}</span>
        <span className="rounded-full border border-line px-3 py-1 text-ink2">{t(`equipment.${exercise.equipmentType}`)}</span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Silhouette view="front" primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} />
        <Silhouette view="back" primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MuscleList title={t('detail.primary')} ids={exercise.primaryMuscles} />
        <MuscleList title={t('detail.secondary')} ids={exercise.secondaryMuscles} />
      </div>

      {exercise.machineType && (
        <section className="mt-8">
          <h2 className={sectionTitle}>{t('detail.machine')}</h2>
          <p className="mt-2">
            <BilingualName name={exercise.machineType} nameEn={exercise.machineTypeEn} mainClassName="text-base text-ink" />
          </p>
        </section>
      )}

      {instructions && (
        <section className="mt-8">
          <h2 className={sectionTitle}>{t('detail.instructions')}</h2>
          <p className="mt-2 text-ink2">{instructions}</p>
        </section>
      )}

      {exercise.videoUrl && isHttpUrl(exercise.videoUrl) && (
        <p className="mt-6">
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-semibold text-accent underline"
          >
            {t('detail.video')}
          </a>
        </p>
      )}

      <History exerciseId={exercise.id} />
      <Progress exerciseId={exercise.id} />

      <Notes key={exercise.id} exercise={exercise} />

      <RelatedList title={t('detail.alternatives')} ids={exercise.alternatives} />
      <RelatedList title={t('detail.antagonists')} ids={exercise.antagonists} />
      <RelatedList title={t('detail.complements')} ids={exercise.complements} />

      {exercise.isCustom && <CustomActions exercise={exercise} />}
    </article>
  )
}
