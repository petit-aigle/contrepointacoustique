/**
 * @typedef {Object} NavbarItem
 * @property {string} id
 * @property {string} href
 * @property {string} label
 * @property {string} navTarget
 */

/**
 * @typedef {Object} RowMedia
 * @property {string} src
 * @property {number} width
 * @property {number} height
 * @property {string} alt
 * @property {"brand"|"pill-left"|"pill-right"|"circle"} shape
 * @property {"eager"|"lazy"} loading
 * @property {Array<{src: string, width?: number, height?: number, alt?: Record<string, string>, shape?: "brand"|"pill-left"|"pill-right"|"circle", loading?: "eager"|"lazy"}>=} debugVariants
 * @property {string=} debugToggle
 * @property {number=} debugVariantCount
 * @property {boolean=} isAlternate
 * @property {string=} debugLabel
 */

/**
 * @typedef {Object} RowContent
 * @property {"intro"|"speaker"|"paragraphs"|"contact"|"specs"|"legal"} kind
 * @property {string=} title
 * @property {string=} byline
 * @property {string=} subtitle
 * @property {string=} quote
 * @property {string[]=} paragraphs
 * @property {string=} proverb
 * @property {{tableHeaders: {label: string, value: string}, tableRows: Array<{label: string, value: string}>, production: string, price: string, taxNote: string, sustainableTitle: string, sustainableBody: string, technicalTitle: string, technicalBody: string, usageNote: string}=} specs
 * @property {{leftTitle: string, leftBody: string, rightTitle: string, rightBody: string, modalTitle: string, modalBody: string, modalOpenLabel: string, modalBackLabel: string, modalCloseLabel: string}=} legal
 * @property {{lead: string, address: string[], email: string}=} contact
 */

/**
 * @typedef {Object} SiteRow
 * @property {string} id
 * @property {string} key
 * @property {string[]} classNames
 * @property {string} navTarget
 * @property {string=} debugLineLabel
 * @property {RowMedia=} media
 * @property {RowContent} content
 */

export const CANONICAL_ROW_ORDER = [
  "line-01",
  "line-02",
  "line-03",
  "line-04",
  "line-05",
  "line-06",
  "line-07",
  "line-08",
  "line-09",
  "line-10",
  "line-11",
];

const ROW_HASH_BY_ID = {
  "line-01": "intro",
  "line-02": "tabula",
  "line-03": "essence",
  "line-04": "shaker",
  "line-05": "musique",
  "line-06": "transparence",
  "line-07": "voix",
  "line-08": "finesse",
  "line-09": "specs",
  "line-10": "contact",
  "line-11": "mentions-legales",
};

const ROW_ID_BY_HASH = Object.fromEntries(
  Object.entries(ROW_HASH_BY_ID).map(([rowId, hash]) => [hash, rowId])
);

