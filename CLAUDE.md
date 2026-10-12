# CLAUDE.md: Carnet de salle

A 100 % local gym-tracking PWA. This file records the project decisions; it takes precedence over my default habits. Priority order in case of conflict: `CLAUDE.md` > `docs/plan.md`. When in doubt, I ask before coding (3 questions at most at a time).

## Language

- The repository is public and written in **English**: code, comments, tests, commit messages, documentation (`README.md`, `CHANGELOG.md`, `CLAUDE.md`, `docs/`) and workflows.
- The French that remains is **product data**, not repository text: `src/i18n/fr.json`, the French fields of the exercise catalogue (`name`, `machineType`, `instructions`), the French muscle names, and sample values in tests that check accent handling.
- The user speaks French in conversation; I answer in the language of the user's message.

## Git rules (top priority)

- I never touch the history or the remote repository. The user makes all commits, tags, pushes and PRs themselves.
- Forbidden: `git add`, `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git checkout`, `git switch`, `git branch` (except read-only), `git stash`, `git cherry-pick`, `git restore`, `git clean`, `git rm`, `git mv`, `git tag`, `gh pr create`, `gh pr merge`.
- Allowed read-only: `git status`, `git diff`, `git log`, `git show`, `git blame`, `git branch --show-current`.
- I never modify `.git/`, the Git hooks or the Git config.
- I never ask for a token, an SSH key or GitHub credentials.

### Branches
- One branch per phase, created by the user: `phase-N-name` (e.g. `phase-1-base`). Work outside a phase (a fix, a visual overhaul) gets its own freely named branch (e.g. `theme-valkyries`) and follows the same rules.
- At the start of each phase I run `git branch --show-current`. If I am on `main`, I stop and ask the user to create the branch.

### Atomic commits
- Format: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `style:`, `perf:`, `build:`, `ci:`), with an optional scope (`feat(exercises): add seed data`). Messages in English, imperative mood, 72 characters maximum on the first line.
- At the end of each phase I propose a plan of 3 to 6 atomic commits. For each one: the message, and the `git add <files>` command to copy (never run by me).
- Every commit must build and pass the tests. Commits are ordered so that this stays true at every step.
- I never mix configuration, data and interface in the same commit.
- A breaking change is flagged with `!` or a `BREAKING CHANGE:` footer.

### Versioning (SemVer)
- Versions `0.MINOR.PATCH` until the end of phase 7, which gave `1.0.0` once the app was deployed.
- A validated phase = a MINOR increment. A fix between two phases = PATCH.
- The last commit of each phase is `chore(release): vX.Y.Z`: I update `version` in `package.json` and add an entry to `CHANGELOG.md` (Keep a Changelog format).
- I suggest the `git tag -a vX.Y.Z -m "..."` and `git push --tags` commands, but the user runs them.
- Do not confuse the two: the `version` of the JSON export is a schema integer, independent of the app's SemVer version.

### End of a step
I summarise the modified files, propose the commit plan and stop. The user reviews the diff and commits.

### Review mode
If asked for a code review, I read `git diff main...HEAD`, comment (bugs, accessibility, performance, edge cases, missing tests) and modify no file without explicit agreement.

## Goals

- 100 % local: no account, no API, no remote database.
- Backup and transfer through versioned JSON export/import.
- Mobile-first, comfortable on desktop.
- Installable on the home screen and usable offline.
- Bilingual FR/EN interface with a language selector.
- Two heatmaps: a calendar of training days, and a body silhouette coloured by volume per muscle.

## Stack

- Node LTS (version recorded in `.nvmrc` and `engines`), package manager: npm. `package-lock.json` is versioned.
- Vite + React + TypeScript (strict mode)
- Tailwind CSS **v4** through `@tailwindcss/vite`: configuration in CSS, no `tailwind.config.js`, no PostCSS. I do not use v3 syntax.
- React Router with **HashRouter** (works on GitHub Pages and self-hosting without a rewrite rule)
- `i18next` + `react-i18next`, without automatic detection: the language is stored in the settings (Dexie table), default value from `navigator.language` (fr or en)
- IndexedDB through Dexie + `dexie-react-hooks` (no localStorage for data)
- Recharts for charts (body weight, RPE, progression)
- Silhouette: custom SVG with colourable muscles
- Calendar heatmap: custom CSS grid, no dependency
- `vite-plugin-pwa` for installation and offline use
- Font: Noto Sans variable (weight, width, italic), **self-hosted** through `@fontsource-variable/noto-sans`, Latin subset only. No request to a third-party service (no Google Fonts).
- Tests: Vitest. Lint: ESLint.
- This is the approved list. Any other dependency is flagged and justified before installation.

## Navigation

Six tabs, hash routes:

| Tab | Content |
| --- | --- |
| Overview | Body heatmap, calendar heatmap, summary statistics |
| Sessions | List, creation, editing, duplication |
| Exercises | List, filters, exercise page, creation, bulk import |
| Tracking | Body weight, RPE, records, progression charts |
| Settings | Language, theme, export/import, export reminder, demo |
| Help | Glossary of the terms the app displays (`/aide`, `/aide/:term`); room for other kinds of help later |

