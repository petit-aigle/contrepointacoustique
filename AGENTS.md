# AGENTS.md

## Objectif
Ce projet doit être manipulé avec un vocabulaire simple et stable pour éviter les ambiguïtés entre humain et IA.

## Glossaire canonique
- `navbar`: la barre de navigation sticky en haut de page
- `ligne`: une section visuelle composée d'une image et d'un bloc texte
- `line-01` à `line-06`: identifiants techniques des lignes

Ne pas réintroduire des noms métier flous pour ces éléments si `navbar` et `ligne` suffisent.

## Carte des lignes
- `line-01-brand-intro`: logo/titre + textes d'introduction
- `line-02-speaker-hero`: titre/sous-titre/citation + image principale
- `line-03-speaker-design`: vue enceinte + paragraphes techniques
- `line-04-speaker-detail`: détail arrière + paragraphes techniques
- `line-05-speaker-closeup-left`: gros plan gauche + titre/sous-titre/citation
- `line-06-speaker-closeup-right-contact`: gros plan droit + titre/sous-titre/citation + bloc contact

## Contrats DOM
- `header.navbar`
- `section#line-01` à `section#line-06`
- `data-row`: nom canonique long de la ligne
- `data-row-media`: conteneur image de la ligne
- `data-row-text`: conteneur texte de la ligne
- `data-nav-target`: cible de navigation portée par les liens de la navbar

## Carte des modules
- `app.js`: point d'entrée racine
- `scripts/bootstrap.js`: orchestration générale
- `scripts/state.js`: état URL et fallback des modes
- `scripts/data/site-content.js`: source de vérité des textes, médias, labels et mappings d'ancres
- `scripts/render/navbar.js`: rendu de la navbar et des contrôles
- `scripts/render/rows.js`: rendu des 6 lignes
- `scripts/observers.js`: reveal + activation du lien navbar
- `styles/base.css`, `styles/navbar.css`, `styles/rows.css`: styles séparés par responsabilité
- `Ressource/fonts/`: fontes du projet, à nommer en kebab-case stable

## Paramètres URL
- `lang=fr|en|es`
- `debug=0` pour couper le mode debug activé par défaut
- `mode=corrected|marketing|raw`

## Règles debug
- Le projet se charge par défaut en mode debug.
- La navbar affiche un repère `DEBUG` quand ce mode est actif.
- En mode debug, l'image de `line-01` bascule au clic entre `title_and_logo.jpg` et `title_and_logo_left.jpg`.
- En mode debug, l'image de `line-02` cycle au clic entre `enceinte_left_plus_ampli_plus_enceinte_right.jpg`, `enceinte_vue.jpg` et `enceinte_left_back_plus_enceinte_right.jpg`.
- En mode debug, l'image de `line-03` cycle au clic entre `enceinte_vue.jpg` et les vues de détail arrière / frontales utilisées pour la comparaison.
- En mode debug, l'image de `line-04` cycle au clic entre `enceinte_vue_back_left_close.jpg`, `enceinte_back_little_left.jpg`, `enceinte_vue_back_left.jpg`, `enceinte_vue_super_face_close_left.jpg`, `enceinte_vue_super_face_close_right.jpg` et `enceinte_vue_super_face_corner_close_left.jpg`.
- En mode debug, toutes les zones de texte sont rendues sous forme de champs transparents éditables, sans fond ni bordure visibles.
- Les textes modifiés en debug sont conservés en mémoire pour la combinaison courante `lang + mode` pendant la session.
- Un clic sur `DEBUG` ouvre un petit menu de typo pour les titres des lignes `line-02+`, avec `Special Font`, modes de casse (`Actuel`, `FULL MAJ`, `Première lettre`, `minuscules`) et extension optionnelle de la fonte spéciale au texte normal.

## Compatibilité et redirections
- `#accueil -> #line-01`
- `#enceinte -> #line-02`
- `#conception`, `#galerie`, `#fiche-technique`, `#contact` retombent sur `#line-01`

## Contenu supprimé volontairement
Les anciennes sections suivantes ont été supprimées du DOM et de la navigation:
- `Conception acoustique`
- `Galerie`
- `Fiche technique`
- `Contact` comme section autonome

Le contact vit désormais uniquement dans `line-06`.

## Règles d'édition
- Préserver le langage `navbar` / `ligne` dans le code, la doc et les commentaires.
- Garder une seule source de vérité orientée `rows` dans `scripts/data/site-content.js`.
- Ne pas recréer de logique dédiée `gallery`, `specs`, `contact` hors `line-06`.
- Si une nouvelle ligne apparaît un jour, elle doit recevoir un identifiant canonique `line-0N`.
