# Ma Bibliothèque V1.0.1

Application PWA personnelle de catalogue de livres, romans, BD et séries multilingues.

## Installation
1. Décompresser l'archive.
2. Placer `index.html`, `manifest.webmanifest`, `sw.js` et `icon.svg` à la racine d'un dépôt GitHub.
3. Dans GitHub : Settings > Pages > Deploy from a branch > main / root.
4. Ouvrir l'URL HTTPS de GitHub Pages dans Chrome Android, puis menu > Ajouter à l'écran d'accueil / Installer l'application.

Pour tester localement sur ordinateur : `python -m http.server 8000` puis `http://localhost:8000` (l'installation PWA nécessite HTTPS ou localhost).

## Fonctionnalités
- Ajout et modification manuelle de livres, romans, BD, mangas, comics et documentaires.
- Recherche ISBN-10/13 par Open Library, scan caméra expérimental si BarcodeDetector disponible.
- Genres multiples, tags, langues, séries et numéros de tome, plusieurs éditions d'une œuvre via `workId` commun.
- Lecture, progression, note, commentaires, favoris, souhaits et emplacement.
- Filtres, statistiques, export CSV, sauvegarde et restauration JSON.
- Mode sombre/clair, cache hors connexion.

## Données et limites
- Les données sont stockées dans `localStorage` **sur le navigateur et l'origine du site** : pas de synchronisation entre appareils.
- Effacer les données du site, changer d'URL ou désinstaller peut entraîner la perte de la collection. **Exporter régulièrement en JSON**.
- Les images sont enregistrées comme URL (pas comme fichiers), donc leur affichage peut nécessiter Internet.
- Le scanner BarcodeDetector n'est pas disponible sur tous les navigateurs ; la saisie ISBN reste utilisable.
- La recherche Open Library peut ne pas trouver un ISBN ou fournir des métadonnées partielles.
- La progression de lecture est en pages. La gestion des œuvres est assistée par un identifiant commun facultatif, pas par dédoublonnage automatique.
- La V1 est une première livraison à tester sur les appareils cibles avant usage intensif.

## Format JSON
`{"version":1,"books":[{"id":"...","title":"...","authors":"...", ...}]}`

Le fichier JSON peut être restauré dans l'onglet Plus. La restauration remplace la collection existante après confirmation.

## Mise à jour V1.0.1 (Cloudflare Pages)
Remplacer uniquement les cinq fichiers du dépôt Ma-bibliotheque, sans changer le domaine ni effacer les données du site. Le cache de navigation fonctionne hors connexion après une première ouverture en ligne et activation du service worker. Les couvertures distantes et la recherche ISBN exigent Internet. Une barre de progression est visible sur les cartes des livres En cours lorsque le total de pages est renseigné. Exporter une sauvegarde JSON avant la mise à jour.


## V1.0.2
- Cache la page racine et index.html sous des clés absolues pour une navigation hors connexion.
- Vérifie le précache avant activation et évite de supprimer les anciens caches avant installation réussie.
- Indique si le mode hors connexion n’est pas prêt.
- Ne modifie ni la clé localStorage (`ma-bibliotheque-v1`) ni les données.
- Validation requise sur Samsung : première ouverture en ligne, fermeture, mode avion, relancement.
