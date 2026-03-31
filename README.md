# ContrePoint

Site statique pour la page `tabula rasa`, recentré sur une structure canonique `navbar + lignes`.

## Structure
- `index.html`: squelette unique avec la `navbar` et les 7 `lignes`
- `app.js`: point d'entrée ES module
- `scripts/`: état, données, rendu, observers
- `styles/`: base, navbar, lignes
- `Ressource/images/`: assets visuels du site
- `Ressource/fonts/`: fontes embarquées du site

## Lancement local
- serveur statique simple: `task run`
- ou tout autre serveur HTTP pointé sur la racine du projet

## Vocabulaire canonique
- `navbar`: barre de navigation
- `ligne`: bloc `image + texte`
- `line-01` à `line-07`: identifiants techniques stables utilisés dans le DOM, la doc et le code

## URL
- `lang=fr|en|es`
- `debug=1` pour activer le mode debug (désactivé par défaut)
- `mode=corrected|marketing|raw`

Si `lang` est absent, la langue est détectée automatiquement depuis le navigateur (avec fallback sur `fr`).
`raw` reste limité au français; toute autre langue retombe sur `corrected`.

En mode debug, l'image de `line-01` est cliquable pour comparer `title_and_logo.jpg` et `title_and_logo_left.jpg`.
En mode debug, l'image de `line-02` est aussi cliquable et cycle entre `enceinte_left_plus_ampli_plus_enceinte_right.jpg`, `enceinte_vue.jpg` et `enceinte_left_back_plus_enceinte_right.jpg`.
En mode debug, l'image de `line-03` cycle entre `enceinte_vue.jpg` et les vues de détail arrière / frontales utilisées pour la comparaison.
En mode debug, l'image de `line-04` cycle aussi entre `enceinte_vue_back_left_close.jpg`, `enceinte_back_little_left.jpg`, `enceinte_vue_back_left.jpg`, `enceinte_vue_super_face_close_left.jpg`, `enceinte_vue_super_face_close_right.jpg` et `enceinte_vue_super_face_corner_close_left.jpg`.
En mode debug, toutes les zones de texte deviennent aussi éditables via des blocs `contenteditable` transparents sans chrome visible; les modifications restent en mémoire pendant la session et survivent aux rerenders.
En mode debug, une bulle d’aide suit la souris sur les lignes et affiche le numéro de ligne quand le pointeur s’arrête.
En mode debug, les images peuvent aussi être redimensionnées en hauteur au clavier quand le pointeur est dessus, via l’option dédiée du panneau `DEBUG`.
En mode debug, les modifications sont maintenant sauvegardées dans le navigateur via un cache local persistant et reviennent après reload.
Un clic sur `DEBUG` ouvre un panneau unique avec:
- une toolbar riche locale pour le champ actif
- un manuel de raccourcis
- les options typo pour les titres des lignes `line-02+`: `Special Font`, mode de casse (`Actuel`, `FULL MAJ`, `Première lettre`, `minuscules`) et application de la fonte spéciale au texte normal
- une option `Redimension image au survol`
- un bouton `Reset debug` qui remet les modifications debug à leur état d’origine

Raccourcis debug disponibles dans un champ texte actif:
- `Ctrl+B`: gras sur la sélection
- `Ctrl+I`: italique sur la sélection
- `Ctrl+E`: cycle `justify -> left -> right -> center`
- `Shift + +`: agrandit la taille du bloc actif
- `Shift + -`: réduit la taille du bloc actif

Raccourcis debug disponibles sur une image survolée:
- `Shift + +`: agrandit la hauteur de la zone image
- `Shift + -`: réduit la hauteur de la zone image

Le cache debug n’est utilisé qu’en debug. Le bouton `Reset debug` vide ce cache et remet les variantes d’images, tailles d’images, contenus édités et options debug à leur état initial.
