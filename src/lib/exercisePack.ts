import type { Exercise } from '../types'
import { slugify, uniqueExerciseId } from './exportFormat'

/** Marker of an exercise pack file. Packs are importable through the bulk importer. */
export const PACK_KIND = 'exercise-pack'
/** Pack format version (schema integer, independent of the export version and the app version). */
export const PACK_VERSION = 1

export interface PackMeta {
  name: string
  description?: string
}

export interface ExercisePack extends PackMeta {
  kind: typeof PACK_KIND
  version: number
  exportedAt: string
  exercises: Exercise[]
}

/**
 * Builds a shareable pack from custom exercises. Personal notes are never included.
 * Relations are kept only when the target ships with the pack or is a built-in exercise
 * (the recipient has those too); links to other custom exercises would dangle.
 */
export function buildExercisePack(
  exercises: readonly Exercise[],
  meta: PackMeta,
  seedIds: ReadonlySet<string>,
  now: Date = new Date(),
): ExercisePack {
  const inPack = new Set(exercises.map((e) => e.id))
  const keep = (ids: readonly string[]) => ids.filter((id) => inPack.has(id) || seedIds.has(id))
  const description = meta.description?.trim()
  return {
    kind: PACK_KIND,
    version: PACK_VERSION,
    name: meta.name.trim(),
    ...(description ? { description } : {}),
    exportedAt: now.toISOString(),
    exercises: exercises.map((e) => {
      const copy: Exercise = { ...e, alternatives: keep(e.alternatives), antagonists: keep(e.antagonists), complements: keep(e.complements), isCustom: true }
      delete copy.notes // personal notes stay on the author's device
      return copy
    }),
  }
}

export function packFileName(name: string): string {
  return `pack-${slugify(name) || 'exercises'}.json`
}

export type PackRead = { ok: true; meta?: PackMeta } | { ok: false; error: 'newerPack' }

/** Reads the metadata of a parsed file. A file that is not a pack is fine (plain list): `meta` is undefined. */
export function readPackMeta(raw: unknown): PackRead {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ok: true }
  const r = raw as Record<string, unknown>
  if (r.kind !== PACK_KIND) return { ok: true }
  if (typeof r.version === 'number' && r.version > PACK_VERSION) return { ok: false, error: 'newerPack' }
  const name = typeof r.name === 'string' ? r.name.trim() : ''
  const description = typeof r.description === 'string' ? r.description.trim() : ''
  return { ok: true, meta: { name: name || 'Pack', ...(description ? { description } : {}) } }
}

/** What to do when an imported exercise has the id of an existing custom exercise. */
export type ConflictMode = 'ignore' | 'replace' | 'copy'

/** Imported exercises whose id already belongs to a custom exercise. */
export function findConflicts(incoming: readonly Exercise[], existingCustomIds: ReadonlySet<string>): Exercise[] {
  return incoming.filter((e) => existingCustomIds.has(e.id))
}

/**
 * Applies the conflict choice:
 * - ignore: conflicting exercises are dropped (the existing ones stay untouched);
 * - replace: they overwrite the existing ones (default behaviour of a plain merge);
 * - copy: they are imported under a new id with a “ (2)” suffix; relations inside the pack follow the new id.
 */
export function resolveConflicts(
  incoming: readonly Exercise[],
  existingCustomIds: ReadonlySet<string>,
  takenIds: ReadonlySet<string>,
  mode: ConflictMode,
): Exercise[] {
  const conflicts = new Set(findConflicts(incoming, existingCustomIds).map((e) => e.id))
  if (conflicts.size === 0 || mode === 'replace') return [...incoming]
  if (mode === 'ignore') return incoming.filter((e) => !conflicts.has(e.id))

  const taken = new Set([...takenIds, ...incoming.map((e) => e.id)])
  const newIds = new Map<string, string>()
  for (const e of incoming) {
    if (!conflicts.has(e.id)) continue
    const id = uniqueExerciseId(`${e.nameEn || e.name} 2`, taken)
    taken.add(id)
    newIds.set(e.id, id)
  }
  const remap = (ids: readonly string[]) => ids.map((id) => newIds.get(id) ?? id)
  return incoming.map((e) => {
    const copy = newIds.has(e.id)
    return {
      ...e,
      id: newIds.get(e.id) ?? e.id,
      name: copy ? `${e.name} (2)` : e.name,
      nameEn: copy ? `${e.nameEn} (2)` : e.nameEn,
      alternatives: remap(e.alternatives),
      antagonists: remap(e.antagonists),
      complements: remap(e.complements),
    }
  })
}
