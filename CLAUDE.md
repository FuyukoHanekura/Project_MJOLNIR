# CLAUDE.md : Carnet de salle

PWA de suivi de musculation, 100 % locale. Ce fichier fixe les décisions du projet ; il prime sur mes habitudes par défaut. Ordre de priorité en cas de conflit : `CLAUDE.md` > `docs/plan.md` > `docs/prototype.html`. En cas de doute, je pose la question avant de coder (3 questions maximum à la fois).

## Règles Git (prioritaires)

- Je ne touche jamais à l'historique ni au dépôt distant. L'utilisateur fait lui-même tous les commits, tags, pushs et PR.
- Interdit : `git add`, `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git checkout`, `git switch`, `git branch` (hors lecture), `git stash`, `git cherry-pick`, `git restore`, `git clean`, `git rm`, `git mv`, `git tag`, `gh pr create`, `gh pr merge`.
- Autorisé en lecture seule : `git status`, `git diff`, `git log`, `git show`, `git blame`, `git branch --show-current`.
- Je ne modifie jamais `.git/`, les hooks Git ni la config Git.
- Je ne demande pas de token, de clé SSH ni d'identifiants GitHub.

### Branches
- Une branche par phase, créée par l'utilisateur : `phase-N-nom` (ex. `phase-1-base`). Un chantier hors phase (correctif, refonte visuelle) a sa propre branche, au nom libre (ex. `theme-valkyries`), et suit les mêmes règles.
- Au début de chaque phase, je lance `git branch --show-current`. Si je suis sur `main`, je m'arrête et je demande à l'utilisateur de créer la branche.

### Commits atomiques
- Format : Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `style:`, `perf:`, `build:`, `ci:`), avec scope optionnel (`feat(exercises): add seed data`). Messages en anglais, à l'impératif, 72 caractères maximum sur la première ligne.
- À la fin de chaque phase, je propose un plan de 3 à 6 commits atomiques. Pour chacun : le message, et la commande `git add <fichiers>` à copier (jamais exécutée par moi).
- Chaque commit doit builder et passer les tests. Les commits sont ordonnés pour que cela reste vrai à chaque étape.
- Je ne mélange jamais configuration, données et interface dans un même commit.
- Un changement cassant est signalé par `!` ou par un pied `BREAKING CHANGE:`.

### Versionnage (SemVer)
- Versions `0.MINOR.PATCH` jusqu'à la fin de la phase 7, qui donne `1.0.0` une fois l'appli déployée.
- Une phase validée = un incrément MINOR (`0.1.0` après la phase 1, `0.2.0` après la phase 2, etc.). Un correctif entre deux phases = PATCH.
- Le dernier commit de chaque phase est `chore(release): vX.Y.Z` : je mets à jour `version` dans `package.json` et j'ajoute une entrée dans `CHANGELOG.md` (format Keep a Changelog).
- Je propose les commandes `git tag -a vX.Y.Z -m "..."` et `git push --tags`, mais l'utilisateur les exécute.
- Ne pas confondre : le `version` de l'export JSON est un entier de schéma, indépendant de la version SemVer de l'appli.

### Fin d'étape
Je résume les fichiers modifiés, je propose le plan de commits et je m'arrête. L'utilisateur relit le diff et commite.

### Mode revue
Si on me demande une revue de code, je lis `git diff main...HEAD`, je commente (bugs, accessibilité, performance, cas limites, tests manquants) et je ne modifie aucun fichier sans accord explicite.

## Objectif

- 100 % local : aucun compte, aucune API, aucune base distante.
- Sauvegarde et transfert par export/import JSON versionné.
- Mobile-first, confortable sur PC.
- Installable sur l'écran d'accueil et utilisable hors ligne.
- Interface bilingue FR/EN avec sélecteur de langue.
- Deux heatmaps : calendrier des jours d'entraînement, et silhouette du corps colorée par volume par muscle.

## Stack

