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
 * @property {"intro"|"speaker"|"paragraphs"} kind
 * @property {string=} title
 * @property {string=} byline
 * @property {string=} subtitle
 * @property {string=} quote
 * @property {string[]=} paragraphs
 * @property {{lead: string, address: string[], email: string}=} contact
 */

/**
 * @typedef {Object} SiteRow
 * @property {string} id
 * @property {string} key
 * @property {string[]} classNames
 * @property {string} navTarget
 * @property {RowMedia} media
 * @property {RowContent} content
 */

export const CANONICAL_ROW_ORDER = [
  "line-01",
  "line-02",
  "line-03",
  "line-04",
  "line-05",
  "line-06",
];

const HASH_REDIRECTS = {
  accueil: "line-01",
  enceinte: "line-02",
  conception: "line-01",
  galerie: "line-01",
  "fiche-technique": "line-01",
  contact: "line-01",
};

const UI_TEXT = {
  fr: {
    rowPrefix: "Ligne",
    labels: {
      language: "Langue",
      mode: "Mode texte",
      debugHint: "Mode debug actif.",
      rawFallback: "Le mode Brut est disponible en français uniquement.",
      debugImageToggle: "Basculer l'image de cette ligne",
      debugPanelTitle: "Typo debug",
      debugTitleFont: "Special Font",
      debugTitleCase: "Format des titres",
      debugBodyFont: "Texte normal en Special Font",
    },
    debugTitleCaseModes: {
      current: "Actuel",
      uppercase: "FULL MAJ",
      sentence: "Première lettre",
      lowercase: "minuscules",
    },
    modes: {
      corrected: "Corrigé",
      marketing: "Marketing",
      raw: "Brut",
    },
  },
  en: {
    rowPrefix: "Line",
    labels: {
      language: "Language",
      mode: "Text mode",
      debugHint: "Debug mode enabled.",
      rawFallback: "Raw mode is available in French only.",
      debugImageToggle: "Toggle this line image",
      debugPanelTitle: "Debug Type",
      debugTitleFont: "Special Font",
      debugTitleCase: "Title case",
      debugBodyFont: "Body text in Special Font",
    },
    debugTitleCaseModes: {
      current: "Current",
      uppercase: "FULL CAPS",
      sentence: "First letter",
      lowercase: "lowercase",
    },
    modes: {
      corrected: "Edited",
      marketing: "Marketing",
      raw: "Raw",
    },
  },
  es: {
    rowPrefix: "Línea",
    labels: {
      language: "Idioma",
      mode: "Modo de texto",
      debugHint: "Modo debug activo.",
      rawFallback: "El modo bruto está disponible solo en francés.",
      debugImageToggle: "Cambiar la imagen de esta línea",
      debugPanelTitle: "Tipografía debug",
      debugTitleFont: "Special Font",
      debugTitleCase: "Formato de títulos",
      debugBodyFont: "Texto normal en Special Font",
    },
    debugTitleCaseModes: {
      current: "Actual",
      uppercase: "MAYÚSCULAS",
      sentence: "Primera letra",
      lowercase: "minúsculas",
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
const LINE03_BODY_FR =
  "L’essence de nos baffles invite à la foi en une intégtité sonor et une pureté formelle où la fonction fait la forme. Une conception qui prililégie la clarté et le relief à la puissance brut, une vision minimaliste au profit d’une fidélité rigoureuse.";

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
      line04Paragraphs: [
        "Le haut-parleur large bande unique garde une lecture cohérente du message musical.",
        "Le haut rendement permet une écoute domestique raffinée avec peu de watts.",
        "La rapidité des transitoires et la micro-dynamique donnent une écoute vive et libérée.",
      ],
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
      line04Paragraphs: [
        "Le médium reste au centre de l'expérience, avec une scène stable et lisible.",
        "La faible fatigue d'écoute permet des sessions longues et fluides.",
        "Chaque choix de matière et de forme sert d'abord la musique.",
      ],
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
      line04Paragraphs: [
        "Le haut rendement demande peu de watts pour une écoute domestique.",
        "Cette technologie concours à une rapidité sur les trensitoires et une micro-dynamique vive.",
        "La musique est libérée, douce et nuancée sans fatigue auditive.",
      ],
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
      line03Paragraphs: [
        "A single full-range driver covers bass, mids and highs from one point source.",
        "No conventional cabinet and no complex crossover keeps dynamics lively.",
        "PMMA panel plus open baffle helps reduce resonance and standing waves.",
      ],
      line04Paragraphs: [
        "The high-efficiency driver keeps the musical message direct and coherent.",
        "Only a few watts are enough for refined domestic listening.",
        "Fast transients and micro-dynamics translate into vivid, liberated playback.",
      ],
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
      line03Paragraphs: [
        "Single-driver coherence, open architecture and controlled resonance define the experience.",
        "The midrange carries emotion with stable imaging and low fatigue.",
        "A technical choice made for natural dynamics and vivid expression.",
      ],
      line04Paragraphs: [
        "The object remains visually discreet while sounding direct and alive.",
        "Open construction preserves breathing room and musical timing.",
        "Every visible element supports a simple, honest listening proposition.",
      ],
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
      line03Paragraphs: [
        "Un único transductor cubre graves, medios y agudos como fuente puntual.",
        "Sin caja clásica ni filtro complejo, la microdinámica se mantiene viva.",
        "PMMA y baffle abierto ayudan a limitar resonancias y ondas estacionarias.",
      ],
      line04Paragraphs: [
        "El transductor de alta eficiencia mantiene el mensaje musical directo y coherente.",
        "Solo hacen falta unos pocos vatios para una escucha doméstica refinada.",
        "La rapidez de transitorios y la microdinámica aportan viveza y naturalidad.",
      ],
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
      line03Paragraphs: [
        "Transductor único, arquitectura abierta y control de resonancias.",
        "La escena se mantiene estable y la voz conserva presencia.",
        "Un enfoque técnico para preservar dinamismo y naturalidad.",
      ],
      line04Paragraphs: [
        "La estética se mantiene limpia mientras la escucha sigue siendo inmediata.",
        "La estructura abierta favorece la respiración y el tiempo musical.",
        "Cada elemento visible responde a una intención funcional.",
      ],
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
    src: "Ressource/images/title_and_logo.jpg",
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
        src: "Ressource/images/title_and_logo_left.jpg",
      },
    ],
  },
  "line-02": {
    src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
    width: 6720,
    height: 4480,
    alt: {
      fr: "Paire d'enceintes avec amplificateur.",
      en: "Pair of speakers with amplifier.",
      es: "Pareja de altavoces con amplificador.",
    },
    shape: "pill-left",
    loading: "eager",
    debugVariants: [
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
  },
  "line-06": {
    src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
    width: 3584,
    height: 4480,
    alt: {
      fr: "Détail frontal droit.",
      en: "Right front detail.",
      es: "Detalle frontal derecho.",
    },
    shape: "pill-left",
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
    key: "line-06-speaker-closeup-right-contact",
    classNames: [
      "site-row--line-06",
      "site-row--light",
      "site-row--speaker-closeup-right-contact",
      "site-row--content-first",
    ],
  },
];

