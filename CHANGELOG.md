# Changelog

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

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
