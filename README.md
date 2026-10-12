# Carnet de salle

A gym logbook PWA that is **100 % local**: no account, no API, no remote database. Data stays in IndexedDB on your device and is backed up or transferred with versioned JSON export/import.

Mobile-first, comfortable on desktop, installable on the home screen and usable offline. The interface is bilingual (French / English).

## Features

| Tab | Content |
| --- | --- |
| Overview | Body heatmap (volume per muscle over 7, 30, 90 days or everything), training-day calendar, summary statistics |
| Sessions | Create sessions, log sets (reps × weight × optional RPE), reminder of the last performance, duplication |
| Exercises | 420+ bilingual exercises, search and filters (multi-select equipment), exercise page with silhouette, custom exercises, bulk import, shareable exercise packs |
| Tracking | Body weight and rolling average, average RPE, records, progression charts |
| Settings | Language, theme, export/import, export reminder, demo data |
| Help | Glossary of the terms used in the app (RPE, 1RM, volume...), also reachable from the “?” tooltips |

Exercise, machine and muscle names follow the interface language: in English, the English name alone; in French, the original name in large type with the English name smaller below. Search works in both languages (“dos” as well as “back”, “barre” as well as “barbell”).

## Getting started

Requirements: Node 24 (see `.nvmrc`) and npm.

```bash
npm install
npm run dev       # development server
npm run build     # production build (dist/)
npm run preview   # serves dist/ locally (needed to test the PWA and offline mode)
npm run test      # Vitest tests
npm run lint      # ESLint
npm run icons     # regenerate the placeholder icons
```

To test on a phone on the same network: `npm run dev -- --host`, or `npm run build` then `npm run preview -- --host`. Remember to rebuild before `preview`, otherwise the old code is served. PWA installation and offline mode require HTTPS (except on `localhost`): they do not work through the PC's IP address.

## Deployment

The build is static (`dist/`). Routing uses the hash, so no rewrite rule is needed. The base URL is set with the `VITE_BASE` variable (`/` by default); the PWA manifest (`scope`, `start_url`) derives from it.

### GitHub Pages

The `.github/workflows/deploy.yml` workflow runs lint, tests and the build on every push to `main`, then publishes `dist/`.

1. In the GitHub repository: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Push to `main` (or run the workflow by hand from the Actions tab).
3. The site is published at `https://<user>.github.io/Project_MJOLNIR/`.

The workflow builds with `VITE_BASE=/<repo-name>/`. To do it by hand in PowerShell: `$env:VITE_BASE='/Project_MJOLNIR/'; npm run build`.

### Raspberry Pi (or any server)

Build with `npm run build` (base `/`), then serve the contents of `dist/`. **HTTPS is mandatory** for the service worker and installation (except on `localhost`).

Caddy (automatic HTTPS):

```
carnet.example.org {
    root * /var/www/carnet
    file_server
}
```

nginx:

```
server {
    listen 443 ssl;
    server_name carnet.example.org;
    # ssl_certificate / ssl_certificate_key ...
    root /var/www/carnet;
    index index.html;
}
```

### Installing on a phone

- **iPhone**: open the site in Safari, then Share > Add to Home Screen.
- **Android**: browser menu > Install app.

After a first visit the app works offline: the code, the icons and the font are all precached.

## Backup and restore

Everything stays in the browser: export regularly (Settings > Data). Safari on iPhone may clear the storage of a rarely used site; a reminder appears when the last export is more than 4 weeks old (adjustable or can be disabled).

The export file is versioned JSON:

```json
{
  "version": 1,
  "exportedAt": "2026-10-09T12:00:00.000Z",
  "exercises": [],
  "exerciseNotes": [],
  "sessions": [],
  "bodyWeights": []
}
```

- `version` is a schema integer, independent of the application version. A file newer than the application is rejected; an older file is migrated (see `MIGRATIONS` in `src/lib/exportFormat.ts`).
- `exercises` contains custom exercises only; `exerciseNotes` holds the notes and videos you added to built-in exercises.
- Settings (language, theme, reminder) are not exported and are never overwritten by an import. Demo data is never exported.
- “Merge” import: adds the content; on equal id or date, the file replaces the existing item. “Replace” import: deletes sessions, body weights and custom exercises, then imports (confirmation required).
- Bulk exercise import (Exercises > Import exercises): a JSON array; only `name`, `group`, `equipmentType` and `primaryMuscles` are required.

### Exercise packs

Share some of your custom exercises with someone else: Exercises > Export a pack, tick the exercises, name the pack and download the JSON file. The recipient imports it from Exercises > Import exercises. Personal notes are never included. If an imported exercise has the same id as one of the recipient's custom exercises, they choose to skip it, replace it or import it as a copy.

```json
{
  "kind": "exercise-pack",
  "version": 1,
  "name": "My pack",
  "description": "Optional",
  "exportedAt": "2026-10-12T09:00:00.000Z",
  "exercises": []
}
```

### Changing origin

IndexedDB data belongs to a single origin (domain and path). To move from one domain to another, for example from GitHub Pages to a Raspberry Pi, **export then import** on the new origin.

## Calculations

- **Volume per muscle**: a set counts 1 for a primary muscle and 0.5 for a secondary one. Normalised against 15 sets per week per muscle (full heat).
- **RPE**: scale from 6 to 10 in half points, entered per set; the chart shows the average RPE per exercise.
- **Estimated 1RM**: Epley formula, `weight × (1 + reps / 30)`.
- **Records**: max weight, estimated 1RM and max reps per exercise.
- **Body weight rolling average**: over 7 calendar days.
- Dates are stored as `YYYY-MM-DD` (local time), never UTC.

These calculations are pure functions in `src/lib/`, covered by tests.

## Architecture

```
src/
  components/   reusable components (silhouette, heatmaps, charts...)
  data/         muscles and the built-in exercise catalogue
  db/           Dexie schema, settings, demo, import/export
  i18n/         fr.json, en.json, i18next setup
  lib/          pure logic (calculations, validation, formats) and its tests
  pages/        one file per screen
```

Stack: Vite, React, strict TypeScript, Tailwind CSS v4, HashRouter, i18next, Dexie, Recharts, vite-plugin-pwa, Vitest, ESLint. Font: Noto Sans variable (SIL OFL 1.1 licence), self-hosted through `@fontsource-variable/noto-sans`.

Visual identity: Golden State Valkyries colours (purple `#AD96DC`, black `#010101`, gold `#B9975B`). The light theme is inspired by the Heroine jersey, the dark theme by the Explorer jersey with black as the main colour.

## Privacy

Your training data never leaves your device, and the application contacts no third-party service: the font is self-hosted, with no request to Google.

## Licence

- **Code**: [MIT](LICENSE).
- **Exercise catalogue** (`src/data/exercises.seed.ts`: names, instructions and muscle/relation data): [CC BY-NC 4.0](LICENSE-CATALOGUE.md). You may reuse and adapt it for non-commercial purposes, provided you credit the author.
- **Font**: Noto Sans, SIL Open Font Licence 1.1 (see `@fontsource-variable/noto-sans`).

Muscle and equipment data were cross-checked against open exercise datasets used as a factual reference only; no third-party text or media was copied.

Golden State Valkyries names and colours are used as a visual homage; this is an independent project, not affiliated with or endorsed by the team or the WNBA.