## Data model

```ts
Exercise {
  id,                     // stable slug ("tirage_vertical"), never changed
  name, nameEn,
  group,                  // back | chest | shoulders | arms | legs | abs (labels through i18n)
  movementPattern,        // movement pattern (vpull, hpush...)
  equipmentType,          // machine | cable | barbell | dumbbell | bodyweight | smith | kettlebell | band
  machineType?, machineTypeEn?,   // e.g. "Poulie haute" / "High pulley"
  primaryMuscles[], secondaryMuscles[],   // Muscle ids
  alternatives[],         // ids: same muscle area, other equipment or angle
  antagonists[],          // ids: opposing muscles
  complements[],          // ids: related muscles that complete the work
  instructions, instructionsEn,   // execution tip
  videoUrl?, notes?,      // notes = the user's personal notes
  isCustom
}
Session { id, date, name, notes?, entries: [{ exerciseId, sets: [{ reps, weight, rpe? }] }], demo? }
Muscle { id, name, nameEn }          // 17 muscles, defined in src/data/muscles.ts
BodyWeight { date, kg, demo? }       // one value per date
Setting { key, value }               // language, theme, exportReminderWeeks, lastExportAt, seedVersion
Export { version, exportedAt, exercises (custom), exerciseNotes, sessions, bodyWeights }
```

- `demo` flags the demo data (Settings): it is never exported, does not trigger the export reminder, and an edited demo session becomes a real session.
- `exerciseNotes` saves the notes and videos the user adds to built-in exercises (the exercises themselves are not exported).

- The Dexie schema is versioned (`db.version(n)`) with migrations, independently of `version` in the export.
- The JSON export always carries an integer version number; any format change goes through a migration. Settings are not exported.
- Built-in exercises are not exported, only custom exercises (`isCustom`).
- Dates are stored as `YYYY-MM-DD` (local time), never UTC, to avoid day shifts.

## Bilingual display

- Interface texts come from the translation files; execution instructions also follow the interface language.
- Exercise, machine and muscle names follow the interface language:
  - **English interface**: the English name (`nameEn`) alone, with no second line; falls back to `name` if there is no English name;
  - **French interface**: the original name (`name`) in large type, with the English name (`nameEn`) smaller below; a single line if both are identical.
- This rule applies everywhere: lists, exercise pages, filters, silhouettes (including `aria-label` and tooltips), sessions, tracking, forms. Exercise sorting uses the displayed name. I go through `BilingualName` (two lines) or `useNames` (plain label), never through `.name` directly.
- Exercise search is bilingual: names, machines, muscles, groups and equipment are searched in French and in English, whatever the interface language.

## Visual identity

In the Golden State Valkyries colours: purple `#AD96DC`, black `#010101`, white, gold `#B9975B`. The CSS variables live in `src/index.css` (never a hard-coded colour in a component).

- **Light theme**: inspired by the Heroine jersey (lavender-tinted white, purple, gold).
- **Dark theme**: inspired by the Explorer jersey, with black as the main colour and purple as the secondary one.
- Roles: `accent` = purple dark enough for text and borders (links, focus); `brand` = official purple for button and chip **backgrounds**, with `brand-ink` (black) text; `gold` = decorative rules only, never text.
- Gold rule under page titles and above the tab bar; purple stroke on the active tab.
- Charts (Recharts): main series in `--chart-1` (purple), second series in `--chart-2` (gold), gold rule on hover; both reach 3:1 on the card and the background in both themes.
- The heatmap heat gradient (light purple, pink, orange) and the pink of primary muscles are kept.
- Headings: Noto Sans in a narrow width (75 %) and heavy weight, uppercase.
- Contrast: all text reaches 4.5:1 in both themes, and the automatic (system) dark theme stays identical to the forced dark theme. `src/lib/contrast.test.ts` checks it by reading `index.css`: any palette change must pass this test.

## Calculation rules

- Volume per muscle: a set counts 1 for a primary muscle and 0.5 for a secondary one. Windows of 7, 30 or 90 days (and “All”). Normalised against a reference of 15 sets per week per muscle (full heat).
- RPE: scale from 6 to 10 in half points, entered per set. Average RPE curve per exercise over time.
- Personal records highlighted per exercise.
- These calculations live in pure functions in `src/lib/`, separate from the interface, and are covered by tests.

## Features

1. Sessions: name + date, exercises, sets (reps × weight × optional RPE), reminder of the last performance, duplication of an old session.
2. Exercise page: front/back silhouette (primary in a strong colour, secondary in a light colour), machine, video, notes, clickable alternatives / antagonists / complements, history and progression chart.
3. Heatmaps: calendar (sets or volume) and body (volume per muscle).
4. Tracking: body weight (quick entry, chart, rolling average), RPE and records.
5. Exercises: creation through a form (muscle picker by clicking the silhouette), bulk import through JSON.
6. Data: JSON export, import with a choice of “merge” or “replace” (with confirmation before replacing), export reminder every X weeks (Safari iOS may purge local storage).

## Starter catalogue