const UI_TEXT = {
  fr: {
    rowPrefix: "Ligne",
    navShortLabels: {
      "line-01": "Intro",
      "line-02": "Tabula",
      "line-03": "Essence",
      "line-04": "Shaker",
      "line-05": "Musique",
      "line-06": "Transparence",
      "line-07": "Voix",
      "line-08": "Finesse",
      "line-09": "Specs",
      "line-10": "Contact",
      "line-11": "Mentions",
    },
    labels: {
      language: "Langue",
      mode: "Mode texte",
      menuToggle: "Menu",
      debugHint: "Mode debug actif.",
      rawFallback: "Le mode Brut est disponible en français uniquement.",
      debugImageToggle: "Basculer l'image de cette ligne",
      debugPanelTitle: "Typo debug",
      debugToolbarTitle: "Éditeur riche",
      debugManualTitle: "Raccourcis",
      debugNoActiveField: "Aucun champ actif",
      debugActiveField: "Champ actif",
      debugTitleFont: "Special Font",
      debugTitleCase: "Format des titres",
      debugBodyFont: "Texte normal en Special Font",
      debugImageResize: "Redimension image au survol",
      debugReset: "Reset debug",
      debugBold: "Gras",
      debugItalic: "Italique",
      debugAlign: "Alignement",
      debugFontIncrease: "A+",
      debugFontDecrease: "A-",
      debugManualBold: "gras sélectionné",
      debugManualItalic: "italique sélectionné",
      debugManualAlign: "cycle justify → left → right → center",
      debugManualFontIncrease: "agrandit la taille du bloc actif",
      debugManualFontDecrease: "réduit la taille du bloc actif",
      debugManualImageResize:
        "sur image survolée: Shift + + / Shift + - change la hauteur",
    },
    debugTitleCaseModes: {
      current: "Actuel",
      uppercase: "FULL MAJ",
      sentence: "Première lettre",
      lowercase: "minuscules",
    },
    debugAlignModes: {
      justify: "Justify",
      left: "Left",
      right: "Right",
      center: "Center",
    },
    modes: {
      corrected: "Corrigé",
      marketing: "Marketing",
      raw: "Brut",
    },
  },
  en: {
    rowPrefix: "Line",
    navShortLabels: {
      "line-01": "Intro",
      "line-02": "Tabula",
      "line-03": "Essence",
      "line-04": "Shaker",
      "line-05": "Music",
      "line-06": "Transparency",
      "line-07": "Voice",
      "line-08": "Finesse",
      "line-09": "Specs",
      "line-10": "Contact",
      "line-11": "Legal",
    },
    labels: {
      language: "Language",
      mode: "Text mode",
      menuToggle: "Menu",
      debugHint: "Debug mode enabled.",
      rawFallback: "Raw mode is available in French only.",
      debugImageToggle: "Toggle this line image",
      debugPanelTitle: "Debug Type",
      debugToolbarTitle: "Rich Editor",
      debugManualTitle: "Shortcuts",
      debugNoActiveField: "No active field",
      debugActiveField: "Active field",
      debugTitleFont: "Special Font",
      debugTitleCase: "Title case",
      debugBodyFont: "Body text in Special Font",
      debugImageResize: "Resize image area on hover",
      debugReset: "Reset debug",
      debugBold: "Bold",
      debugItalic: "Italic",
      debugAlign: "Alignment",
      debugFontIncrease: "A+",
      debugFontDecrease: "A-",
      debugManualBold: "selected text in bold",
      debugManualItalic: "selected text in italic",
      debugManualAlign: "cycles justify → left → right → center",
      debugManualFontIncrease: "increases active block size",
      debugManualFontDecrease: "decreases active block size",
      debugManualImageResize:
        "on hovered image: Shift + + / Shift + - changes its height",
    },
    debugTitleCaseModes: {
      current: "Current",
      uppercase: "FULL CAPS",
      sentence: "First letter",
      lowercase: "lowercase",
    },
    debugAlignModes: {
      justify: "Justify",
      left: "Left",
      right: "Right",
      center: "Center",
    },
    modes: {
      corrected: "Edited",
      marketing: "Marketing",
      raw: "Raw",
    },
  },
  es: {
    rowPrefix: "Línea",
    navShortLabels: {
      "line-01": "Intro",
      "line-02": "Tabula",
      "line-03": "Esencia",
      "line-04": "Shaker",
      "line-05": "Música",
      "line-06": "Transparencia",
      "line-07": "Voz",
      "line-08": "Finesse",
      "line-09": "Specs",
      "line-10": "Contacto",
      "line-11": "Legal",
    },
    labels: {
      language: "Idioma",
      mode: "Modo de texto",
      menuToggle: "Menú",
      debugHint: "Modo debug activo.",
      rawFallback: "El modo bruto está disponible solo en francés.",
      debugImageToggle: "Cambiar la imagen de esta línea",
      debugPanelTitle: "Tipografía debug",
      debugToolbarTitle: "Editor enriquecido",
      debugManualTitle: "Atajos",
      debugNoActiveField: "Ningún campo activo",
      debugActiveField: "Campo activo",
      debugTitleFont: "Special Font",
      debugTitleCase: "Formato de títulos",
      debugBodyFont: "Texto normal en Special Font",
      debugImageResize: "Redimensionar imagen al pasar",
      debugReset: "Reset debug",
      debugBold: "Negrita",
      debugItalic: "Cursiva",
      debugAlign: "Alineación",
      debugFontIncrease: "A+",
      debugFontDecrease: "A-",
      debugManualBold: "negrita en la selección",
      debugManualItalic: "cursiva en la selección",
      debugManualAlign: "ciclo justify → left → right → center",
      debugManualFontIncrease: "aumenta el tamaño del bloque activo",
      debugManualFontDecrease: "reduce el tamaño del bloque activo",
      debugManualImageResize:
        "en imagen sobrevolada: Shift + + / Shift + - cambia la altura",
    },
    debugTitleCaseModes: {
      current: "Actual",
      uppercase: "MAYÚSCULAS",
      sentence: "Primera letra",
      lowercase: "minúsculas",
    },
    debugAlignModes: {
      justify: "Justify",
      left: "Left",
      right: "Right",
      center: "Center",
    },
    modes: {
      corrected: "Corregido",
      marketing: "Marketing",
      raw: "Bruto",
    },
  },
};

const INTRO_TITLE = "« L’art industialisable »";
const LINE03_TITLE_FR = "ne rien ajouter ne rien retrancher";
const LINE03_TITLE_EN = "add nothing, subtract nothing";
const LINE03_TITLE_ES = "no añadir nada, no quitar nada";
const LINE03_BODY_FR =
  "L’essence de nos baffles invite à la foi en une intégtité sonor et une pureté formelle où la fonction fait la forme. Une conception qui prililégie la clarté et le relief à la puissance brut, une vision minimaliste au profit d’une fidélité rigoureuse.";
