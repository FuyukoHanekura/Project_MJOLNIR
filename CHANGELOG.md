# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioned with [SemVer](https://semver.org/).

## [1.4.0] - 2026-10-12

### Added
- Help tab (sixth tab): a glossary of the terms the app displays, in French and English: RPE (with the 6 to 10 scale, one sentence per level and how to choose your RPE after a set), 1RM and estimated 1RM (Epley formula with a worked example computed by the app itself), set, repetition, volume, top weight, primary and secondary muscles, full heat, rolling average, alternatives / antagonists / complements. The tab is meant to host other kinds of help later.
- “?” tooltips next to RPE (session editor and exercise progress) and estimated 1RM (records). They open on tap or click, close with Escape, a tap outside or the Close button, and link to the matching glossary entry (`#/aide/<term>`), which opens and scrolls into view.
- Tests: every glossary term has a name, a short text and a body in both languages, tooltip texts stay short, the RPE scale is complete, placeholders match between languages, the worked 1RM example matches the formula, and the tab bar has six tabs.

### Fixed
- Tracking > Body weight: on a phone the weight field was taller than expected and sat over the date field on iPhone. The date and weight fields are now stacked (date first, weight below) on small screens, and the native date input no longer forces its own width.

## [1.3.0] - 2026-10-12

### Added
- Exercise packs: Exercises > Export a pack lets you pick some of your custom exercises, name the pack (with an optional description) and download it as a JSON file. Personal notes are never included, and links to custom exercises outside the pack are dropped (links to built-in exercises are kept).
- Importing a pack uses the existing bulk importer (Exercises > Import exercises), which now shows the pack name and description.
- Conflict handling on import: when an imported exercise has the id of one of your custom exercises, choose to skip it (default), replace it or import it as a copy (new id, “ (2)” suffix, relations inside the pack follow the copy). This applies to plain bulk imports too.
- A pack from a newer format version is refused with a clear message. Pack format: `{ "kind": "exercise-pack", "version": 1, "name", "description?", "exportedAt", "exercises" }`.
- Tests for pack building, metadata, conflict detection and the three conflict modes.

## [1.2.1] - 2026-10-11

### Changed
- The whole repository is now written in English ahead of its publication: code comments, test titles, README, CHANGELOG, CLAUDE.md, `docs/plan.md`, the deployment workflow and the scripts. The interface stays bilingual: `fr.json`, `en.json` and the French fields of the exercise catalogue are product data and are unchanged. No change in behaviour.

### Added
- Licences: the code is under the MIT licence (`LICENSE`); the exercise catalogue is under CC BY-NC 4.0, with attribution and non-commercial use (`LICENSE-CATALOGUE.md`). `package.json` declares the code licence.

### Removed
- `docs/prototype.html`, the French-only prototype (about 1,900 lines) used as a reference during the first phases. It stays available in the Git history.

### Fixed
- The 0.5.0 heading was missing from this changelog.

## [1.2.0] - 2026-10-11

### Added
- The equipment filter on the exercise list is now a multi-select: tick several types (barbell and dumbbell, for example) and every exercise that uses any of them is shown. The filter combines with the group, muscle and search filters.
- Three equipment types: `smith` (Smith machine), `kettlebell` and `band` (resistance band), available in the filter, the custom exercise form, imports and search (French and English labels).
- 321 new exercises, bringing the catalogue to 421 (back 75, chest 63, shoulders 50, arms 68, legs 111, abs 54). They cover barbell, dumbbell, cable, machine (including plate-loaded), Smith machine, kettlebell, resistance band and bodyweight variations, including Pendlay and Meadows rows, landmine work, ring exercises, unilateral machine variants, weighted push-ups, sissy squats and more. Each one has French and English names, short instructions in both languages and its alternatives, antagonists and complements.
- Quality tests on the catalogue: original exercise ids are never lost, French and English names are unique, movement patterns are valid, instructions are short and present in both languages, every exercise has at least one alternative, every group and equipment type is well covered.

### Changed
- Existing databases are upgraded automatically at startup (seed version 2). Personal notes and video links on exercises are kept.
- "Curl pupitre" is now explicitly the machine version ("Curl pupitre à la machine" / "Machine preacher curl"), since the barbell version now exists as "Curl pupitre barre". Its id is unchanged, so existing sessions keep their history.
- "Assisted pull-ups" now lists the forearms as a secondary muscle, like the other pulling exercises.
- Alternatives, antagonists and complements of the original exercises were recomputed with the larger catalogue.

### Notes
- Muscle and equipment data were cross-checked against an open exercise dataset (MIT licence) used as a factual reference only. Names and instructions are original; no text or media was copied from third-party sites.

## [1.1.0] - 2026-10-11

### Changed
- Exercise, machine and muscle names follow the interface language: in English, the English name alone (instead of the French name in large type with the English one below); in French, unchanged. This applies to lists, exercise pages, filters, silhouettes (accessibility labels and tooltips included), sessions, tracking and forms.
- The exercise list is sorted on the displayed name: alphabetical English order in the English interface.
- Exercise search also covers the group and the equipment in both languages (“dos” and “back”, “barre” and “barbell”).

### Added
- Tests for the displayed name, language-aware sorting and bilingual search (all 17 muscles in both languages).

## [1.0.1] - 2026-10-10

