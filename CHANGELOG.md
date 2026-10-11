# Changelog

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

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
- Les noms d'exercices, de machines et de muscles suivent la langue de l'interface : en anglais, le nom anglais seul (au lieu du français en gros avec l'anglais dessous) ; en français, inchangé. S'applique aux listes, fiches, filtres, silhouettes (libellés d'accessibilité et infobulles compris), séances, suivi et formulaires.
- Le tri de la liste des exercices se fait sur le nom affiché : par ordre alphabétique anglais en interface anglaise.
- La recherche d'exercices couvre aussi le groupe et le matériel dans les deux langues (« dos » et « back », « barre » et « barbell »).

### Added
- Tests du nom affiché, du tri selon la langue et de la recherche bilingue (les 17 muscles dans les deux langues).

## [1.0.1] - 2026-10-10

### Changed
- Graphiques aux couleurs des Valkyries : série principale en violet, seconde série (moyenne glissante, RPE) en or, à la place du rose de la heatmap. Deux variables de palette, `--chart-1` et `--chart-2`, suffisamment contrastées pour des traits (3:1) dans les deux thèmes.
- Infobulle des graphiques : filet or au survol (au lieu du gris par défaut de Recharts), points cerclés de la couleur de la carte.

### Added
- Légende visible sous les graphiques à deux séries (poids de corps et moyenne sur 7 jours).
- Test de contraste des couleurs de graphique.

## [1.0.0] - 2026-10-10

### Added
- Thème Système, Clair ou Sombre dans les Réglages, enregistré et appliqué avant le premier rendu (sans flash). Les champs natifs (date, listes) suivent le thème.
- Données de démonstration : chargement et retrait en un clic depuis les Réglages. Elles sont marquées, ne sont jamais exportées et ne déclenchent pas le rappel d'export.
- Workflow GitHub Actions de déploiement sur GitHub Pages (lint, tests, build, publication).
- Test de contraste WCAG sur les deux thèmes, et test de cohérence entre le thème sombre automatique et forcé.
- Tests de cas limites des calculs (volume par muscle, calendrier, RPE, records, recherche).
- README complet : installation, déploiement (GitHub Pages et Raspberry Pi), sauvegarde, calculs, architecture.
- Dépendance `@fontsource-variable/noto-sans` (licence OFL) pour auto-héberger la police.

### Changed
- Nouvelle identité visuelle aux couleurs des Golden State Valkyries : thème clair inspiré du maillot Heroine, thème sombre du maillot Explorer avec le noir en couleur principale. Boutons et pastilles actives en violet officiel avec texte noir, filet or sous les titres et au-dessus de la barre d'onglets, trait violet sur l'onglet actif. Le dégradé de la heatmap est conservé.
- Police Noto Sans variable (graisse, largeur et italique) auto-hébergée, à la place de Big Shoulders Display et Figtree : plus aucune requête vers Google, et la police est précachée pour le hors-ligne.
- Icône de l'application (fond noir, « C » violet) et couleur de la barre du navigateur (violet en clair, noir en sombre) alignées sur la palette.
- Tous les textes atteignent 4,5:1 de contraste dans les deux thèmes (vérifié par test).
- Couleurs des muscles secondaires et premier palier de la heatmap plus distincts du gris des muscles non travaillés, dans les deux thèmes.
- Thème et langue enregistrés sont chargés avant le premier affichage.

## [0.6.0] - 2026-10-09

### Added
- Export JSON versionné (version 1) : séances, poids de corps, exercices personnalisés et notes/vidéos des exercices de la base de départ. Téléchargement depuis Réglages > Données.
- Import au choix « Fusionner » ou « Remplacer » (avec confirmation avant remplacement), validation élément par élément et rapport des éléments ignorés. Les réglages ne sont ni exportés ni écrasés.
- Migrations du format d'export : un fichier d'une version plus ancienne est converti, un fichier plus récent est refusé.
- Rappel d'export : bandeau quand le dernier export date de plus de X semaines (réglable, 4 par défaut, désactivable).
- Exercices personnalisés : création et modification par formulaire (muscles choisis sur la silhouette, exercices liés, vidéo), suppression, badge « Perso » dans la liste.
- Import en masse d'exercices par fichier JSON, avec rapport ligne par ligne.
- Tests du format d'export, des migrations, de la validation, des plans de fusion et de remplacement, et du rappel.

 - 2026-10-09

### Added
- Aperçu : heatmap du corps (silhouette face et dos) colorée par volume par muscle sur 7, 30, 90 jours ou tout l'historique, avec classement des muscles, détail du muscle choisi et lien vers ses exercices.
- Aperçu : calendrier des 26 dernières semaines (séries ou volume), cases accessibles au clavier (flèches), détail de la séance du jour et création d'une séance sur un jour de repos.
- Aperçu : statistiques résumées (séances sur 30 jours, séries de la semaine, semaines consécutives).
- La liste des exercices accepte un filtre de muscle dans l'adresse (`?muscle=<id>`).
- Fonctions pures du volume par muscle, du calendrier et des statistiques, avec tests.

## [0.4.0] - 2026-10-09

### Added
- Onglet Suivi en trois sections : Poids de corps, Progression, Records.
- Poids de corps : saisie rapide (une valeur par date), courbe, moyenne glissante sur 7 jours, dernières mesures avec suppression.
- Progression par exercice : charge max, 1RM estimé (Epley), volume et répétitions max, avec courbe du RPE moyen dans le temps.
- Records personnels par exercice (charge max, 1RM estimé, reps max), mis en évidence quand ils ont moins de 30 jours.
- Records et courbes également sur la fiche exercice.
- Graphiques Recharts chargés à la demande, avec résumé textuel pour les lecteurs d'écran.
- Fonctions pures de suivi (moyenne glissante, progression, RPE, records) avec tests.

## [0.3.0] - 2026-10-09

### Added
- Séances : liste triée par date, création, duplication (date du jour, mêmes exercices et séries) et suppression avec confirmation.
- Éditeur de séance : nom, date, notes, ajout d'exercices par recherche, réorganisation, séries reps × poids × RPE optionnel (6 à 10 par demi-points), sauvegarde automatique dans Dexie.
- Rappel de la dernière performance sous chaque exercice, avec reprise en un clic.
- Historique des performances sur la fiche exercice.
- Fonctions pures de séances (normalisation, duplication, historique, formatage « 3×12 @ 45 kg ») et de brouillon, avec tests.

## [0.2.0] - 2026-10-09

### Added
- Internationalisation FR/EN (i18next) avec sélecteur de langue dans les Réglages ; langue enregistrée dans Dexie, valeur par défaut selon `navigator.language`.
- Base de départ de 100 exercices bilingues et 17 muscles (`src/data`), alternatives, antagonistes et complémentaires écrits en dur, semée dans Dexie au premier lancement.
- Liste des exercices avec recherche (sans accents, FR et EN) et filtres par groupe, matériel et muscle principal.
- Fiche exercice : silhouette SVG avant/arrière (principaux en couleur forte, secondaires en couleur claire), machine, conseil d'exécution, lien vidéo, notes personnelles, exercices liés cliquables.
- Affichage bilingue des noms : langue d'origine en gros, anglais en dessous (une ligne si identique).
- Tests du seed et des fonctions de recherche, de tri et de fusion du seed.

## [0.1.0] - 2026-10-09

### Added
- Projet Vite + React + TypeScript strict, Tailwind CSS v4, ESLint, Vitest.
- PWA installable et hors ligne (`vite-plugin-pwa`), `base` configurable via `VITE_BASE`.
- Navigation à 5 onglets (Aperçu, Séances, Exercices, Suivi, Réglages) avec `HashRouter`.
- Base locale Dexie (schéma v1) et types du modèle de données.
- Utilitaires de dates en heure locale (`YYYY-MM-DD`) avec tests.
- Palette et polices du prototype, thème clair/sombre selon le système.
- Icônes placeholder générées par `npm run icons`.
