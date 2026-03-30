# ContrePoint

Site statique pour la page `tabula rasa`, recentré sur une structure canonique `navbar + lignes`.

## Structure
- `index.html`: squelette unique avec la `navbar` et les 6 `lignes`
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
- `line-01` à `line-06`: identifiants techniques stables utilisés dans le DOM, la doc et le code

## URL
- `lang=fr|en|es`
- `debug=0` pour désactiver le mode debug activé par défaut
- `mode=corrected|marketing|raw`

`raw` reste limité au français; toute autre langue retombe sur `corrected`.

En mode debug, l'image de `line-01` est cliquable pour comparer `title_and_logo.jpg` et `title_and_logo_left.jpg`.
En mode debug, l'image de `line-02` est aussi cliquable et cycle entre `enceinte_left_plus_ampli_plus_enceinte_right.jpg`, `enceinte_vue.jpg` et `enceinte_left_back_plus_enceinte_right.jpg`.
En mode debug, l'image de `line-03` cycle entre `enceinte_vue.jpg` et les vues de détail arrière / frontales utilisées pour la comparaison.
En mode debug, l'image de `line-04` cycle aussi entre `enceinte_vue_back_left_close.jpg`, `enceinte_back_little_left.jpg`, `enceinte_vue_back_left.jpg`, `enceinte_vue_super_face_close_left.jpg`, `enceinte_vue_super_face_close_right.jpg` et `enceinte_vue_super_face_corner_close_left.jpg`.
En mode debug, toutes les zones de texte deviennent aussi éditables via des champs transparents sans chrome visible; les modifications restent en mémoire pendant la session et survivent aux rerenders.
Un clic sur `DEBUG` ouvre aussi un petit menu de typo pour les titres des lignes `line-02+`: `Special Font`, mode de casse (`Actuel`, `FULL MAJ`, `Première lettre`, `minuscules`) et application de la fonte spéciale au texte normal.
