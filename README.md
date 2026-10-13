# ContrePoint

Site statique de présentation des enceintes `tabula rasa`, structuré autour d’une `navbar` et de 11 `lignes`.

## Structure

- `index.html`, `en/index.html`, `es/index.html` : pages HTML complètes générées en français, anglais et espagnol
- `app.js` et `scripts/bootstrap.js` : amélioration de la navigation et initialisation des interactions
- `scripts/data/site-content.js` : composition et ordre des lignes, images sélectionnées et ancres
- `scripts/data/translations/` : source de référence des textes, avec un fichier JSON par langue
- `scripts/build/` : génération des pages, du sitemap et des images WebP adaptées aux écrans
- `scripts/render/` : rendu du contenu, de la navbar et des métadonnées lors de la génération
- `scripts/media/image-viewer.js` : consultation accessible des images en plein écran
- `scripts/accessibility/` : gestion du focus des fenêtres modales
- `styles/` : styles de base, de la navbar et des lignes
- `Ressource/images/` : photos originales et versions optimisées
- `Ressource/fonts/` : fontes embarquées
- `robots.txt` et `sitemap.xml` : exploration et découverte des pages publiques

## Génération et lancement local

```sh
npm ci
npm run build
npm run check
task run
```

Les pages HTML générées et les versions optimisées des images sont conservées dans le dépôt. La publication d’un serveur statique utilise directement ces fichiers.

Après une modification des textes, de la composition des lignes ou des images, exécuter `npm run build`. `npm run check` vérifie la cohérence des pages et du sitemap avec leurs sources, ainsi que la présence des images dérivées.

## Vocabulaire canonique

- `navbar` : barre de navigation
- `ligne` : section visuelle composée d’un bloc de texte et, selon la ligne, d’une image
- `line-01` à `line-11` : identifiants techniques stables du DOM

## Langues et images

Le français est disponible à la racine, l’anglais sous `/en/` et l’espagnol sous `/es/`. Les liens de langue fonctionnent sans JavaScript. Chaque URL affiche une langue stable. Les anciennes URL utilisant `lang=fr|en|es` sont normalisées vers la page correspondante lorsque JavaScript est actif.

Les images sélectionnées sont définies dans `scripts/data/site-content.js`. Les grandes photos disposent de versions WebP avec plusieurs largeurs. Le navigateur choisit une taille adaptée à l’écran et charge progressivement les images éloignées du haut de page. Les liens des images des lignes `line-02` à `line-08` donnent accès aux originaux ; JavaScript améliore leur consultation avec une vue plein écran.

L’ordre image/texte est explicite dans chaque définition de ligne. Les lignes `line-07` et `line-08` présentent l’image à gauche et le texte à droite sur grand écran. L’image de `line-08` utilise la largeur de sa colonne et conserve ses proportions naturelles. Le fond blanc de cette ligne ajuste son arrondi aux lignes de texte pour conserver une marge de 24 pixels. La grande courbe est conservée lorsque cet espace est disponible. Sans JavaScript, un arrondi compact protège le texte.

## Accessibilité

Le contenu, les liens de navigation, les liens de contact et les mentions légales sont disponibles sans JavaScript. Un lien d’évitement mène au contenu principal. Les titres suivent une hiérarchie `h1`, `h2`, `h3`, avec un seul `h1` par page.

La navbar et les liens d’images sont utilisables au clavier. La vue plein écran isole son arrière-plan, garde le focus dans ses contrôles et restitue le focus à la fermeture. Ses boutons permettent de modifier le zoom au clavier ; les flèches déplacent l’image lorsqu’elle est agrandie. Les animations tiennent compte de la préférence de mouvement réduit. Les mentions légales complètes utilisent un volet natif `details` / `summary`.

## Référencement

Les textes et les images des 11 lignes figurent directement dans le HTML de chaque langue. Les titres, descriptions, URL canoniques, liens `hreflang`, métadonnées de partage et données structurées du site sont générés avec ces pages. Le sitemap référence les trois URL canoniques.

`robots.txt` permet l’exploration du contenu et des ressources nécessaires à son rendu. Les sources de génération sont exclues de l’exploration. Les mentions légales portent `data-nosnippet` pour réserver les extraits de recherche au contenu de présentation du produit.

Après publication :

1. Vérifier les pages `/`, `/en/`, `/es/`, `robots.txt` et `sitemap.xml` sur le domaine public.
2. Soumettre `sitemap.xml` dans Google Search Console.
3. Inspecter les trois URL canoniques puis demander leur indexation.
4. Attendre une nouvelle exploration par Google pour que les résultats reflètent le contenu publié.

Google choisit l’extrait selon la recherche ; la description fournie est une indication. La mise à jour peut prendre plusieurs jours à plusieurs semaines.
