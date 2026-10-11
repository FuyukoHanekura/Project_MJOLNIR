# Plan: gym logbook app (for Claude Code)

Sep 18, 2026 · @Fuyuko

> This is the initial plan the project started from. It is kept for context: `CLAUDE.md` holds the current decisions and takes precedence over it (for example, the app grew a Tracking tab, themes, 421 exercises and an English-first repository since this plan was written).

## Goals and constraints

A gym logbook PWA, 100 % local: no account, no remote database, data is backed up and transferred with JSON export/import.

- Mobile-first, but comfortable on desktop.
- Installable on the home screen and usable offline.
- Bilingual French/English interface with a language selector. Exercise, machine and muscle names shown in large type in their original language, with the English name smaller below.
- Two heatmaps: a training-day calendar and a body silhouette coloured by volume per muscle.

## Recommended stack

Vite, React and TypeScript, with storage entirely in the browser.

| Need | Choice |
| --- | --- |
| Framework | Vite + React + TypeScript |
| Style | Tailwind CSS, mobile-first |
| Local storage | IndexedDB through Dexie (more reliable than localStorage) |
| Charts | Recharts (body weight, RPE) |
| Muscle silhouette | SVG with colourable muscles (`react-body-highlighter` or a custom SVG) |
| Calendar heatmap | Custom CSS grid, no dependency |
| Installation and offline | `vite-plugin-pwa` |
| Hosting | Netlify, Vercel or GitHub Pages (free) |

## Data model

Three entities are enough; the JSON export groups them with a version number to handle future migrations.

```ts
Exercise {
  id, name, nameEn,     // original name (large) + English (small)
  primaryMuscles[], secondaryMuscles[],
  equipment,            // "machine", "dumbbells", "cable"...
  machineType?,         // "High pulley", "Smith"...
  machineTypeEn?,       // "High pulley"...
  alternatives[],       // ids of similar exercises
  complements[],        // ids of antagonist/complementary exercises
  videoUrl?, notes?,
  isCustom              // true if created by the user
}

Session {
  id, date, name,       // "Pull", "Push", "Legs"...
  entries: [{ exerciseId, sets: [{ reps, weight, rpe? }] }]
}

Muscle { id, name, nameEn }   // "Grand dorsal" / "Latissimus dorsi"

BodyWeight { date, kg }

Export { version, exercises (custom), sessions, bodyWeights }
```

## Features

Six blocks, from the most used daily to the most occasional.

**Sessions**

- Create a session (name + date), add exercises then sets (reps × weight).
- Display such as “Lat pulldown 3×12 @ 45 kg”, with the last performance on the same exercise as a reminder.
- Duplicate an old session (Pull, Push, Legs).

**Exercise page**

- Front/back silhouette: primary muscles in a strong colour, secondary muscles in a light colour.
- Machine type, video, notes.
- Alternatives (same muscle group) and complements (antagonist muscles), all clickable.
- History of your performances and a progression chart.

**Heatmaps**

- Calendar: intensity per day (number of sets or volume).
- Body: volume per muscle over 7, 30 or 90 days. A set counts 1 for a primary muscle and 0.5 for a secondary one, then values are normalised into colours. This reveals neglected muscles.

**Tracking**

- Body weight: quick entry, chart, rolling average.
- Average RPE per exercise (entered on every set, from 6 to 10 in half points): chart over time to see the same weight getting easier. Personal records highlighted.

**Adding exercises**

- “New exercise” button: form (original name + English name) with a muscle picker (click on the silhouette), equipment, alternatives, complements, video link.
- Bulk import from a JSON file.
- Starter catalogue: import *free-exercise-db* (open source) and adapt it, or generate a catalogue of about 80 common exercises in French and English with alternatives and complements.

**Data**

- JSON export (download) and import, with a choice of “merge” or “replace”.
- Export reminder every X weeks: Safari on iPhone may purge the local storage of a rarely used site.

## Development phases

Seven phases, with your validation before moving to the next one.

| # | Phase | Content |
| --- | --- | --- |
| 1 | Base | Project init, PWA, mobile navigation (Sessions, Exercises, Stats, Settings), Dexie, data model |
| 2 | Exercises | Bilingual FR/EN seed, interface i18n, list with search and filters, exercise page, SVG silhouette |
| 3 | Sessions | Creation, set entry, history, duplication |
| 4 | Tracking | Body weight, RPE and records, charts |
| 5 | Heatmaps | Calendar then body |
| 6 | Data | Export/import, custom exercises, bulk import |
| 7 | Polish | Dark mode, calculation tests (average RPE, volume per muscle), deployment |

## Starting prompt for Claude Code

To paste as is into Claude Code, with this document (or its Data model and Features sections) in context.

```text
Build a gym logbook PWA, mobile-first but responsive on desktop.
Stack: Vite, React, TypeScript, Tailwind, Dexie (IndexedDB), Recharts.
No API or account: everything is local, with versioned JSON export/import.
Features: sessions (exercises, sets as reps × weight), exercise page
(silhouette with primary/secondary muscles, machine, video, alternatives,
complements), calendar heatmap + body heatmap (volume per muscle),
body weight tracking, RPE per set (chart per exercise) and records, custom
exercises and bulk import. Bilingual FR/EN interface with a selector;
exercise, machine and muscle names in large type in their original language,
with the English name smaller.
Start by reading the plan, propose the project tree, then implement
phase 1 only and wait for my validation.
```

Tip: also ask Claude Code to create a `CLAUDE.md` file at the root with these decisions, so it keeps its bearings from one session to the next.
