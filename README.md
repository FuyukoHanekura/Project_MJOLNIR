# Carnet de salle

PWA de suivi de musculation, **100 % locale** : aucun compte, aucune API, aucune base distante. Les données restent dans IndexedDB, sur ton appareil, et se sauvegardent ou se transfèrent par export/import JSON.

Mobile-first, confortable sur PC, installable sur l'écran d'accueil et utilisable hors ligne. Interface bilingue français / anglais.

## Fonctionnalités

| Onglet | Contenu |
| --- | --- |
| Aperçu | Heatmap du corps (volume par muscle sur 7, 30, 90 jours ou tout), calendrier des jours d'entraînement, statistiques résumées |
| Séances | Création, saisie des séries (reps × poids × RPE optionnel), rappel de la dernière performance, duplication |
| Exercices | 100 exercices bilingues, recherche et filtres, fiche avec silhouette, exercices personnalisés, import en masse |
| Suivi | Poids de corps et moyenne glissante, RPE moyen, records, courbes de progression |
| Réglages | Langue, thème, export/import, rappel d'export, données de démonstration |

Les noms d'exercices, de machines et de muscles s'affichent en gros dans leur langue d'origine, avec l'anglais en plus petit dessous. La langue de l'interface ne change que les textes de l'application.

## Démarrage

Prérequis : Node 24 (voir `.nvmrc`) et npm.

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production (dist/)
npm run preview   # sert dist/ en local (nécessaire pour tester la PWA et le hors-ligne)
npm run test      # tests Vitest
npm run lint      # ESLint
npm run icons     # régénère les icônes placeholder
```

Pour tester sur un téléphone du même réseau : `npm run dev -- --host`, ou `npm run build` puis `npm run preview -- --host`. Pense à refaire le build avant `preview`, sinon l'ancien code est servi. L'installation PWA et le hors-ligne exigent HTTPS (sauf `localhost`) : ils ne fonctionnent pas via l'adresse IP du PC.

## Déploiement

Le build est statique (`dist/`). Le routage utilise le hash, donc aucune règle de réécriture n'est nécessaire. La base d'URL se règle avec la variable `VITE_BASE` (`/` par défaut) ; le manifest PWA (`scope`, `start_url`) en dérive.

### GitHub Pages

Le workflow `.github/workflows/deploy.yml` lance le lint, les tests et le build à chaque push sur `main`, puis publie `dist/`.

1. Dans le dépôt GitHub : **Settings > Pages > Build and deployment > Source : GitHub Actions**.
2. Pousse sur `main` (ou lance le workflow à la main depuis l'onglet Actions).
3. Le site est publié sur `https://<utilisateur>.github.io/Project_MJOLNIR/`.

Le workflow construit avec `VITE_BASE=/<nom-du-repo>/`. Pour le faire à la main sous PowerShell : `$env:VITE_BASE='/Project_MJOLNIR/'; npm run build`.

### Raspberry Pi (ou tout serveur)

Construis avec `npm run build` (base `/`), puis sers le contenu de `dist/`. **HTTPS est obligatoire** pour le service worker et l'installation (sauf `localhost`).

Caddy (HTTPS automatique) :

```
carnet.exemple.org {
    root * /var/www/carnet
    file_server
}
```

nginx :

```
server {
    listen 443 ssl;
    server_name carnet.exemple.org;
    # ssl_certificate / ssl_certificate_key ...
    root /var/www/carnet;
    index index.html;
}
```

### Installation sur le téléphone

- **iPhone** : ouvre le site dans Safari, puis Partager > Sur l'écran d'accueil.
- **Android** : menu du navigateur > Installer l'application.

Après une première visite, l'application fonctionne hors ligne. Les polices viennent de Google Fonts et sont mises en cache à la première visite ; sans cela, des polices système de repli sont utilisées.

## Sauvegarde et restauration

Tout reste dans le navigateur : exporte régulièrement (Réglages > Données). Safari sur iPhone peut effacer le stockage d'un site peu utilisé ; un rappel apparaît quand le dernier export date de plus de 4 semaines (réglable ou désactivable).

Le fichier d'export est un JSON versionné :

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

- `version` est un entier de schéma, indépendant de la version de l'application. Un fichier plus récent que l'application est refusé ; un fichier plus ancien est migré (voir `MIGRATIONS` dans `src/lib/exportFormat.ts`).
- `exercises` contient les exercices personnalisés uniquement ; `exerciseNotes` les notes et vidéos que tu as ajoutées aux exercices de la base de départ.
- Les réglages (langue, thème, rappel) ne sont pas exportés et ne sont jamais écrasés par un import. Les données de démonstration ne sont jamais exportées.
- Import « Fusionner » : ajoute le contenu ; à identifiant ou date égal, le fichier remplace l'élément existant. Import « Remplacer » : supprime séances, poids de corps et exercices personnalisés, puis importe (confirmation demandée).
- Import en masse d'exercices (Exercices > Importer des exercices) : un tableau JSON ; seuls `name`, `group`, `equipmentType` et `primaryMuscles` sont obligatoires.

### Changer d'origine

Les données IndexedDB sont propres à chaque origine (domaine et chemin). Pour passer d'un domaine à l'autre, par exemple de GitHub Pages au Raspberry Pi, **exporte puis importe** sur la nouvelle origine.

## Calculs

- **Volume par muscle** : une série compte 1 pour un muscle principal, 0,5 pour un secondaire. Normalisé par rapport à 15 séries par semaine et par muscle (pleine chaleur).
- **RPE** : échelle de 6 à 10 par demi-points, saisi par série ; la courbe montre le RPE moyen par exercice.
- **1RM estimé** : formule d'Epley, `poids × (1 + reps / 30)`.
- **Records** : charge max, 1RM estimé et répétitions max par exercice.
- **Moyenne glissante du poids de corps** : sur 7 jours calendaires.
- Les dates sont stockées en `YYYY-MM-DD` (heure locale), jamais en UTC.

Ces calculs sont des fonctions pures dans `src/lib/`, couvertes par des tests.

## Architecture

```
src/
  components/   composants réutilisables (silhouette, heatmaps, graphiques...)
  data/         muscles et base de départ des exercices
  db/           schéma Dexie, réglages, démo, import/export
  i18n/         fr.json, en.json, initialisation i18next
  lib/          logique pure (calculs, validation, formats) et ses tests
  pages/        un fichier par écran
```

Stack : Vite, React, TypeScript strict, Tailwind CSS v4, HashRouter, i18next, Dexie, Recharts, vite-plugin-pwa, Vitest, ESLint.

## Confidentialité

Tes données d'entraînement ne quittent jamais ton appareil. Seule exception : les polices (Big Shoulders Display, Figtree) sont chargées depuis Google Fonts à la première visite, ce qui expose l'adresse IP à Google ; elles sont ensuite mises en cache.