const LINE04_PROVERB = "Proverbe Shaker";
const LINE04_PARAGRAPHS = [
  "Notre approche s’inspire de l'éthique de l’art minimal. Une réaction à la complexité de l'expressionnisme abstrait . L’objectif du mouvement minimaliste est de se concentrer sur l’essentiel , en supprimant les détails ou distractions inutiles. Cest le point de départ de notre démarche , reproduire une oeuvre sonore sans artefacts.",
];
const LINE04_TITLE_FR = "“ Honesty , utility , simplicity “";
const LINE04_TITLE_EN = '"Honesty, utility, simplicity."';
const LINE04_TITLE_ES = '"Honesty, utility, simplicity."';
const LINE05_PARAGRAPHS = [
  "Un haut parleur unique pour les graves , medium et aigus . Donc une source ponctuelle , d’ou une precision de l’image et une homogénéité des timbres exemplaires.\n\nDe meme l’économie du filtre répartiteur de fréquences et des problèmes qui vont avec . Le haut parleur utilisé est à haut rendement il suffit de quelque watts pour une écoute domestique.\n\nCette technologie concours à une rapidité sur les trensitoires et une micro-dynamique qui se traduisent par une vivacité et une vitalité hors pair .",
];
const LINE05_TITLE_FR = "la musique est libérée";
const LINE05_TITLE_EN = "the music is set free";
const LINE05_TITLE_ES = "la música es liberada";
const LINE06_TITLE_FR = "La transparence du son";
const LINE06_TITLE_EN = "the cause, not the symptom";
const LINE06_TITLE_ES = "la causa, no el síntoma";
const LINE06_PARAGRAPHS = [
  "Nous résolvons les problèmes en supprimant leurs causes , en débarrassant l’objet des scories qui l’encombrent . Un seul haut parleur , pas de coffret , pas de composants électroniques.\n\nPas de boitier mais un panneau en verre acrylique grâce à un haut parleur spécifique . Le pmma est intrinsequement peu résonnant et le choix du baffle plan permet également de s’affranchir radicalement des ondes stationnaires.",
];
const LINE07_TITLE_FR = "La voix est sublime";
const LINE07_PARAGRAPHS_FR = [
  "Tabula rasa offre un haut degré de résolution mais sans fatigue auditive , l’ecoute est au contraire douce et nuancé .\n\nL’honnêteté oblige à indiquer que leur bande passante est moins large que sur la plupart des enceintes acoustique classiques de prix équivalent . Mais nous savons que le médium offre 80% de l’émotion , et la dessus elle ne craint personne .",
];
const LINE08_TITLE_FR = "Le choix de la finesse";
const LINE08_PARAGRAPHS_FR = [
  "Un amplificateur de la plus grande finesse s’impose , la puissance important peu , 2x2 ou 3 watts suffisent.\nNous pouvons vous orienter vers des modeles parfaitement adaptés.",
];
const LINE09_TITLE_FR = "Spécifications";
const LINE09_SPEC_TABLE_HEADERS_FR = {
  label: "Caractéristique",
  value: "Valeur",
};
const LINE09_SPEC_TABLE_ROWS_FR = [
  { label: "Sensibilité", value: "96 dB (1W/1m)" },
  { label: "Bande passante", value: "70-20000 Hz" },
  { label: "Impédance", value: "8 ohms" },
  { label: "Puissance max", value: "50 W" },
  { label: "Rodage", value: "50 h" },
  { label: "Diamètre haut-parleur", value: "22,5 cm" },
  { label: "Largeur enceinte", value: "À préciser" },
  { label: "Hauteur enceinte", value: "À préciser" },
  { label: "Profondeur enceinte", value: "À préciser" },
  { label: "Poids enceinte", value: "À préciser" },
  { label: "Poids du colis", value: "À préciser" },
];
const LINE09_PRODUCTION_FR = "Production limité à 40 paires par an";
const LINE09_PRICE_FR = "2125 Euro";
const LINE09_TAX_NOTE_FR = "* TVA non appliquable art.293 b du CGI";
const LINE09_SUSTAINABLE_TITLE_FR = "Conception durable";
const LINE09_SUSTAINABLE_BODY_FR =
  "Pas d'obsolescence programmée , avec la durabilité au cœur des préoccupations. Verre acrylique recyclé et recyclable, associé à une membrane de haut-parleur en papier. Conçu et fabriquée en France avec soin et minutie.";
const LINE09_TECHNICAL_TITLE_FR = "excellence technique";
const LINE09_TECHNICAL_BODY_FR =
  "Haut-parleur large bande à haut rendement et source ponctuelle de 22,5 cm. Sensibilité : 96db . Bande passante : 70-20000 Hz. Impédance : 8 ohms . Durée de rodage : 50 heures. Fonctionne avec des amplificateurs à tubes de seulement 2 ou 3 watts et jusqu'à 50 watts .";
const LINE09_USAGE_NOTE_FR =
  "Il ne s'agit pas d'un sound system. L'écoute est destinée à un usage domestique, offrant une expérience sonore purement intime.";
const LINE10_LEFT_TITLE_FR = "Contacter nous";
const LINE10_LEFT_BODY_FR =
  "Nom : Contrepoint acoustique\n\nAdresse :\n54 route de mur de sologne\n41230 Veilleins\nLoir et cher\nFrance\n\nTéléphone : 0662591488\n\nMail : valereorlic@contrepointacoustique.com";
const LINE10_RIGHT_TITLE_FR = "Mentions légales";
const LINE10_RIGHT_BODY_FR =
  "Éditeur : Valere Orlic, entrepreneur individuel (EI).\nMarque : Contrepoint acoustique.\nImmatriculation : RM 751 135 732 RM 41, SIRET 75113573200012.\nTVA non applicable (art. 293 B du CGI).\nHébergeur : WordPress.com / Automattic (à confirmer).\nDirecteur de publication : Valere Orlic.\nDonnées personnelles : droits d’accès, rectification et suppression via email.\nLe détail complet est disponible via le lien ci-dessous.";
const LINE10_LEGAL_MODAL_TITLE_FR = "Mentions légales";
const LINE10_LEGAL_MODAL_BODY_FR =
  "Éditeur du site :\nNom / Prénom : Valere Orlic\nStatut : Entrepreneur individuel (EI)\nMarque : Contrepoint acoustique (marque déposée)\nAdresse : 54 route de mur de sologne, 41230 Veilleins, Loir et Cher, France\nTéléphone : 0662591488\nEmail : valereorlic@contrepointacoustique.com\n\nImmatriculation :\nRM : 751 135 732 RM 41\nSIREN : à compléter\nSIRET : 75113573200012\nCode APE/NAF : à compléter\n\nTVA :\nTVA non applicable, art. 293 B du CGI\nN° TVA intracommunautaire : non applicable en franchise de TVA (à confirmer)\n\nHébergeur :\nNom/Raison sociale : WordPress.com / Automattic Inc. (à confirmer)\nAdresse : 60 29th Street #343, San Francisco, CA 94110, USA (à confirmer)\nTéléphone : non communiqué publiquement\nSite web : https://wordpress.com\n\nDirecteur de la publication :\nValere Orlic\n\nPropriété intellectuelle :\nL’ensemble des contenus (textes, images, logo, marque) est protégé. Toute reproduction non autorisée est interdite.\n\nMédiation de la consommation (si vente B2C) :\nNom du médiateur : à compléter\nLien : à compléter\n\nDonnées personnelles (RGPD) :\nResponsable de traitement : Valere Orlic\nFinalités : gestion des demandes de contact et relation commerciale\nBase légale : intérêt légitime et/ou consentement selon le formulaire\nDurée de conservation : à compléter selon la politique interne\nDroits (accès, rectification, suppression, opposition) : demande par email à valereorlic@contrepointacoustique.com\nContact RGPD : valereorlic@contrepointacoustique.com\nRéclamation CNIL : https://www.cnil.fr\n\nCookies / traceurs :\nPolitique cookies : à compléter\nGestion du consentement : bandeau cookies à configurer/compléter";
