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
- `scripts/state.js` : normalisation des anciennes URL vers les pages publiques
- `scripts/data/site-content.js` : composition des lignes, des médias et des correspondances d’ancres
- `scripts/data/translations/` : source de référence des textes, des libellés et des textes alternatifs des images, avec un fichier JSON par langue
- `scripts/render/navbar.js` : rendu de la navbar et des contrôles
- `scripts/render/metadata.js` : génération des métadonnées et de l’URL canonique de chaque langue
- `scripts/build/` : génération des pages HTML complètes et des images optimisées
- `scripts/media/image-viewer.js` : consultation accessible des images originales
- `scripts/accessibility/` : gestion du focus modal
- `scripts/rows/text-curve.js` : adaptation de l’arrondi de `line-08` au texte affiché
- `scripts/render/rows.js` : rendu des lignes
- `scripts/observers.js` : apparition progressive et activation du lien de la navbar
- `styles/base.css`, `styles/navbar.css`, `styles/rows.css` : styles séparés par responsabilité
- `Ressource/fonts/` : fontes du projet, à nommer selon une convention kebab-case stable

## Paramètres URL

- `/` : français
- `/en/` : anglais
- `/es/` : espagnol
- `lang=fr|en|es` : ancienne syntaxe normalisée vers les pages publiques avec JavaScript

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

## Référencement

- Conserver les descriptions localisées dans `scripts/data/translations/`.
- Régénérer les pages et le sitemap avec `npm run build` après une modification des sources ; vérifier leur cohérence avec `npm run check`.
- Conserver explicitement l’ordre image/texte de chaque ligne dans `contentFirst`.
- Garder l’image à gauche sur `line-07` et `line-08`, et les proportions naturelles de l’image sur `line-08`.
- Les URL canoniques, les liens `hreflang` et le sitemap utilisent `/`, `/en/` et `/es/`.
- Autoriser l’exploration des styles, des scripts et des images dans `robots.txt`.
