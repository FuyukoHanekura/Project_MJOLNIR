# Plan : app de suivi de musculation (pour Claude Code)

Sep 18, 2026 · @Fuyuko

## Objectif et contraintes

Une PWA de suivi de musculation, 100 % locale : aucun compte, aucune base distante, les données se sauvegardent et se transfèrent par export/import JSON.

- Mobile-first, mais confortable sur PC.
- Installable sur l'écran d'accueil et utilisable hors ligne.
- Interface bilingue français/anglais, avec sélecteur de langue. Noms d'exercices, de machines et de muscles affichés en gros dans leur langue d'origine, avec l'anglais en plus petit dessous.
- Deux heatmaps : calendrier des jours d'entraînement et silhouette du corps colorée par volume par muscle.

## Stack recommandée

Vite, React et TypeScript, avec un stockage 100 % dans le navigateur.

| Besoin | Choix |
| --- | --- |
| Framework | Vite + React + TypeScript |
| Style | Tailwind CSS, mobile-first |
| Stockage local | IndexedDB via Dexie (plus fiable que localStorage) |
| Graphiques | Recharts (poids de corps, RPE) |
| Silhouette musculaire | SVG avec muscles colorables (`react-body-highlighter` ou SVG maison) |
| Heatmap calendrier | Grille CSS maison, sans dépendance |
| Installation et hors ligne | `vite-plugin-pwa` |
| Hébergement | Netlify, Vercel ou GitHub Pages (gratuit) |

## Modèle de données

Trois entités suffisent ; l'export JSON les regroupe avec un numéro de version pour gérer les migrations futures.

```ts
Exercise {
  id, name, nameEn,     // nom d'origine (en gros) + anglais (en petit)
  primaryMuscles[], secondaryMuscles[],
  equipment,            // "machine", "haltères", "poulie"...
  machineType?,         // "Poulie haute", "Smith"...
  machineTypeEn?,       // "High pulley"...
  alternatives[],       // ids d'exercices proches
  complements[],        // ids d'exercices antagonistes/complémentaires
  videoUrl?, notes?,
  isCustom              // true si créé par l'utilisateur
}

Session {
  id, date, name,       // "Pull", "Push", "Legs"...
  entries: [{ exerciseId, sets: [{ reps, weight, rpe? }] }]
}

Muscle { id, name, nameEn }   // "Grand dorsal" / "Latissimus dorsi"

BodyWeight { date, kg }

Export { version, exercises (custom), sessions, bodyWeights }
```

## Fonctionnalités

Six blocs, du plus utilisé au quotidien au plus occasionnel.

**Séances**

- Créer une séance (nom + date), y ajouter des exercices puis les séries (reps × poids).
- Affichage type « Tirage vertical 3×12 @ 45 kg », avec la dernière performance sur le même exercice en rappel.
- Dupliquer une ancienne séance (Pull, Push, Legs).

**Fiche exercice**

- Silhouette avant/arrière : muscles principaux en couleur forte, secondaires en couleur claire.
- Type de machine, vidéo, notes.
- Alternatives (même groupe musculaire) et complémentaires (muscles antagonistes), toutes cliquables.
- Historique de tes performances et courbe de progression.

**Heatmaps**

- Calendrier : intensité par jour (nombre de séries ou volume).
- Corps : volume par muscle sur 7, 30 ou 90 jours. Une série compte 1 pour un muscle principal et 0,5 pour un secondaire, puis on normalise en couleurs. Cela révèle les muscles négligés.

**Suivi**

- Poids de corps : saisie rapide, courbe, moyenne glissante.
- RPE moyen par exercice (saisi à chaque série, de 6 à 10 par demi-points) : courbe dans le temps pour voir une même charge devenir plus facile. Records personnels mis en évidence.

**Ajouter des exercices**

- Bouton « Nouvel exercice » : formulaire (nom d'origine + nom anglais) avec sélecteur de muscles (clic sur la silhouette), équipement, alternatives, complémentaires, lien vidéo.
- Import en masse par fichier JSON.
- Base de départ : importer *free-exercise-db* (open source) en l'adaptant, ou faire générer une base d'environ 80 exercices courants en français et en anglais avec alternatives et complémentaires.

**Données**

- Export JSON (téléchargement) et import, au choix « fusionner » ou « remplacer ».
- Rappel d'export toutes les X semaines : Safari sur iPhone peut purger le stockage local d'un site peu utilisé.

## Phases de développement

Sept phases, avec une validation de ta part avant de passer à la suivante.

| # | Phase | Contenu |
| --- | --- | --- |
| 1 | Base | Init du projet, PWA, navigation mobile (Séances, Exercices, Stats, Réglages), Dexie, modèle de données |
| 2 | Exercices | Seed bilingue FR/EN, i18n de l'interface, liste avec recherche et filtres, fiche exercice, silhouette SVG |
| 3 | Séances | Création, saisie des séries, historique, duplication |
| 4 | Suivi | Poids de corps, RPE et records, graphiques |
| 5 | Heatmaps | Calendrier puis corps |
| 6 | Données | Export/import, exercices personnalisés, import en masse |
| 7 | Finitions | Mode sombre, tests des calculs (RPE moyen, volume par muscle), déploiement |

## Prompt de départ pour Claude Code

À coller tel quel dans Claude Code, avec ce document (ou ses sections Modèle de données et Fonctionnalités) en contexte.

```text
Construis une PWA de suivi de musculation, mobile-first mais responsive sur PC.
Stack : Vite, React, TypeScript, Tailwind, Dexie (IndexedDB), Recharts.
Aucune API ni compte : tout est local, avec export/import JSON versionné.
Fonctionnalités : séances (exercices, séries reps × poids), fiche exercice
(silhouette avec muscles principaux/secondaires, machine, vidéo, alternatives,
complémentaires), heatmap calendrier + heatmap corps (volume par muscle),
suivi du poids de corps, RPE par série (courbe par exercice) et records, ajout d'exercices
personnalisés et import en masse. Interface bilingue FR/EN avec
sélecteur ; noms d'exercices, machines et muscles en gros dans leur langue
d'origine, en petit en anglais.
Commence par lire le plan, propose l'arborescence du projet, puis implémente
la phase 1 uniquement et attends ma validation.
```

Conseil : demande aussi à Claude Code de créer un fichier `CLAUDE.md` à la racine avec ces décisions, pour qu'il garde le cap d'une session à l'autre.
