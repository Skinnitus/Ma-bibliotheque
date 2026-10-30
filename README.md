# Ma Bibliothèque V2.0.0 — version finale

Publication prévue sur GitHub `main` après vérification de la sauvegarde des données.

## Fonctions
Catalogue V1.1, journal de lecture, statistiques et objectifs, prêts, suivi manuel des séries et tomes manquants, ISBN/scanner, souhaits, sauvegardes JSON, mode hors ligne.

La reconnaissance automatique des séries n'est pas garantie : renseigner manuellement série, numéro et nombre total de tomes. Le scanner ISBN et les catalogues externes nécessitent une connexion.

## Compatibilité
Les livres restent dans `localStorage` sous `ma-bibliotheque-v1`. Les données supplémentaires V2 utilisent `ma-bibliotheque-v2-extras`. L'export JSON comprend les deux.

## Déploiement
Extraire les cinq fichiers à la racine du dépôt GitHub connecté à Cloudflare Pages. Faire une sauvegarde JSON depuis la production AVANT le commit. Ne pas importer de JSON si la collection apparaît normalement après déploiement.