function getModeCopy(lang, mode) {
  const languagePack = COPY[lang] || COPY.fr;
  return languagePack[mode] || languagePack.corrected;
}

function buildMedia(rowId, lang, currentState, uiText) {
  const media = MEDIA[rowId];
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
  const variantIndex = currentState.debugImageVariants[rowId] || 0;
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
        title: copy.line03Title,
        paragraphs: copy.line03Paragraphs,
      };
    case "line-04":
      return {
        kind: "paragraphs",
        paragraphs: copy.line04Paragraphs,
      };
    case "line-05":
      return {
        kind: "speaker",
        title: speaker.title,
        byline: speakerByline,
        subtitle: speaker.subtitle,
        quote: speaker.quote,
      };
    case "line-06":
      return {
        kind: "speaker",
        title: speaker.title,
        byline: speakerByline,
        subtitle: speaker.subtitle,
        quote: speaker.quote,
        contact: {
          lead: copy.contactLead,
          address: contact.address,
          email: contact.email,
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

  return HASH_REDIRECTS[cleanHash] || "line-01";
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
    media: buildMedia(definition.id, lang, currentState, uiText),
    content: buildContent(definition.id, copy, lang),
  }));

  /** @type {NavbarItem[]} */
  const navbarItems = rows.map((row, index) => ({
    id: `navbar-${row.id}`,
    href: `#${row.id}`,
    label: `${uiText.rowPrefix} ${index + 1}`,
    navTarget: row.navTarget,
  }));

  return {
    uiText,
    navbarItems,
    rows,
  };
}