- Files: `src/data/muscles.ts` and `src/data/exercises.seed.ts`, separate from the logic.
- Content: 421 exercises (back, chest, shoulders, arms, legs, abs) with `nameEn`, `machineTypeEn`, `instructionsEn` and stable muscle ids. It started as ~100 exercises in the first prototype and was extended in 1.2.0.
- The `alternatives`, `antagonists` and `complements` lists were generated once and written out as static ids. There is no relation-computing engine in the app.
- Mandatory seed tests: every referenced id exists, no exercise references itself, no duplicate id, every exercise has at least one primary muscle, every muscle belongs to the list of 17.
- English translations use common gym terminology; the user reviews a sample.

### Catalogue extension (1.2.0)

- The catalogue grew from the ~100 prototype exercises to 421 (back, chest, shoulders, arms, legs, abs), built in batches per group. Relations (`alternatives`, `antagonists`, `complements`) were recomputed once for the whole catalogue and written out as static ids.
- Each exercise has exactly one `equipmentType`: variants with different equipment are separate exercises, so history, records and progression curves stay comparable. The equipment filter is a multi-select (OR) instead of giving one exercise several equipment types.
- Instructions are original, short (one or two sentences) and bilingual. Third-party datasets may only be used as a factual reference (muscles, equipment); never copy their texts or media.
- Any change to `exercises.seed.ts` requires bumping `SEED_VERSION` in `src/db/seed.ts`, so existing databases are resynchronised (personal notes and videos are preserved). Existing exercise ids never change: `src/data/exercises.seed.test.ts` checks the 100 original ids.

## Exercise packs (1.3.0)

- A pack is a JSON file `{ kind: "exercise-pack", version, name, description?, exportedAt, exercises }`. `version` is a pack schema integer, independent of the export version and the app version; any change to it needs a migration path like the export format.
- Packs hold custom exercises only. Personal `notes` are never exported; relations to custom exercises outside the pack are dropped, relations to built-in exercises are kept.
- Import goes through the bulk importer (`parseExerciseList` then `computeImport`); conflicts on an existing custom id are resolved by `resolveConflicts` (skip, replace or copy). Logic lives in `src/lib/exercisePack.ts`.

## Help and tooltips (1.4.0)

- Glossary ids live in `src/data/glossary.ts`; texts live in `help.terms.<id>` (`name`, `short` for tooltips, `body`) in both translation files. Only terms the app displays get an entry.
- Tooltips use `InfoTip` (opens on tap or click, never on hover only; closes with Escape). Add one next to any new technical term and a matching glossary entry.
- Worked examples in the help texts are computed with the app's own functions, never hard-coded.

## Code conventions

- Strict TypeScript, no `any` without a comment justifying it.
- Functional components, one component per file, business logic in `src/lib/`.
- Interface texts in `fr.json` and `en.json`, never hard-coded in components.
- Accessibility: keyboard-reachable interactive elements, `aria-label` on silhouettes and calendar cells, sufficient contrast in both themes, respect for `prefers-reduced-motion`.
- Touch targets of at least 44 px on mobile.
- Comments, test titles, documentation and commit messages are written in English.

## Licences

- Code: MIT (`LICENSE`).
- Exercise catalogue (`src/data/exercises.seed.ts`): CC BY-NC 4.0, attribution and non-commercial use (`LICENSE-CATALOGUE.md`).
- Font: Noto Sans, SIL OFL 1.1.
- Never copy text, images or videos from third-party sites or datasets into the repository.

## Deployment

Two targets, with the same static build:
- **GitHub Pages** (for now): the site lives under `/<repo-name>/`. `base` is read from the `VITE_BASE` variable in `vite.config.ts` (`/` by default). The PWA manifest (`scope`, `start_url`) derives from it. GitHub Actions workflow in `.github/workflows/deploy.yml`.
- **Raspberry Pi** (later): the contents of `dist/` served by nginx or Caddy. **HTTPS is mandatory** for the service worker and PWA installation (except on `localhost`).
- IndexedDB data belongs to each origin: moving from one domain to another requires an export then an import. The README says so.

## Way of working

The project moves in phases, with validation before the next one (phases 1 to 7 are complete; later work is organised in feature branches):

1. Base: project, PWA, mobile navigation (5 tabs), Dexie, data model, minimal README
2. Exercises: bilingual seed, i18n, list with search and filters, exercise page, SVG silhouette
3. Sessions: creation, set entry (optional RPE), history, duplication
4. Tracking: body weight, RPE and records, charts
5. Heatmaps: calendar then body
6. Data: export/import, custom exercises, bulk import
7. Polish: dark mode, calculation tests, final README, deployment workflow, `1.0.0`

For each piece of work:
- I re-read this file, check the branch, propose a short plan, then implement only the current scope.
- I run `npm run build`, `npm run lint` and `npm run test` before saying it is done.
- I list what remains to be checked by hand (mobile device, offline mode, PWA installation).
- I propose the atomic commit plan and the version, then stop and wait for validation.

## Commands

- `npm run dev`: development server
- `npm run build`: production build
- `npm run test`: Vitest tests
- `npm run lint`: lint
