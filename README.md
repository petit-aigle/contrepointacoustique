# ContrePoint

Site statique de présentation de `tabula rasa`, structuré autour d’une `navbar` et de 11 `lignes`.

## Structure

- `index.html` : squelette unique contenant la `navbar` et les 11 `lignes`
- `app.js` : point d’entrée du module JavaScript
- `scripts/` : état, données, rendu et observateurs
- `scripts/data/site-content.js` : composition de la structure des lignes avec le pack de traduction actif
- `scripts/data/translations/` : un fichier JSON autonome par langue (`fr`, `en`, `es`)
- `styles/` : styles de base, de la navbar et des lignes
- `Ressource/images/` : ressources visuelles du site
- `Ressource/fonts/` : fontes embarquées du site

## Lancement local

- serveur statique du projet : `task run`
- autre possibilité : utiliser tout serveur HTTP pointé vers la racine du projet

## Vocabulaire canonique

- `navbar` : barre de navigation
- `ligne` : section visuelle composée d’un bloc de texte et, selon la ligne, d’une image
- `line-01` à `line-11` : identifiants techniques stables utilisés dans le DOM, la documentation et le code

## URL

- `lang=fr|en|es` : langue du site
- `debug=1` : activation du mode de débogage, désactivé par défaut
- `mode=corrected|marketing|raw` : variante de texte disponible en mode de débogage

Lorsque `lang` est absent, la langue est détectée automatiquement à partir des préférences du navigateur, avec le français comme langue de repli.
Le mode `raw` reste limité au français ; dans toute autre langue, le site bascule vers le mode `corrected`.

## Mode de débogage

En mode de débogage, un clic sur l’image de `line-01` fait défiler ses deux variantes. La même action sur les images des lignes `line-02` à `line-09` fait défiler les variantes configurées pour chacune d’elles.

Toutes les zones de texte deviennent éditables sous forme de blocs `contenteditable` transparents, sans habillage visible. Les modifications persistent entre les rendus successifs et sont restaurées après le rechargement de la page grâce au cache local du navigateur. Elles restent séparées selon `lang + mode`.

Une bulle d’aide suit la souris sur les lignes et affiche leur numéro lorsque le pointeur s’arrête. Les images peuvent également être redimensionnées en hauteur au clavier lorsqu’elles sont survolées, au moyen de l’option dédiée du panneau `DEBUG`.

Un clic sur `DEBUG` ouvre un panneau unique comprenant :

- une barre d’outils de texte enrichi pour le champ actif
- un manuel de raccourcis
- les options typographiques globales : police spéciale et casse pour les titres des lignes `line-02+`, ainsi qu’une police spéciale distincte pour le texte courant
- une option `Redimensionnement de l’image au survol`
- un bouton `Réinitialiser le débogage` qui restaure l’état initial des modifications effectuées en mode de débogage

Raccourcis de débogage disponibles dans un champ de texte actif :

- `Ctrl+B` : met la sélection en gras
- `Ctrl+I` : met la sélection en italique
- `Ctrl+E` : fait défiler les alignements justifié → aligné à gauche → aligné à droite → centré
- `Shift + +` : augmente la taille du bloc actif
- `Shift + -` : réduit la taille du bloc actif

Raccourcis disponibles lorsqu’une image est survolée :

- `Shift + +` : augmente la hauteur de la zone de l’image
- `Shift + -` : réduit la hauteur de la zone de l’image

Le cache de débogage n’est utilisé qu’en mode de débogage. Le bouton `Réinitialiser le débogage` vide ce cache et rétablit les variantes d’images, les tailles d’images, les contenus édités et les options de débogage dans leur état initial.