- Node LTS (version notée dans `.nvmrc` et `engines`), gestionnaire de paquets : npm. `package-lock.json` est versionné.
- Vite + React + TypeScript (mode strict)
- Tailwind CSS **v4** via `@tailwindcss/vite` : configuration dans le CSS, pas de `tailwind.config.js` ni de PostCSS. Je n'utilise pas la syntaxe v3.
- React Router avec **HashRouter** (compatible GitHub Pages et auto-hébergement sans règle de réécriture)
- `i18next` + `react-i18next`, sans détection automatique : la langue est stockée dans les réglages (table Dexie), valeur par défaut selon `navigator.language` (fr ou en)
- IndexedDB via Dexie + `dexie-react-hooks` (pas de localStorage pour les données)
- Recharts pour les graphiques (poids de corps, RPE, progression)
- Silhouette : SVG maison avec muscles colorables
- Heatmap calendrier : grille CSS maison, sans dépendance
- `vite-plugin-pwa` pour l'installation et le hors-ligne
- Police : Noto Sans variable (graisse, largeur, italique), **auto-hébergée** via `@fontsource-variable/noto-sans`, sous-ensemble latin uniquement. Aucune requête vers un service tiers (pas de Google Fonts).
- Tests : Vitest. Lint : ESLint.
- Cette liste est la liste approuvée. Toute autre dépendance est signalée et justifiée avant installation.

## Navigation

Cinq onglets, routes en hash :

| Onglet | Contenu |
| --- | --- |
| Aperçu | Heatmap corps, heatmap calendrier, statistiques résumées |
| Séances | Liste, création, édition, duplication |
| Exercices | Liste, filtres, fiche exercice, création, import en masse |
| Suivi | Poids de corps, RPE, records, courbes de progression |
| Réglages | Langue, thème, export/import, rappel d'export, démo |

## Modèle de données

```ts
Exercise {
  id,                     // slug stable ("tirage_vertical"), jamais modifié
  name, nameEn,
  group,                  // back | chest | shoulders | arms | legs | abs (libellés via i18n)
  movementPattern,        // schéma de mouvement du prototype (vpull, hpush...)
  equipmentType,          // machine | cable | barbell | dumbbell | bodyweight | smith | kettlebell | band
  machineType?, machineTypeEn?,   // ex. "Poulie haute" / "High pulley"
  primaryMuscles[], secondaryMuscles[],   // ids de Muscle
  alternatives[],         // ids : même zone musculaire, autre matériel ou angle
  antagonists[],          // ids : muscles opposés
  complements[],          // ids : muscles associés qui complètent le travail
  instructions, instructionsEn,   // conseil d'exécution
  videoUrl?, notes?,      // notes = notes personnelles de l'utilisateur
  isCustom
}
Session { id, date, name, notes?, entries: [{ exerciseId, sets: [{ reps, weight, rpe? }] }], demo? }
Muscle { id, name, nameEn }          // 17 muscles, définis dans src/data/muscles.ts
BodyWeight { date, kg, demo? }       // une valeur par date
Setting { key, value }               // language, theme, exportReminderWeeks, lastExportAt, seedVersion
Export { version, exportedAt, exercises (custom), exerciseNotes, sessions, bodyWeights }
```

- `demo` marque les données de démonstration (Réglages) : elles ne sont jamais exportées, ne déclenchent pas le rappel d'export, et une séance de démo modifiée devient une vraie séance.
- `exerciseNotes` sauvegarde les notes et vidéos que l'utilisateur ajoute aux exercices de la base de départ (non exportés eux-mêmes).

- Le schéma Dexie est versionné (`db.version(n)`) avec migrations, indépendamment de `version` dans l'export.
- L'export JSON contient toujours un numéro de version entier ; toute évolution du format passe par une migration. Les réglages ne sont pas exportés.
- Les exercices de la base de départ ne sont pas exportés, seulement les exercices personnalisés (`isCustom`).
- Dates stockées en `YYYY-MM-DD` (heure locale), jamais en UTC, pour éviter les décalages de jour.

## Affichage bilingue

- Les textes de l'interface viennent des fichiers de traduction ; les consignes d'exécution suivent aussi la langue de l'interface.
- Les noms d'exercices, de machines et de muscles suivent la langue de l'interface :
  - **interface en anglais** : le nom anglais (`nameEn`) seul, sans seconde ligne ; repli sur `name` s'il n'y a pas de nom anglais ;
  - **interface en français** : le nom d'origine (`name`) en gros, avec l'anglais (`nameEn`) en plus petit dessous ; une seule ligne si les deux sont identiques.
