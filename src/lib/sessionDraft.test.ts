import { describe, expect, it } from 'vitest'
import type { Session } from '../types'
import { emptyDraftSet, toDraft, toSession, type SessionDraft } from './sessionDraft'

const base: Session = {
  id: 's1',
  date: '2026-05-04',
  name: 'Pull',
  notes: 'bonne séance',
  entries: [{ exerciseId: 'tractions', sets: [{ reps: 8, weight: 0, rpe: 8.5 }, { reps: 6, weight: 10 }] }],
}

describe('toDraft / toSession', () => {
  it('shows the decimal comma if requested, and reads it back', () => {
    const session: Session = { ...base, entries: [{ exerciseId: 'e', sets: [{ reps: 10, weight: 22.5 }] }] }
    const draft = toDraft(session, ',')
    expect(draft.entries[0].sets[0].weight).toBe('22,5')
    expect(toSession('s1', draft).entries[0].sets[0].weight).toBe(22.5)
  })

  it('round-trips without loss', () => {
    expect(toSession('s1', toDraft(base))).toEqual(base)
  })

  it('ignores incomplete or invalid sets but keeps the exercise', () => {
    const draft: SessionDraft = {
      name: '  Push ',
      date: '2026-05-05',
      notes: '   ',
      entries: [
        {
          key: 'k',
          exerciseId: 'pompes',
          sets: [
            { ...emptyDraftSet(), reps: '', weight: '10' },
            { ...emptyDraftSet(), reps: '0', weight: '10' },
            { ...emptyDraftSet(), reps: '12', weight: 'abc' },
            { ...emptyDraftSet(), reps: '12', weight: '' },
          ],
        },
      ],
    }
    expect(toSession('s2', draft)).toEqual({
      id: 's2',
      date: '2026-05-05',
      name: 'Push',
      entries: [{ exerciseId: 'pompes', sets: [{ reps: 12, weight: 0 }] }],
    })
  })

  it('accepts the decimal comma and only a valid RPE', () => {
    const draft: SessionDraft = {
      name: 'x',
      date: '2026-05-05',
      notes: '',
      entries: [{ key: 'k', exerciseId: 'e', sets: [{ key: 'a', reps: '10', weight: '22,5', rpe: '9' }, { key: 'b', reps: '10', weight: '20', rpe: '3' }] }],
    }
    expect(toSession('s', draft).entries[0].sets).toEqual([{ reps: 10, weight: 22.5, rpe: 9 }, { reps: 10, weight: 20 }])
  })
})
