import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExerciseMultiPicker from '../components/ExerciseMultiPicker'
import MusclePicker from '../components/MusclePicker'
import { exerciseContext } from '../db/dataIo'
import { db } from '../db/db'
import { parseExercise } from '../lib/exportFormat'
import { EQUIPMENT_TYPES, GROUPS } from '../lib/exercises'
import type { Exercise } from '../types'

const input = 'mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base font-normal text-ink'
const sectionTitle = 'font-display text-2xl font-extrabold tracking-wide text-ink uppercase'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-ink2">
      {label}
      {children}
    </label>
  )
}

interface FormProps {
  /** Exercice à modifier ; absent pour une création. */
  exercise?: Exercise
  allExercises: readonly Exercise[]
}

function ExerciseForm({ exercise, allExercises }: FormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState(exercise?.name ?? '')
  const [nameEn, setNameEn] = useState(exercise && exercise.nameEn !== exercise.name ? exercise.nameEn : '')
  const [group, setGroup] = useState<string>(exercise?.group ?? '')
  const [equipment, setEquipment] = useState<string>(exercise?.equipmentType ?? '')
  const [machine, setMachine] = useState(exercise?.machineType ?? '')
  const [machineEn, setMachineEn] = useState(exercise && exercise.machineTypeEn !== exercise.machineType ? (exercise.machineTypeEn ?? '') : '')
  const [primary, setPrimary] = useState<string[]>(exercise?.primaryMuscles ?? [])
  const [secondary, setSecondary] = useState<string[]>(exercise?.secondaryMuscles ?? [])
  const [alternatives, setAlternatives] = useState<string[]>(exercise?.alternatives ?? [])
  const [antagonists, setAntagonists] = useState<string[]>(exercise?.antagonists ?? [])
  const [complements, setComplements] = useState<string[]>(exercise?.complements ?? [])
  const [instructions, setInstructions] = useState(exercise?.instructions ?? '')
  const [instructionsEn, setInstructionsEn] = useState(exercise && exercise.instructionsEn !== exercise.instructions ? exercise.instructionsEn : '')
  const [videoUrl, setVideoUrl] = useState(exercise?.videoUrl ?? '')
  const [errors, setErrors] = useState<string[]>([])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const video = videoUrl.trim()
    if (video && !/^https?:\/\/\S+$/i.test(video)) return setErrors([t('customExercise.error.badVideo')])

    const result = parseExercise(
      {
        id: exercise?.id,
        name,
        nameEn,
        group,
        equipmentType: equipment,
        machineType: machine,
        machineTypeEn: machineEn,
        movementPattern: exercise?.movementPattern,
        primaryMuscles: primary,
        secondaryMuscles: secondary,
        alternatives,
        antagonists,
        complements,
        instructions,
        instructionsEn,
        videoUrl: video,
        notes: exercise?.notes,
      },
      await exerciseContext(),
    )
    if (!result.ok) return setErrors([t(`customExercise.error.${result.reason}`)])

    try {
      await db.exercises.put(result.exercise)
      navigate(`/exercices/${result.exercise.id}`)
    } catch (err) {
      console.error(err)
      setErrors([t('customExercise.error.saveFailed', { message: err instanceof Error ? err.message : String(err) })])
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="space-y-5">
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg border border-danger p-3 text-sm text-danger">
          <p className="font-semibold">{t('customExercise.errorsTitle')}</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <Field label={t('customExercise.name')}>
        <input className={input} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label={t('customExercise.nameEn')}>
        <input className={input} value={nameEn} maxLength={80} onChange={(e) => setNameEn(e.target.value)} lang="en" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('customExercise.group')}>
          <select className={input} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="" />
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {t(`groups.${g}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('customExercise.equipment')}>
          <select className={input} value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            <option value="" />
            {EQUIPMENT_TYPES.map((q) => (
              <option key={q} value={q}>
                {t(`equipment.${q}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('customExercise.machine')}>
          <input className={input} value={machine} maxLength={120} onChange={(e) => setMachine(e.target.value)} />
        </Field>
        <Field label={t('customExercise.machineEn')}>
          <input className={input} value={machineEn} maxLength={120} onChange={(e) => setMachineEn(e.target.value)} lang="en" />
        </Field>
      </div>

      <section>
        <h2 className={sectionTitle}>{t('customExercise.muscles')}</h2>
        <div className="mt-3">
          <MusclePicker
            primary={primary}
            secondary={secondary}
            onChange={(p, s) => {
              setPrimary(p)
              setSecondary(s)
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <ExerciseMultiPicker label={t('detail.alternatives')} exercises={allExercises} selected={alternatives} onChange={setAlternatives} excludeId={exercise?.id} />
        <ExerciseMultiPicker label={t('detail.antagonists')} exercises={allExercises} selected={antagonists} onChange={setAntagonists} excludeId={exercise?.id} />
        <ExerciseMultiPicker label={t('detail.complements')} exercises={allExercises} selected={complements} onChange={setComplements} excludeId={exercise?.id} />
      </section>

      <Field label={t('customExercise.instructions')}>
        <textarea className={`${input} p-3`} rows={3} maxLength={1000} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </Field>
      <Field label={t('customExercise.instructionsEn')}>
        <textarea className={`${input} p-3`} rows={3} maxLength={1000} value={instructionsEn} onChange={(e) => setInstructionsEn(e.target.value)} lang="en" />
      </Field>
      <Field label={t('customExercise.video')}>
        <input className={input} type="url" inputMode="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      </Field>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="min-h-11 rounded-lg bg-brand px-6 font-semibold text-brand-ink">
          {t('customExercise.save')}
        </button>
        <Link to={exercise ? `/exercices/${exercise.id}` : '/exercices'} className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-6 font-semibold text-ink2">
          {t('customExercise.cancel')}
        </Link>
      </div>
    </form>
  )
}

/** Création (`/exercices/nouveau`) ou modification (`/exercices/:id/modifier`) d'un exercice personnalisé. */
export default function ExerciseFormPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const all = useLiveQuery(() => db.exercises.toArray())

  const back = (
    <Link to="/exercices" className="inline-flex min-h-11 items-center font-semibold text-accent">
      ← {t('customExercise.back')}
    </Link>
  )

  if (!all) return <p className="text-muted">{t('common.loading')}</p>
  const exercise = id ? all.find((e) => e.id === id) : undefined
  // Seuls les exercices personnalisés se modifient : ceux de la base de départ sont gérés par l'application.
  if (id && (!exercise || !exercise.isCustom)) {
    return (
      <section>
        {back}
        <p className="mt-2 text-ink2">{t('customExercise.notFound')}</p>
      </section>
    )
  }

  return (
    <section>
      {back}
      <h1 className="mt-2 mb-5 font-display text-4xl font-extrabold tracking-wide text-ink uppercase">
        {t(exercise ? 'customExercise.editTitle' : 'customExercise.newTitle')}
      </h1>
      <ExerciseForm key={exercise?.id ?? 'new'} exercise={exercise} allExercises={all} />
    </section>
  )
}
