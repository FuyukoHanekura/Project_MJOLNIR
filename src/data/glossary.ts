/**
 * Glossary entries: ids only. The texts live in the translation files under `help.terms.<id>`
 * (`name`, `short` for tooltips, `body` for the help page).
 * Only terms the app actually displays are listed.
 */
export const GLOSSARY_IDS = [
  'rpe',
  'rm',
  'e1rm',
  'set',
  'rep',
  'volume',
  'topWeight',
  'primarySecondary',
  'fullHeat',
  'movingAverage',
  'relatedExercises',
] as const

export type GlossaryId = (typeof GLOSSARY_IDS)[number]

export const isGlossaryId = (v: string | undefined): v is GlossaryId => GLOSSARY_IDS.some((id) => id === v)
