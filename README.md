# Carnet de salle

PWA de suivi de musculation, 100 % locale : aucun compte, aucune API. Les données restent dans IndexedDB et se transfèrent par export/import JSON.

> Phase 6 (données) : export et import JSON, rappel d'export, exercices personnalisés, import en masse. Reste la phase 7 : finitions et déploiement.

## Démarrage

Prérequis : Node 24 (voir `.nvmrc`) et npm.

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production (dist/)
npm run test      # tests Vitest
npm run lint      # ESLint
npm run icons     # régénère les icônes placeholder
```

## Déploiement

Le build est statique (`dist/`). Le routage utilise le hash, donc aucune règle de réécriture n'est nécessaire.

- **GitHub Pages** : le site vit dans `/Project_MJOLNIR/`. Construire avec `VITE_BASE=/Project_MJOLNIR/` (le manifest PWA en dérive). Sous PowerShell : `$env:VITE_BASE='/Project_MJOLNIR/'; npm run build`.
- **Raspberry Pi** : servir `dist/` avec nginx ou Caddy. HTTPS est obligatoire pour le service worker et l'installation (sauf `localhost`).

## Sauvegarde et restauration

Tout reste dans le navigateur : exporte régulièrement (Réglages > Données). Safari sur iPhone peut effacer le stockage d'un site peu utilisé ; un rappel apparaît quand le dernier export date de plus de 4 semaines (réglable).

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
- Les réglages (langue, rappel) ne sont pas exportés et ne sont jamais écrasés par un import.
- Import « Fusionner » : ajoute le contenu ; à identifiant ou date égal, le fichier remplace l'élément existant. Import « Remplacer » : supprime séances, poids de corps et exercices personnalisés, puis importe (confirmation demandée).
- Import en masse d'exercices (Exercices > Importer des exercices) : un tableau JSON ; seuls `name`, `group`, `equipmentType` et `primaryMuscles` sont obligatoires.

## Changer d'origine

Les données IndexedDB sont propres à chaque origine (domaine et chemin). Pour passer d'un domaine à l'autre, par exemple de GitHub Pages au Raspberry Pi, il faut exporter les données puis les importer sur la nouvelle origine. Safari iOS peut aussi purger le stockage local d'un site peu utilisé : exporte régulièrement.