### Changed
- Charts in the Valkyries colours: main series in purple, second series (rolling average, RPE) in gold instead of the heatmap pink. Two palette variables, `--chart-1` and `--chart-2`, contrasted enough for lines (3:1) in both themes.
- Chart tooltip: gold rule on hover (instead of Recharts' default grey), dots outlined in the card colour.

### Added
- Visible legend under two-series charts (body weight and 7-day average).
- Contrast test for the chart colours.

## [1.0.0] - 2026-10-10

### Added
- System, Light or Dark theme in Settings, saved and applied before the first render (no flash). Native fields (date, lists) follow the theme.
- Demo data: load and remove in one click from Settings. It is flagged, never exported and does not trigger the export reminder.
- GitHub Actions workflow deploying to GitHub Pages (lint, tests, build, publish).
- WCAG contrast test on both themes, and a consistency test between the automatic and forced dark themes.
- Edge-case tests for the calculations (volume per muscle, calendar, RPE, records, search).
- Complete README: installation, deployment (GitHub Pages and Raspberry Pi), backup, calculations, architecture.
- `@fontsource-variable/noto-sans` dependency (OFL licence) to self-host the font.

### Changed
- New visual identity in the Golden State Valkyries colours: light theme inspired by the Heroine jersey, dark theme by the Explorer jersey with black as the main colour. Buttons and active chips in official purple with black text, gold rule under the titles and above the tab bar, purple stroke on the active tab. The heatmap gradient is kept.
- Self-hosted Noto Sans variable font (weight, width and italic) instead of Big Shoulders Display and Figtree: no more requests to Google, and the font is precached for offline use.
- App icon (black background, purple “C”) and browser bar colour (purple in light, black in dark) aligned with the palette.
- All text reaches 4.5:1 contrast in both themes (checked by a test).
- Secondary muscle colours and the first heatmap step are more distinct from the grey of unworked muscles, in both themes.
- The saved theme and language are loaded before the first render.

## [0.6.0] - 2026-10-09

### Added
- Versioned JSON export (version 1): sessions, body weights, custom exercises and notes/videos of built-in exercises. Download from Settings > Data.
- Import with a choice of “Merge” or “Replace” (with confirmation before replacing), item-by-item validation and a report of skipped items. Settings are neither exported nor overwritten.
- Export format migrations: an older file is converted, a newer file is rejected.
- Export reminder: banner when the last export is more than X weeks old (adjustable, 4 by default, can be disabled).
- Custom exercises: creation and editing through a form (muscles picked on the silhouette, linked exercises, video), deletion, “Custom” badge in the list.
- Bulk exercise import from a JSON file, with a line-by-line report.
- Tests for the export format, migrations, validation, merge and replace plans, and the reminder.

## [0.5.0] - 2026-10-09

### Added
- Overview: body heatmap (front and back silhouette) coloured by volume per muscle over 7, 30, 90 days or the whole history, with a muscle ranking, details of the selected muscle and a link to its exercises.
- Overview: calendar of the last 26 weeks (sets or volume), keyboard-accessible cells (arrows), details of the day's session and session creation on a rest day.
- Overview: summary statistics (sessions over 30 days, sets this week, consecutive weeks).
- The exercise list accepts a muscle filter in the address (`?muscle=<id>`).
- Pure functions for volume per muscle, the calendar and the statistics, with tests.

## [0.4.0] - 2026-10-09

### Added
- Tracking tab in three sections: Body weight, Progression, Records.
- Body weight: quick entry (one value per date), chart, 7-day rolling average, latest measurements with deletion.
- Progression per exercise: max weight, estimated 1RM (Epley), volume and max reps, with a chart of the average RPE over time.
- Personal records per exercise (max weight, estimated 1RM, max reps), highlighted when they are less than 30 days old.
- Records and charts also on the exercise page.
- Recharts charts loaded on demand, with a text summary for screen readers.
- Pure tracking functions (rolling average, progression, RPE, records) with tests.

## [0.3.0] - 2026-10-09

### Added
- Sessions: list sorted by date, creation, duplication (today's date, same exercises and sets) and deletion with confirmation.
- Session editor: name, date, notes, adding exercises by search, reordering, sets with reps × weight × optional RPE (6 to 10 in half points), autosave in Dexie.
- Reminder of the last performance under each exercise, with one-click reuse.
- Performance history on the exercise page.
- Pure session functions (normalisation, duplication, history, “3×12 @ 45 kg” formatting) and draft functions, with tests.

## [0.2.0] - 2026-10-09

### Added
- FR/EN internationalisation (i18next) with a language selector in Settings; language saved in Dexie, default value from `navigator.language`.
- Starter catalogue of 100 bilingual exercises and 17 muscles (`src/data`), with alternatives, antagonists and complements hard-coded, seeded into Dexie on first launch.
- Exercise list with search (accent-insensitive, FR and EN) and filters by group, equipment and primary muscle.
- Exercise page: front/back SVG silhouette (primary muscles in a strong colour, secondary in a light colour), machine, execution tip, video link, personal notes, clickable related exercises.
- Bilingual display of names: original language in large type, English below (one line if identical).
- Tests for the seed and for the search, sort and seed-merge functions.

## [0.1.0] - 2026-10-09

### Added
- Vite + React + strict TypeScript project, Tailwind CSS v4, ESLint, Vitest.
- Installable, offline-capable PWA (`vite-plugin-pwa`), `base` configurable through `VITE_BASE`.
- 5-tab navigation (Overview, Sessions, Exercises, Tracking, Settings) with `HashRouter`.
- Local Dexie database (schema v1) and data model types.
- Local-time date utilities (`YYYY-MM-DD`) with tests.
- Palette and fonts from the prototype, light/dark theme following the system.
- Placeholder icons generated by `npm run icons`.
