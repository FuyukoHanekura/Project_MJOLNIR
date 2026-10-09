import type { Session } from '../types'
import { newId, normalizeSet, parseNumberInput } from './sessions'

/** Brouillon d'édition : les champs numériques restent du texte tant que l'utilisateur tape. */
export interface DraftSet {
  key: string
  reps: string
  weight: string
  /** '' = pas de RPE */
  rpe: string
}

export interface DraftEntry {
  key: string
  exerciseId: string
  sets: DraftSet[]
}

export interface SessionDraft {
  name: string
  date: string
  notes: string
  entries: DraftEntry[]
}

export function emptyDraftSet(): DraftSet {
  return { key: newId(), reps: '', weight: '', rpe: '' }
}

/** `decimalSeparator` : le séparateur affiché dans les champs (virgule en français). */
export function toDraft(session: Session, decimalSeparator: '.' | ',' = '.'): SessionDraft {
  const numToText = (n: number) => String(n).replace('.', decimalSeparator)
  return {
    name: session.name,
    date: session.date,
    notes: session.notes ?? '',
    entries: session.entries.map((e) => ({
      key: newId(),
      exerciseId: e.exerciseId,
      sets: e.sets.map((s) => ({
        key: newId(),
        reps: numToText(s.reps),
        weight: numToText(s.weight),
        rpe: s.rpe === undefined ? '' : numToText(s.rpe),
      })),
    })),
  }
}

/**
 * Brouillon → séance stockée. Les séries incomplètes ou invalides (reps vides ou < 1,
 * poids illisible) ne sont pas enregistrées. Un poids vide compte pour 0 (poids du corps).
 */
export function toSession(id: string, draft: SessionDraft): Session {
  const session: Session = {
    id,
    date: draft.date,
    name: draft.name.trim(),
    entries: draft.entries.map((e) => ({
      exerciseId: e.exerciseId,
      sets: e.sets.flatMap((s) => {
        const weight = s.weight.trim() === '' ? 0 : parseNumberInput(s.weight)
        const rpe = s.rpe === '' ? undefined : Number(s.rpe)
        const set = normalizeSet({ reps: parseNumberInput(s.reps), weight, rpe })
        return set ? [set] : []
      }),
    })),
  }
  const notes = draft.notes.trim()
  if (notes) session.notes = notes
  return session
}