const LINE10_LEGAL_MODAL_OPEN_LABEL_FR = "Voir tout les mention legales";
const LINE10_LEGAL_MODAL_BACK_LABEL_FR = "Retour";
const LINE10_LEGAL_MODAL_CLOSE_LABEL_FR = "Fermer";

const SPEAKER_BYLINE = {
  fr: "Par contrepoint acoustique",
  en: "Par contrepoint acoustique",
  es: "Par contrepoint acoustique",
};

const COPY = {
  fr: {
    corrected: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "Une enceinte minimaliste centrée sur la clarté, la vitesse et la présence du médium.",
        quote: "« Ne rien ajouter, ne rien retrancher. »",
      },
      line03Title: LINE03_TITLE_FR,
      line03Paragraphs: [LINE03_BODY_FR],
      line04Title: LINE04_TITLE_FR,
      line04Proverb: LINE04_PROVERB,
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Title: LINE05_TITLE_FR,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_FR,
      line06Paragraphs: LINE06_PARAGRAPHS,
      line07Title: LINE07_TITLE_FR,
      line07Paragraphs: LINE07_PARAGRAPHS_FR,
      line08Title: LINE08_TITLE_FR,
      line08Paragraphs: LINE08_PARAGRAPHS_FR,
      line09Title: LINE09_TITLE_FR,
      line09SpecTableHeaders: LINE09_SPEC_TABLE_HEADERS_FR,
      line09SpecTableRows: LINE09_SPEC_TABLE_ROWS_FR,
      line09Production: LINE09_PRODUCTION_FR,
      line09Price: LINE09_PRICE_FR,
      line09TaxNote: LINE09_TAX_NOTE_FR,
      line09SustainableTitle: LINE09_SUSTAINABLE_TITLE_FR,
      line09SustainableBody: LINE09_SUSTAINABLE_BODY_FR,
      line09TechnicalTitle: LINE09_TECHNICAL_TITLE_FR,
      line09TechnicalBody: LINE09_TECHNICAL_BODY_FR,
      line09UsageNote: LINE09_USAGE_NOTE_FR,
      line10LeftTitle: LINE10_LEFT_TITLE_FR,
      line10LeftBody: LINE10_LEFT_BODY_FR,
      line10RightTitle: LINE10_RIGHT_TITLE_FR,
      line10RightBody: LINE10_RIGHT_BODY_FR,
      line10LegalModalTitle: LINE10_LEGAL_MODAL_TITLE_FR,
      line10LegalModalBody: LINE10_LEGAL_MODAL_BODY_FR,
      line10LegalModalOpenLabel: LINE10_LEGAL_MODAL_OPEN_LABEL_FR,
      line10LegalModalBackLabel: LINE10_LEGAL_MODAL_BACK_LABEL_FR,
      line10LegalModalCloseLabel: LINE10_LEGAL_MODAL_CLOSE_LABEL_FR,
      contactLead:
        "Pour une écoute ou un conseil d'association ampli/enceinte, écrivez-nous.",
    },
    marketing: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "Un objet acoustique qui privilégie l'émotion et la lisibilité à la démonstration de puissance.",
        quote: "« Honesty, utility, simplicity. »",
      },
      line03Title: LINE03_TITLE_FR,
      line03Paragraphs: [LINE03_BODY_FR],
      line04Title: LINE04_TITLE_FR,
      line04Proverb: LINE04_PROVERB,
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Title: LINE05_TITLE_FR,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_FR,
      line06Paragraphs: LINE06_PARAGRAPHS,
      line07Title: LINE07_TITLE_FR,
      line07Paragraphs: LINE07_PARAGRAPHS_FR,
      line08Title: LINE08_TITLE_FR,
      line08Paragraphs: LINE08_PARAGRAPHS_FR,
      line09Title: LINE09_TITLE_FR,
      line09SpecTableHeaders: LINE09_SPEC_TABLE_HEADERS_FR,
      line09SpecTableRows: LINE09_SPEC_TABLE_ROWS_FR,
      line09Production: LINE09_PRODUCTION_FR,
      line09Price: LINE09_PRICE_FR,
      line09TaxNote: LINE09_TAX_NOTE_FR,
      line09SustainableTitle: LINE09_SUSTAINABLE_TITLE_FR,
      line09SustainableBody: LINE09_SUSTAINABLE_BODY_FR,
      line09TechnicalTitle: LINE09_TECHNICAL_TITLE_FR,
      line09TechnicalBody: LINE09_TECHNICAL_BODY_FR,
      line09UsageNote: LINE09_USAGE_NOTE_FR,
      line10LeftTitle: LINE10_LEFT_TITLE_FR,
      line10LeftBody: LINE10_LEFT_BODY_FR,
      line10RightTitle: LINE10_RIGHT_TITLE_FR,
      line10RightBody: LINE10_RIGHT_BODY_FR,
      line10LegalModalTitle: LINE10_LEGAL_MODAL_TITLE_FR,
      line10LegalModalBody: LINE10_LEGAL_MODAL_BODY_FR,
      line10LegalModalOpenLabel: LINE10_LEGAL_MODAL_OPEN_LABEL_FR,
      line10LegalModalBackLabel: LINE10_LEGAL_MODAL_BACK_LABEL_FR,
      line10LegalModalCloseLabel: LINE10_LEGAL_MODAL_CLOSE_LABEL_FR,
      contactLead:
        "Nous pouvons guider l'amplification en cohérence avec l'esprit Tabula Rasa.",
    },
    raw: {
      speaker: {
        title: "tabula rasa",
        subtitle: "une vision minimaliste au profit d'une fidélité rigoureuse",
        quote: "« L'art industialisable »",
      },
      line03Title: LINE03_TITLE_FR,
      line03Paragraphs: [LINE03_BODY_FR],
      line04Title: LINE04_TITLE_FR,
      line04Proverb: LINE04_PROVERB,
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Title: LINE05_TITLE_FR,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_FR,
      line06Paragraphs: LINE06_PARAGRAPHS,
      line07Title: LINE07_TITLE_FR,
      line07Paragraphs: LINE07_PARAGRAPHS_FR,
      line08Title: LINE08_TITLE_FR,
      line08Paragraphs: LINE08_PARAGRAPHS_FR,
      line09Title: LINE09_TITLE_FR,
      line09SpecTableHeaders: LINE09_SPEC_TABLE_HEADERS_FR,
      line09SpecTableRows: LINE09_SPEC_TABLE_ROWS_FR,
      line09Production: LINE09_PRODUCTION_FR,
      line09Price: LINE09_PRICE_FR,
      line09TaxNote: LINE09_TAX_NOTE_FR,
      line09SustainableTitle: LINE09_SUSTAINABLE_TITLE_FR,
      line09SustainableBody: LINE09_SUSTAINABLE_BODY_FR,
      line09TechnicalTitle: LINE09_TECHNICAL_TITLE_FR,
      line09TechnicalBody: LINE09_TECHNICAL_BODY_FR,
      line09UsageNote: LINE09_USAGE_NOTE_FR,
      line10LeftTitle: LINE10_LEFT_TITLE_FR,
      line10LeftBody: LINE10_LEFT_BODY_FR,
      line10RightTitle: LINE10_RIGHT_TITLE_FR,
      line10RightBody: LINE10_RIGHT_BODY_FR,
      line10LegalModalTitle: LINE10_LEGAL_MODAL_TITLE_FR,
      line10LegalModalBody: LINE10_LEGAL_MODAL_BODY_FR,
      line10LegalModalOpenLabel: LINE10_LEGAL_MODAL_OPEN_LABEL_FR,
      line10LegalModalBackLabel: LINE10_LEGAL_MODAL_BACK_LABEL_FR,
      line10LegalModalCloseLabel: LINE10_LEGAL_MODAL_CLOSE_LABEL_FR,
      contactLead:
        "Nous pouvons vous orienter vers des modeles parfaitement adaptés.",
    },
  },
  en: {
    corrected: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "A minimalist loudspeaker focused on precision, speed and midrange emotion.",
        quote: '"Add nothing, subtract nothing."',
      },
      line03Title: LINE03_TITLE_EN,
      line04Title: LINE04_TITLE_EN,
      line04Proverb: LINE04_PROVERB,
      line05Title: LINE05_TITLE_EN,
      line03Paragraphs: [
        "A single full-range driver covers bass, mids and highs from one point source.",
        "No conventional cabinet and no complex crossover keeps dynamics lively.",
        "PMMA panel plus open baffle helps reduce resonance and standing waves.",
      ],
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_EN,
      line06Paragraphs: LINE06_PARAGRAPHS,
      contactLead:
        "For listening sessions or amplifier pairing, contact us.",
    },
    marketing: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "A refined acoustic object built for clarity and musical immediacy.",
        quote: '"Honesty, utility, simplicity."',
      },
      line03Title: LINE03_TITLE_EN,
      line04Title: LINE04_TITLE_EN,
      line04Proverb: LINE04_PROVERB,
      line05Title: LINE05_TITLE_EN,
      line03Paragraphs: [
        "Single-driver coherence, open architecture and controlled resonance define the experience.",
        "The midrange carries emotion with stable imaging and low fatigue.",
        "A technical choice made for natural dynamics and vivid expression.",
      ],
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_EN,
      line06Paragraphs: LINE06_PARAGRAPHS,
      contactLead:
        "We can help build a matching amplification chain.",
    },
  },
  es: {
    corrected: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "Un altavoz minimalista centrado en precisión, velocidad y emoción del rango medio.",
        quote: '"No añadir nada, no quitar nada."',
      },
      line03Title: LINE03_TITLE_ES,
      line04Title: LINE04_TITLE_ES,
      line04Proverb: LINE04_PROVERB,
      line05Title: LINE05_TITLE_ES,
      line03Paragraphs: [
        "Un único transductor cubre graves, medios y agudos como fuente puntual.",
        "Sin caja clásica ni filtro complejo, la microdinámica se mantiene viva.",
        "PMMA y baffle abierto ayudan a limitar resonancias y ondas estacionarias.",
      ],
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_ES,
      line06Paragraphs: LINE06_PARAGRAPHS,
      contactLead:
        "Para escucha o recomendación de amplificación, contáctanos.",
    },
    marketing: {
      speaker: {
        title: "tabula rasa",
        subtitle:
          "Un objeto acústico sobrio y expresivo, pensado para escuchar música de forma directa.",
        quote: '"Honesty, utility, simplicity."',
      },
      line03Title: LINE03_TITLE_ES,
      line04Title: LINE04_TITLE_ES,
      line04Proverb: LINE04_PROVERB,
      line05Title: LINE05_TITLE_ES,
      line03Paragraphs: [
        "Transductor único, arquitectura abierta y control de resonancias.",
        "La escena se mantiene estable y la voz conserva presencia.",
        "Un enfoque técnico para preservar dinamismo y naturalidad.",
      ],
      line04Paragraphs: LINE04_PARAGRAPHS,
      line05Paragraphs: LINE05_PARAGRAPHS,
      line06Title: LINE06_TITLE_ES,
      line06Paragraphs: LINE06_PARAGRAPHS,
      contactLead:
        "Podemos orientar la combinación con una amplificación adecuada.",
    },
  },
};