- Cette règle s'applique partout : listes, fiches, filtres, silhouettes (y compris `aria-label` et infobulles), séances, suivi, formulaires. Le tri des exercices se fait sur le nom affiché. On passe par `BilingualName` (deux lignes) ou `useNames` (libellé simple), jamais par `.name` directement.
- La recherche d'exercices est bilingue : noms, machines, muscles, groupes et matériel sont cherchés en français et en anglais, quelle que soit la langue de l'interface.

## Identité visuelle

Aux couleurs des Golden State Valkyries : violet `#AD96DC`, noir `#010101`, blanc, or `#B9975B`. Les variables CSS vivent dans `src/index.css` (jamais de couleur en dur dans un composant).

- **Thème clair** : inspiré du maillot Heroine (blanc teinté de lavande, violet, or).
- **Thème sombre** : inspiré du maillot Explorer, avec le noir en couleur principale et le violet en secondaire.
- Rôles : `accent` = violet assez foncé pour le texte et les bordures (liens, focus) ; `brand` = violet officiel pour les **fonds** de boutons et de pastilles, avec du texte `brand-ink` (noir) ; `gold` = filets décoratifs uniquement, jamais du texte.
- Filet or sous les titres de page et au-dessus de la barre d'onglets ; trait violet sur l'onglet actif.
- Graphiques (Recharts) : série principale en `--chart-1` (violet), seconde série en `--chart-2` (or), filet or au survol ; les deux atteignent 3:1 sur la carte et le fond dans les deux thèmes.
- Le dégradé de chaleur des heatmaps (violet clair, rose, orange) et le rose des muscles principaux sont conservés.
- Titres : Noto Sans en largeur étroite (75 %) et graisse forte, en majuscules.
- Contraste : tout texte atteint 4,5:1 dans les deux thèmes, et le thème sombre automatique (système) reste identique au thème sombre forcé. `src/lib/contrast.test.ts` le vérifie en lisant `index.css` : toute modification de palette passe ce test.

## Règles de calcul

- Volume par muscle : une série compte 1 pour un muscle principal, 0,5 pour un secondaire. Fenêtres de 7, 30 ou 90 jours (et « Tout »). Normalisation par rapport à une référence de 15 séries par semaine et par muscle (pleine chaleur).
- RPE : échelle de 6 à 10 par demi-points, saisi par série. Courbe du RPE moyen par exercice dans le temps.
- Records personnels mis en évidence par exercice.
- Ces calculs vivent dans des fonctions pures dans `src/lib/`, séparées de l'interface, et sont couverts par des tests.

## Fonctionnalités

1. Séances : nom + date, exercices, séries (reps × poids × RPE optionnel), rappel de la dernière performance, duplication d'une ancienne séance.
2. Fiche exercice : silhouette avant/arrière (principal en couleur forte, secondaire en couleur claire), machine, vidéo, notes, alternatives / antagonistes / complémentaires cliquables, historique et courbe de progression.
3. Heatmaps : calendrier (séries ou volume) et corps (volume par muscle).
4. Suivi : poids de corps (saisie rapide, courbe, moyenne glissante), RPE et records.
5. Exercices : création via formulaire (sélecteur de muscles par clic sur la silhouette), import en masse par JSON.
6. Données : export JSON, import au choix « fusionner » ou « remplacer » (avec confirmation avant remplacement), rappel d'export toutes les X semaines (Safari iOS peut purger le stockage local).

## Prototype de référence

`docs/prototype.html` est un prototype autonome. Je m'en sers comme référence pour :
- la silhouette SVG et ses zones musculaires ;
- la liste d'exercices, les schémas de mouvement et la logique alternatives / antagonistes / complémentaires (table `REL`) ;
- le calcul de chaleur ;
- les écrans.

Sa direction visuelle d'origine (palette indigo, polices Big Shoulders Display et Figtree) a été remplacée par l'identité Valkyries ci-dessus : ne pas la reprendre.

Il est en français uniquement, stocke dans localStorage, a 4 onglets (Aperçu, Séances, Exercices, Données) et n'a ni RPE, ni poids de corps, ni exercices personnalisés. Je ne le copie pas tel quel : je reprends ses idées et ses données dans une architecture TypeScript propre, avec Dexie et l'i18n. La navigation de ce fichier fait foi (cinq onglets), pas celle du prototype.

