# Carnet de salle

PWA de suivi de musculation, 100 % locale : aucun compte, aucune API. Les données restent dans IndexedDB et se transfèrent par export/import JSON.

> Phase 3 (séances) : création, saisie des séries, historique et duplication. Les écrans Aperçu et Suivi sont encore des placeholders.

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

## Changer d'origine

Les données IndexedDB sont propres à chaque origine (domaine et chemin). Pour passer d'un domaine à l'autre, par exemple de GitHub Pages au Raspberry Pi, il faut exporter les données puis les importer sur la nouvelle origine. Safari iOS peut aussi purger le stockage local d'un site peu utilisé : exporte régulièrement.
