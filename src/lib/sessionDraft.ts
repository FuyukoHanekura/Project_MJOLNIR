import type { Session } from '../types'
import { newId, normalizeSet, parseNumberInput } from './sessions'

/** Editing draft: numeric fields stay text while the user is typing. */
export interface DraftSet {
  key: string
  reps: string
  weight: string
  /** '' = no RPE */
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

/** `decimalSeparator`: the separator shown in the fields (comma in French). */
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
 * Draft → stored session. Incomplete or invalid sets (empty reps or < 1,
 * unreadable weight) are not saved. An empty weight counts as 0 (bodyweight).
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