const CONTACT = {
  fr: {
    address: [
      "Contrepoint acoustique",
      "54 route de Mur de Sologne",
      "41230 Veilleins",
      "Loir-et-Cher, France",
    ],
    email: "valereorlic@contrepointacoustique.com",
  },
  en: {
    address: [
      "Contrepoint acoustique",
      "54 route de Mur de Sologne",
      "41230 Veilleins",
      "Loir-et-Cher, France",
    ],
    email: "valereorlic@contrepointacoustique.com",
  },
  es: {
    address: [
      "Contrepoint acoustique",
      "54 route de Mur de Sologne",
      "41230 Veilleins",
      "Loir-et-Cher, Francia",
    ],
    email: "valereorlic@contrepointacoustique.com",
  },
};

const MEDIA = {
  "line-01": {
    src: "Ressource/images/title_and_logo_left.jpg",
    width: 2947,
    height: 2934,
    alt: {
      fr: "Contrepoint acoustique.",
      en: "Contrepoint acoustique.",
      es: "Contrepoint acoustique.",
    },
    shape: "brand",
    loading: "eager",
    debugVariants: [
      {
        src: "Ressource/images/title_and_logo.jpg",
      },
    ],
  },
  "line-02": {
    src: "Ressource/images/enceinte_face.jpg",
    width: 5600,
    height: 4480,
    alt: {
      fr: "Vue frontale d'une enceinte.",
      en: "Front view of a speaker.",
      es: "Vista frontal de un altavoz.",
    },
    shape: "pill-left",
    loading: "eager",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Paire d'enceintes avec amplificateur.",
          en: "Pair of speakers with amplifier.",
          es: "Pareja de altavoces con amplificador.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Vue complète de l'enceinte.",
          en: "Full view of the speaker.",
          es: "Vista completa del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 5600,
        height: 4480,
        alt: {
          fr: "Vue arrière gauche et enceinte droite.",
          en: "Rear left view and right speaker.",
          es: "Vista trasera izquierda y altavoz derecho.",
        },
      },
    ],
  },
  "line-03": {
    src: "Ressource/images/enceinte_vue.jpg",
    width: 5792,
    height: 8688,
    alt: {
      fr: "Vue complète de l'enceinte.",
      en: "Full view of the speaker.",
      es: "Vista completa del altavoz.",
    },
    shape: "circle",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
        alt: {
          fr: "Détail arrière gauche rapproché.",
          en: "Close rear left detail.",
          es: "Detalle trasero izquierdo cercano.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_back_left_close.jpg",
        width: 4480,
        height: 5600,
        alt: {
          fr: "Détail arrière gauche.",
          en: "Rear left detail.",
          es: "Detalle trasero izquierdo.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_back_left.jpg",
        width: 4480,
        height: 5600,
        alt: {
          fr: "Vue arrière gauche.",
          en: "Rear left view.",
          es: "Vista trasera izquierda.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal gauche.",
          en: "Left front detail.",
          es: "Detalle frontal izquierdo.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal droit.",
          en: "Right front detail.",
          es: "Detalle frontal derecho.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-04": {
    src: "Ressource/images/enceinte_vue_back_left_close.jpg",
    width: 4480,
    height: 5600,
    alt: {
      fr: "Détail arrière gauche.",
      en: "Rear left detail.",
      es: "Detalle trasero izquierdo.",
    },
    shape: "circle",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
        alt: {
          fr: "Détail arrière gauche rapproché.",
          en: "Close rear left detail.",
          es: "Detalle trasero izquierdo cercano.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_back_left.jpg",
        width: 4480,
        height: 5600,
        alt: {
          fr: "Vue arrière gauche.",
          en: "Rear left view.",
          es: "Vista trasera izquierda.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal gauche.",
          en: "Left front detail.",
          es: "Detalle frontal izquierdo.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal droit.",
          en: "Right front detail.",
          es: "Detalle frontal derecho.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-05": {
    src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
    width: 3584,
    height: 4480,
    alt: {
      fr: "Détail frontal gauche.",
      en: "Left front detail.",
      es: "Detalle frontal izquierdo.",
    },
    shape: "pill-right",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
        alt: {
          fr: "Détail arrière gauche rapproché.",
          en: "Close rear left detail.",
          es: "Detalle trasero izquierdo cercano.",
        },
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Vue arrière et face de l'enceinte.",
          en: "Rear and front speaker view.",
          es: "Vista trasera y frontal del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-06": {
    src: "Ressource/images/enceinte_back_little_left.jpg",
    width: 6286,
    height: 5028,
    alt: {
      fr: "Détail arrière gauche rapproché.",
      en: "Close rear left detail.",
      es: "Detalle trasero izquierdo cercano.",
    },
    shape: "pill-left",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal droit.",
          en: "Right front detail.",
          es: "Detalle frontal derecho.",
        },
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Vue arrière et face de l'enceinte.",
          en: "Rear and front speaker view.",
          es: "Vista trasera y frontal del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-07": {
    src: "Ressource/images/enceinte_vue_super_face_corner_close_left_zoom.jpg",
    width: 2865,
    height: 2653,
    alt: {
      fr: "Détail d'angle du haut-parleur (zoom).",
      en: "Speaker corner detail (zoom).",
      es: "Detalle de esquina del altavoz (zoom).",
    },
    shape: "pill-left",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
        alt: {
          fr: "Détail arrière gauche rapproché.",
          en: "Close rear left detail.",
          es: "Detalle trasero izquierdo cercano.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal droit.",
          en: "Right front detail.",
          es: "Detalle frontal derecho.",
        },
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Vue arrière et face de l'enceinte.",
          en: "Rear and front speaker view.",
          es: "Vista trasera y frontal del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-08": {
    src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
    width: 6720,
    height: 4480,
    alt: {
      fr: "Paire d'enceintes avec amplificateur.",
      en: "Pair of speakers with amplifier.",
      es: "Pareja de altavoces con amplificador.",
    },
    shape: "pill-left",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
        alt: {
          fr: "Détail arrière gauche rapproché.",
          en: "Close rear left detail.",
          es: "Detalle trasero izquierdo cercano.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail frontal droit.",
          en: "Right front detail.",
          es: "Detalle frontal derecho.",
        },
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        alt: {
          fr: "Vue arrière et face de l'enceinte.",
          en: "Rear and front speaker view.",
          es: "Vista trasera y frontal del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
        alt: {
          fr: "Détail d'angle du haut-parleur.",
          en: "Speaker corner detail.",
          es: "Detalle de esquina del altavoz.",
        },
      },
    ],
  },
  "line-09": {
    src: "Ressource/images/speaker-top.jpg",
    width: 800,
    height: 800,
    alt: {
      fr: "Speaker vue haute.",
      en: "Speaker top view.",
      es: "Vista superior del altavoz.",
    },
    shape: "pill-right",
    loading: "lazy",
    debugVariants: [
      {
        src: "Ressource/images/speaker.jpg",
        width: 800,
        height: 800,
        alt: {
          fr: "Image speaker.",
          en: "Speaker image.",
          es: "Imagen de altavoz.",
        },
      },
      {
        src: "Ressource/images/speaker-top.jpg",
        width: 800,
        height: 800,
        alt: {
          fr: "Speaker vue haute.",
          en: "Speaker top view.",
          es: "Vista superior del altavoz.",
        },
      },
      {
        src: "Ressource/images/speaker-bot.jpg",
        width: 800,
        height: 800,
        alt: {
          fr: "Speaker vue basse.",
          en: "Speaker bottom view.",
          es: "Vista inferior del altavoz.",
        },
      },
      {
        src: "Ressource/images/enceinte_face.jpg",
        width: 5600,
        height: 4480,
        alt: {
          fr: "Vue frontale d'une enceinte.",
          en: "Front view of a speaker.",
          es: "Vista frontal de un altavoz.",
        },
      },
    ],
  },
  "line-10": {
    src: "Ressource/images/camion.png",
    width: 1600,
    height: 1200,
    alt: {
      fr: "Camion de livraison Contrepoint acoustique.",
      en: "Contrepoint acoustique delivery truck.",
      es: "Camión de entrega de Contrepoint acoustique.",
    },
    shape: "brand",
    loading: "lazy",
  },
};

const ROW_DEFINITIONS = [
  {
    id: "line-01",
    key: "line-01-brand-intro",
    classNames: ["site-row--line-01", "site-row--light", "site-row--brand-intro"],
  },
  {
    id: "line-02",
    key: "line-02-speaker-hero",
    classNames: [
      "site-row--line-02",
      "site-row--light",
      "site-row--speaker-hero",
      "site-row--content-first",
    ],
  },
  {
    id: "line-03",
    key: "line-03-speaker-design",
    classNames: [
      "site-row--line-03",
      "site-row--light",
      "site-row--speaker-design",
      "site-row--circle-media",
    ],
  },
  {
    id: "line-04",
    key: "line-04-speaker-detail",
    classNames: [
      "site-row--line-04",
      "site-row--light",
      "site-row--speaker-detail",
      "site-row--content-first",
      "site-row--circle-media",
    ],
  },
  {
    id: "line-05",
    key: "line-05-speaker-closeup-left",
    classNames: [
      "site-row--line-05",
      "site-row--light",
      "site-row--speaker-closeup-left",
    ],
  },
  {
    id: "line-06",
    key: "line-06-speaker-closeup-right",
    classNames: [
      "site-row--line-06",
      "site-row--light",
      "site-row--speaker-closeup-right",
      "site-row--content-first",
    ],
  },
  {
    id: "line-07",
    key: "line-07-speaker-closeup-right-copy",
    classNames: [
      "site-row--line-07",
      "site-row--light",
      "site-row--speaker-closeup-right",
      "site-row--content-first",
    ],
  },
  {
    id: "line-08",
    key: "line-08-speaker-closeup-right-copy-2",
    classNames: [
      "site-row--line-08",
      "site-row--light",
      "site-row--speaker-closeup-right",
      "site-row--content-first",
    ],
  },
  {
    id: "line-09",
    key: "line-09-specifications",
    classNames: [
      "site-row--line-09",
      "site-row--dark",
      "site-row--speaker-specs",
      "site-row--content-first",
    ],
  },
  {
    id: "line-10",
    key: "line-10-contact",
    classNames: [
      "site-row--line-10",
      "site-row--dark",
      "site-row--contact",
    ],
  },
  {
    id: "line-11",
    key: "line-11-legal",
    classNames: [
      "site-row--line-11",
      "site-row--dark",
      "site-row--legal",
      "site-row--no-media",
    ],
  },
];

function getModeCopy(lang, mode) {
  const languagePack = COPY[lang] || COPY.fr;
  return languagePack[mode] || languagePack.corrected;
}

function buildMedia(rowId, lang, currentState, uiText) {
  const media = MEDIA[rowId];
  if (!media) {
    return undefined;
  }

  const variants = [
    {
      src: media.src,
      width: media.width,
      height: media.height,
      alt: media.alt,
      shape: media.shape,
      loading: media.loading,
    },
    ...(media.debugVariants || []),
  ];
  const variantIndex = currentState.debug
    ? currentState.debugImageVariants[rowId] || 0
    : 0;
  const activeVariant = variants[variantIndex] || variants[0];

  return {
    src: activeVariant.src,
    width: activeVariant.width || media.width,
    height: activeVariant.height || media.height,
    alt:
      (activeVariant.alt && (activeVariant.alt[lang] || activeVariant.alt.fr)) ||
      media.alt[lang] ||
      media.alt.fr,
    shape: activeVariant.shape || media.shape,
    loading: activeVariant.loading || media.loading,
    debugToggle: currentState.debug && variants.length > 1 ? rowId : undefined,
    debugVariantCount: variants.length,
    isAlternate: variantIndex > 0,
    debugLabel: uiText.labels.debugImageToggle,
  };
}

function buildContent(rowId, copy, lang) {
  const speaker = copy.speaker;
  const contact = CONTACT[lang] || CONTACT.fr;
  const speakerByline = SPEAKER_BYLINE[lang] || SPEAKER_BYLINE.fr;

  switch (rowId) {
    case "line-01":
      return {
        kind: "intro",
        title: INTRO_TITLE,
      };
    case "line-02":
      return {
        kind: "speaker",
        title: speaker.title,
        byline: speakerByline,
        subtitle: speaker.subtitle,
        quote: speaker.quote,
      };
    case "line-03":
      return {
        kind: "paragraphs",
        title: copy.line03Title || LINE03_TITLE_FR,
        paragraphs: copy.line03Paragraphs,
      };
    case "line-04":
      return {
        kind: "paragraphs",
        title: copy.line04Title,
        proverb: copy.line04Proverb,
        paragraphs: copy.line04Paragraphs,
      };
    case "line-05":
      return {
        kind: "paragraphs",
        title: copy.line05Title,
        paragraphs: copy.line05Paragraphs,
      };
    case "line-06":
      return {
        kind: "paragraphs",
        title: copy.line06Title,
        paragraphs: copy.line06Paragraphs,
      };
    case "line-07":
      return {
        kind: "paragraphs",
        title: copy.line07Title || copy.line06Title,
        paragraphs: copy.line07Paragraphs || copy.line06Paragraphs,
      };
    case "line-08":
      return {
        kind: "paragraphs",
        title: copy.line08Title || copy.line07Title || copy.line06Title,
        paragraphs:
          copy.line08Paragraphs || copy.line07Paragraphs || copy.line06Paragraphs,
      };
    case "line-09":
      return {
        kind: "specs",
        title: copy.line09Title || LINE09_TITLE_FR,
        specs: {
          tableHeaders: copy.line09SpecTableHeaders || LINE09_SPEC_TABLE_HEADERS_FR,
          tableRows: copy.line09SpecTableRows || LINE09_SPEC_TABLE_ROWS_FR,
          production: copy.line09Production || LINE09_PRODUCTION_FR,
          price: copy.line09Price || LINE09_PRICE_FR,
          taxNote: copy.line09TaxNote || LINE09_TAX_NOTE_FR,
          sustainableTitle: copy.line09SustainableTitle || LINE09_SUSTAINABLE_TITLE_FR,
          sustainableBody: copy.line09SustainableBody || LINE09_SUSTAINABLE_BODY_FR,
          technicalTitle: copy.line09TechnicalTitle || LINE09_TECHNICAL_TITLE_FR,
          technicalBody: copy.line09TechnicalBody || LINE09_TECHNICAL_BODY_FR,
          usageNote: copy.line09UsageNote || LINE09_USAGE_NOTE_FR,
        },
      };
    case "line-10":
      return {
        kind: "paragraphs",
        title: copy.line10LeftTitle || LINE10_LEFT_TITLE_FR,
        paragraphs: [copy.line10LeftBody || LINE10_LEFT_BODY_FR],
      };
    case "line-11":
      return {
        kind: "legal",
        legal: {
          rightTitle: copy.line10RightTitle || LINE10_RIGHT_TITLE_FR,
          rightBody: copy.line10RightBody || LINE10_RIGHT_BODY_FR,
          modalTitle: copy.line10LegalModalTitle || LINE10_LEGAL_MODAL_TITLE_FR,
          modalBody: copy.line10LegalModalBody || LINE10_LEGAL_MODAL_BODY_FR,
          modalOpenLabel:
            copy.line10LegalModalOpenLabel || LINE10_LEGAL_MODAL_OPEN_LABEL_FR,
          modalBackLabel:
            copy.line10LegalModalBackLabel || LINE10_LEGAL_MODAL_BACK_LABEL_FR,
          modalCloseLabel:
            copy.line10LegalModalCloseLabel || LINE10_LEGAL_MODAL_CLOSE_LABEL_FR,
          singleColumn: true,
        },
      };
    default:
      return {
        kind: "intro",
      };
  }
}

export function getCanonicalHashTarget(hash) {
  if (!hash) {
    return null;
  }

  const cleanHash = hash.replace(/^#/, "");

  if (CANONICAL_ROW_ORDER.includes(cleanHash)) {
    return cleanHash;
  }

  if (ROW_ID_BY_HASH[cleanHash]) {
    return ROW_ID_BY_HASH[cleanHash];
  }

  return null;
}

export function getHashForRowId(rowId) {
  return ROW_HASH_BY_ID[rowId] || rowId;
}

export function getSiteContent(currentState) {
  const lang = currentState.lang;
  const copy = getModeCopy(lang, currentState.mode);
  const uiText = UI_TEXT[lang] || UI_TEXT.fr;

  /** @type {SiteRow[]} */
  const rows = ROW_DEFINITIONS.map((definition) => ({
    id: definition.id,
    key: definition.key,
    classNames: definition.classNames,
    navTarget: definition.id,
    debugLineLabel: `${uiText.rowPrefix} ${CANONICAL_ROW_ORDER.indexOf(definition.id) + 1}`,
    media: buildMedia(definition.id, lang, currentState, uiText),
    content: buildContent(definition.id, copy, lang),
  }));

  /** @type {NavbarItem[]} */
  const navbarItems = rows.map((row, index) => ({
    id: `navbar-${row.id}`,
    href: `#${getHashForRowId(row.id)}`,
    label:
      uiText.navShortLabels?.[row.id] || `${uiText.rowPrefix} ${index + 1}`,
    navTarget: row.navTarget,
  }));

  return {
    uiText,
    navbarItems,
    rows,
  };
}