## Base de départ (phase 2)

- Fichiers : `src/data/muscles.ts` et `src/data/exercises.seed.ts`, séparés de la logique.
- Contenu : les ~90 exercices du prototype, avec `nameEn`, `machineTypeEn`, `instructionsEn` ajoutés, et des ids de muscles stables.
- Les listes `alternatives`, `antagonists` et `complements` sont générées une seule fois à partir de la logique du prototype (`REL`), puis écrites en dur en ids statiques. Je ne livre pas le moteur de calcul du prototype.
- Tests obligatoires sur le seed : tous les ids référencés existent, aucun exercice ne se référence lui-même, pas de doublon d'id, chaque exercice a au moins un muscle principal, chaque muscle appartient à la liste des 17.
- Les traductions anglaises utilisent la terminologie courante de salle ; l'utilisateur relira un échantillon.

### Catalogue extension (1.2.0)

- The catalogue grew from the ~100 prototype exercises to 421 (back, chest, shoulders, arms, legs, abs), built in batches per group. Relations (`alternatives`, `antagonists`, `complements`) were recomputed once for the whole catalogue and written out as static ids.
- Each exercise has exactly one `equipmentType`: variants with different equipment are separate exercises, so history, records and progression curves stay comparable. The equipment filter is a multi-select (OR) instead of giving one exercise several equipment types.
- Instructions are original, short (one or two sentences) and bilingual. Third-party datasets may only be used as a factual reference (muscles, equipment); never copy their texts or media.
- Any change to `exercises.seed.ts` requires bumping `SEED_VERSION` in `src/db/seed.ts`, so existing databases are resynchronised (personal notes and videos are preserved). Existing exercise ids never change: `src/data/exercises.seed.test.ts` checks the 100 original ids.
- Writing language: code comments, documentation and tests are written in English from this point on; the translation of existing French files is tracked separately.

## Conventions de code

- TypeScript strict, pas de `any` sans commentaire justifiant.
- Composants fonctionnels, un composant par fichier, logique métier dans `src/lib/`.
- Textes de l'interface dans `fr.json` et `en.json`, jamais en dur dans les composants.
- Accessibilité : éléments interactifs au clavier, `aria-label` sur les silhouettes et les cases du calendrier, contrastes suffisants dans les deux thèmes, respect de `prefers-reduced-motion`.
- Tailles tactiles d'au moins 44 px sur mobile.

## Déploiement

Deux cibles, avec le même build statique :
- **GitHub Pages** (en attendant) : le site vit dans `/<nom-du-repo>/`. `base` est lu depuis la variable `VITE_BASE` dans `vite.config.ts` (`/` par défaut). Le manifest PWA (`scope`, `start_url`) en dérive. Workflow GitHub Actions dans `.github/workflows/deploy.yml`, créé en phase 7.
- **Raspberry Pi** (plus tard) : le contenu de `dist/` servi par nginx ou Caddy. **HTTPS obligatoire** pour le service worker et l'installation PWA (sauf `localhost`).
- Les données IndexedDB sont propres à chaque origine : passer d'un domaine à l'autre impose un export puis un import. Je le rappelle dans le README.

## Méthode de travail

Le projet avance par phases, avec validation avant de passer à la suivante :

1. Base : projet, PWA, navigation mobile (5 onglets), Dexie, modèle de données, README minimal
2. Exercices : seed bilingue, i18n, liste avec recherche et filtres, fiche exercice, silhouette SVG
3. Séances : création, saisie des séries (RPE optionnel), historique, duplication
4. Suivi : poids de corps, RPE et records, graphiques
5. Heatmaps : calendrier puis corps
6. Données : export/import, exercices personnalisés, import en masse
7. Finitions : mode sombre, tests des calculs, README final, workflow de déploiement, `1.0.0`

À chaque phase :
- Je relis ce fichier, je vérifie la branche, je propose un plan court, puis j'implémente uniquement la phase en cours.
- Je lance `npm run build`, `npm run lint` et `npm run test` avant de dire que c'est terminé.
- Je liste ce qui reste à vérifier à la main (appareil mobile, mode hors ligne, installation PWA).
- Je propose le plan de commits atomiques et la version, puis je m'arrête et j'attends la validation.

## Commandes

- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm run test` : tests Vitest
- `npm run lint` : lint