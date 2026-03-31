# AGENTS.md

## Objectif
Ce projet doit être manipulé avec un vocabulaire simple et stable pour éviter les ambiguïtés entre humain et IA.

## Glossaire canonique
- `navbar`: la barre de navigation sticky en haut de page
- `ligne`: une section visuelle composée d'une image et d'un bloc texte
- `line-01` à `line-07`: identifiants techniques des lignes

Ne pas réintroduire des noms métier flous pour ces éléments si `navbar` et `ligne` suffisent.

## Carte des lignes
- `line-01-brand-intro`: logo/titre + textes d'introduction
- `line-02-speaker-hero`: titre/sous-titre/citation + image principale
- `line-03-speaker-design`: vue enceinte + paragraphes techniques
- `line-04-speaker-detail`: détail arrière + paragraphes techniques
- `line-05-speaker-closeup-left`: gros plan gauche + paragraphes techniques
- `line-06-speaker-closeup-right`: gros plan droit + paragraphes techniques
- `line-07-contact`: section contact sur fond noir, sans image

## Contrats DOM
- `header.navbar`
- `section#line-01` à `section#line-07`
- `data-row`: nom canonique long de la ligne
- `data-row-media`: conteneur image de la ligne
- `data-row-text`: conteneur texte de la ligne
- `data-nav-target`: cible de navigation portée par les liens de la navbar

## Carte des modules
- `app.js`: point d'entrée racine
- `scripts/bootstrap.js`: orchestration générale
- `scripts/state.js`: état URL et fallback des modes
- `scripts/debug/`: sous-système debug texte + image séparé, facilement retirable
- `scripts/data/site-content.js`: source de vérité des textes, médias, labels et mappings d'ancres
- `scripts/render/navbar.js`: rendu de la navbar et des contrôles
- `scripts/render/rows.js`: rendu des 7 lignes
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
- En mode debug, une bulle d’aide suit la souris sur les lignes et affiche `Ligne N` quand le pointeur s’arrête.
- En mode debug, les images peuvent être redimensionnées en hauteur au clavier quand elles sont survolées.
- En mode debug, toutes les zones de texte sont rendues sous forme de blocs `contenteditable` transparents, sans fond ni bordure visibles.
- Les états debug sont maintenant mis en cache dans `localStorage` et reviennent après reload.
- Les textes modifiés en debug restent scindés par `lang + mode`.
- Un clic sur `DEBUG` ouvre un panneau unique avec une toolbar riche, un manuel de raccourcis, les options typo globales, une option de resize image au survol et un bouton `Reset debug`.
- Les raccourcis actifs sur le champ focus sont:
- `Ctrl+B`: gras sur la sélection
- `Ctrl+I`: italique sur la sélection
- `Ctrl+E`: cycle `justify -> left -> right -> center`
- `Shift + +`: augmente la taille du bloc actif
- `Shift + -`: réduit la taille du bloc actif
- Les raccourcis actifs sur l’image survolée sont:
- `Shift + +`: augmente la hauteur de la zone image
- `Shift + -`: réduit la hauteur de la zone image
- Les options typo globales restent limitées aux titres `line-02+` pour la casse, avec `Special Font` activable séparément pour les titres et pour le texte normal.
- `Reset debug` purge le cache debug persistant et remet l’état debug mémoire à ses valeurs d’origine.

## Compatibilité et redirections
- `#accueil -> #line-01`
- `#enceinte -> #line-02`
- `#contact -> #line-07`
- `#conception`, `#galerie`, `#fiche-technique` retombent sur `#line-01`

## Contenu supprimé volontairement
Les anciennes sections suivantes ont été supprimées du DOM et de la navigation:
- `Conception acoustique`
- `Galerie`
- `Fiche technique`
- `Contact` comme section autonome

Le contact vit désormais dans `line-07`.

## Règles d'édition
- Préserver le langage `navbar` / `ligne` dans le code, la doc et les commentaires.
- Garder une seule source de vérité orientée `rows` dans `scripts/data/site-content.js`.
- Ne pas recréer de logique dédiée `gallery`, `specs`, `contact` hors `line-07`.
- Si une nouvelle ligne apparaît un jour, elle doit recevoir un identifiant canonique `line-0N`.
