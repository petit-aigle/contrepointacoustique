# AGENTS.md

## Objectif

Ce projet doit être manipulé avec un vocabulaire simple et stable pour éviter les ambiguïtés entre l’humain et l’IA.

## Glossaire canonique

- `navbar` : barre de navigation qui reste en haut pendant le défilement
- `ligne` : section visuelle composée d’un bloc de texte et, selon la ligne, d’une image
- `line-01` à `line-11` : identifiants techniques des lignes

Ne pas réintroduire de noms métier flous pour ces éléments si `navbar` et `ligne` suffisent.

## Carte des lignes

- `line-01-brand-intro` : logo, titre et texte d’introduction
- `line-02-speaker-hero` : titre, sous-titre, citation et image principale
- `line-03-speaker-design` : vue de l’enceinte et présentation de sa conception
- `line-04-speaker-detail` : détail arrière et présentation du minimalisme
- `line-05-speaker-closeup-left` : gros plan à gauche et présentation de la musicalité
- `line-06-speaker-closeup-right` : gros plan à droite et présentation de la transparence sonore
- `line-07-speaker-closeup-right-copy` : gros plan et présentation de la voix
- `line-08-speaker-closeup-right-copy-2` : vue des enceintes et présentation de la finesse
- `line-09-specifications` : spécifications et informations techniques
- `line-10-contact` : coordonnées de contact et image de livraison
- `line-11-legal` : mentions légales sur fond noir, sans image

## Contrats DOM

- `header.navbar`
- `section#line-01` à `section#line-11`
- `data-row` : nom canonique long de la ligne
- `data-row-media` : conteneur de l’image de la ligne
- `data-row-text` : conteneur du texte de la ligne
- `data-nav-target` : cible de navigation portée par les liens de la navbar

## Carte des modules

- `app.js` : point d’entrée principal
- `scripts/bootstrap.js` : orchestration générale
- `scripts/state.js` : état de l’URL et gestion du repli des modes
- `scripts/debug/` : sous-système séparé de débogage du texte et des images, facile à retirer
- `scripts/data/site-content.js` : composition des lignes, des médias et des correspondances d’ancres
- `scripts/data/translations/` : source de référence des textes, des libellés et des textes alternatifs des images, avec un fichier JSON par langue
- `scripts/render/navbar.js` : rendu de la navbar et des contrôles
- `scripts/render/rows.js` : rendu des lignes
- `scripts/observers.js` : apparition progressive et activation du lien de la navbar
- `styles/base.css`, `styles/navbar.css`, `styles/rows.css` : styles séparés par responsabilité
- `Ressource/fonts/` : fontes du projet, à nommer selon une convention kebab-case stable

## Paramètres URL

- `lang=fr|en|es`
- `debug=1` pour activer le mode de débogage, désactivé par défaut
- `mode=corrected|marketing|raw`

## Règles de débogage

- La navbar affiche un repère `DEBUG` quand le mode de débogage est actif.
- En mode de débogage, un clic sur l’image de `line-01` fait défiler successivement `title_and_logo_left.jpg` et `title_and_logo.jpg`.
- En mode de débogage, un clic sur l’image de `line-02` fait défiler les vues générales, frontales, arrière et de détail configurées pour la comparaison.
- En mode de débogage, un clic sur l’image de `line-03` fait défiler `enceinte_vue.jpg` et les vues de détail arrière et frontales configurées pour la comparaison.
- En mode de débogage, un clic sur l’image de `line-04` fait défiler les vues arrière et frontales rapprochées configurées pour la comparaison.
- En mode de débogage, une bulle d’aide suit la souris sur les lignes et affiche `Ligne N` lorsque le pointeur s’arrête.
- En mode de débogage, les images peuvent être redimensionnées en hauteur au clavier lorsqu’elles sont survolées.
- En mode de débogage, toutes les zones de texte sont rendues sous forme de blocs `contenteditable` transparents, sans fond ni bordure visibles.
- Les états de débogage sont mis en cache dans `localStorage` et sont restaurés après le rechargement de la page.
- Les textes modifiés en mode de débogage restent séparés selon `lang + mode`.
- Un clic sur `DEBUG` ouvre un panneau unique comprenant une barre d’outils de texte enrichi, un manuel de raccourcis, les options typographiques globales, une option de redimensionnement d’image au survol et un bouton `Réinitialiser le débogage`.
- Les raccourcis actifs dans le champ de texte sélectionné sont :
  - `Ctrl+B` : gras sur la sélection
  - `Ctrl+I` : italique sur la sélection
  - `Ctrl+E` : fait défiler les alignements justifié → aligné à gauche → aligné à droite → centré
  - `Shift + +` : augmente la taille du bloc actif
  - `Shift + -` : réduit la taille du bloc actif
- Les raccourcis actifs sur l’image survolée sont :
  - `Shift + +` : augmente la hauteur de la zone de l’image
  - `Shift + -` : réduit la hauteur de la zone de l’image
- Les options typographiques globales restent limitées aux titres `line-02+` pour la casse, avec une police spéciale activable séparément pour les titres et le texte courant.
- `Réinitialiser le débogage` purge le cache persistant et remet l’état de débogage en mémoire à ses valeurs d’origine.

## Ancres publiques

- `#intro` → `#line-01`
- `#tabula` → `#line-02`
- `#essence` → `#line-03`
- `#shaker` → `#line-04`
- `#musique` → `#line-05`
- `#transparence` → `#line-06`
- `#voix` → `#line-07`
- `#finesse` → `#line-08`
- `#specs` → `#line-09`
- `#contact` → `#line-10`
- `#mentions-legales` → `#line-11`

## Règles d’édition

- Préserver le vocabulaire `navbar` / `ligne` dans le code, la documentation et les commentaires.
- Garder la structure des `rows` dans `scripts/data/site-content.js` et toutes les valeurs localisées dans `scripts/data/translations/`.
- Conserver les spécifications, le contact et les mentions légales dans `line-09`, `line-10` et `line-11`.
- Toute nouvelle ligne doit recevoir un identifiant canonique à deux chiffres de la forme `line-NN`.
