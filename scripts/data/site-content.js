import { TRANSLATIONS } from "./translations/index.js?v=20260717a";

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
 * @property {Array<{src: string, width?: number, height?: number, altKey?: string, shape?: "brand"|"pill-left"|"pill-right"|"circle"}>=} debugVariants
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
 * @property {Record<string, string>=} editorLabels
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

const MEDIA_ALT_KEY_BY_SOURCE = {
  "Ressource/images/title_and_logo_left.jpg": "brand",
  "Ressource/images/title_and_logo.jpg": "brand",
  "Ressource/images/enceinte_double.jpg": "speakerPair",
  "Ressource/images/enceinte_face.jpg": "speakerFront",
  "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg":
    "speakerPairAmplifier",
  "Ressource/images/enceinte_vue.jpg": "speakerFull",
  "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg":
    "speakerRearLeftAndRight",
  "Ressource/images/enceinte_left_plus_chaise.jpg": "speakerChair",
  "Ressource/images/enceinte_vue_face_left.jpg": "speakerFrontLeft",
  "Ressource/images/enceinte_back_little_left.jpg": "speakerRearLeftClose",
  "Ressource/images/enceinte_vue_back_left_close.jpg": "speakerRearLeftDetail",
  "Ressource/images/enceinte_vue_back_left.jpg": "speakerRearLeft",
  "Ressource/images/enceinte_vue_super_face_close_left.jpg":
    "speakerFrontLeftDetail",
  "Ressource/images/enceinte_vue_super_face_close_right.jpg":
    "speakerFrontRightDetail",
  "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg":
    "speakerCorner",
  "Ressource/images/enceinte_vue_super_face_corner_close_left_zoom.jpg":
    "speakerCornerZoom",
  "Ressource/images/speaker-top.jpg": "speakerTop",
  "Ressource/images/speaker.jpg": "speakerPerspective",
  "Ressource/images/speaker-bot.jpg": "speakerBottom",
  "Ressource/images/camion.png": "deliveryTruck",
};

const MEDIA = {
  "line-01": {
    src: "Ressource/images/title_and_logo_left.jpg",
    width: 2947,
    height: 2934,
    shape: "brand",
    debugVariants: [
      {
        src: "Ressource/images/title_and_logo.jpg",
      },
    ],
  },
  "line-02": {
    src: "Ressource/images/enceinte_double.jpg",
    width: 6720,
    height: 4480,
    shape: "pill-left",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_face.jpg",
        width: 5600,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue.jpg",
        width: 6720,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 5600,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_plus_chaise.jpg",
        width: 9632,
        height: 7706,
      },
      {
        src: "Ressource/images/enceinte_vue_face_left.jpg",
        width: 4299,
        height: 5373,
      },
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_vue_back_left_close.jpg",
        width: 4480,
        height: 5600,
      },
      {
        src: "Ressource/images/enceinte_vue_back_left.jpg",
        width: 4480,
        height: 5600,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left_zoom.jpg",
        width: 2865,
        height: 2653,
      },
    ],
  },
  "line-03": {
    src: "Ressource/images/enceinte_vue.jpg",
    width: 5792,
    height: 8688,
    shape: "circle",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_vue_back_left_close.jpg",
        width: 4480,
        height: 5600,
      },
      {
        src: "Ressource/images/enceinte_vue_back_left.jpg",
        width: 4480,
        height: 5600,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-04": {
    src: "Ressource/images/enceinte_vue_back_left_close.jpg",
    width: 4480,
    height: 5600,
    shape: "circle",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_vue_back_left.jpg",
        width: 4480,
        height: 5600,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-05": {
    src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
    width: 3584,
    height: 4480,
    shape: "pill-right",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        altKey: "speakerRearAndFront",
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-06": {
    src: "Ressource/images/enceinte_back_little_left.jpg",
    width: 6286,
    height: 5028,
    shape: "pill-left",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        altKey: "speakerRearAndFront",
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-07": {
    src: "Ressource/images/enceinte_vue_super_face_corner_close_left_zoom.jpg",
    width: 2865,
    height: 2653,
    shape: "pill-left",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        altKey: "speakerRearAndFront",
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-08": {
    src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
    width: 6720,
    height: 4480,
    shape: "pill-left",
    debugVariants: [
      {
        src: "Ressource/images/enceinte_back_little_left.jpg",
        width: 6286,
        height: 5028,
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
        width: 3584,
        height: 4480,
      },
      {
        src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
        width: 6720,
        height: 4480,
        altKey: "speakerRearAndFront",
      },
      {
        src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
        width: 3584,
        height: 4480,
      },
    ],
  },
  "line-09": {
    src: "Ressource/images/speaker-top.jpg",
    width: 800,
    height: 800,
    shape: "pill-right",
    debugVariants: [
      {
        src: "Ressource/images/speaker.jpg",
        width: 800,
        height: 800,
      },
      {
        src: "Ressource/images/speaker-top.jpg",
        width: 800,
        height: 800,
      },
      {
        src: "Ressource/images/speaker-bot.jpg",
        width: 800,
        height: 800,
      },
      {
        src: "Ressource/images/enceinte_face.jpg",
        width: 5600,
        height: 4480,
      },
    ],
  },
  "line-10": {
    src: "Ressource/images/camion.png",
    width: 1600,
    height: 1200,
    shape: "brand",
  },
};

const ROW_DEFINITIONS = [
  {
    id: "line-01",
    key: "line-01-brand-intro",
    kind: "intro",
    classNames: ["site-row--line-01", "site-row--light", "site-row--brand-intro"],
  },
  {
    id: "line-02",
    key: "line-02-speaker-hero",
    kind: "speaker",
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
    kind: "paragraphs",
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
    kind: "paragraphs",
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
    kind: "paragraphs",
    classNames: [
      "site-row--line-05",
      "site-row--light",
      "site-row--speaker-closeup-left",
    ],
  },
  {
    id: "line-06",
    key: "line-06-speaker-closeup-right",
    kind: "paragraphs",
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
    kind: "paragraphs",
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
    kind: "paragraphs",
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
    kind: "specs",
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
    kind: "paragraphs",
    classNames: [
      "site-row--line-10",
      "site-row--dark",
      "site-row--contact",
    ],
  },
  {
    id: "line-11",
    key: "line-11-legal",
    kind: "legal",
    classNames: [
      "site-row--line-11",
      "site-row--dark",
      "site-row--legal",
      "site-row--no-media",
    ],
  },
];

function getMediaAlt(source, translation, contextualAltKey) {
  const resolvedAltKey = contextualAltKey || MEDIA_ALT_KEY_BY_SOURCE[source];
  if (!resolvedAltKey) {
    return "";
  }

  return translation.mediaAlts[resolvedAltKey] || "";
}

function buildMedia(rowId, translation, currentState) {
  const media = MEDIA[rowId];
  if (!media) {
    return undefined;
  }

  const variants = [
    {
      src: media.src,
      width: media.width,
      height: media.height,
      altKey: media.altKey,
      shape: media.shape,
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
    alt: getMediaAlt(activeVariant.src, translation, activeVariant.altKey),
    shape: activeVariant.shape || media.shape,
    debugToggle: currentState.debug && variants.length > 1 ? rowId : undefined,
    debugVariantCount: variants.length,
    isAlternate: variantIndex > 0,
    debugLabel: translation.ui.labels.debugImageToggle,
  };
}

function buildContent(rowDefinition, translation, mode) {
  const rowId = rowDefinition.id;
  const baseContent = translation.rows[rowId] || {};
  const modeContent = translation.modes[mode] || translation.modes.corrected || {};
  const rowOverride = modeContent[rowId] || {};
  const content = {
    kind: rowDefinition.kind,
    editorLabels: translation.ui.editorLabels,
    ...baseContent,
    ...rowOverride,
  };

  if (baseContent.specs || rowOverride.specs) {
    content.specs = {
      ...(baseContent.specs || {}),
      ...(rowOverride.specs || {}),
    };
  }

  if (baseContent.legal || rowOverride.legal) {
    content.legal = {
      ...(baseContent.legal || {}),
      ...(rowOverride.legal || {}),
      singleColumn: rowId === "line-11",
    };
  }

  return content;
}

/**
 * Resolve a URL hash to a canonical ligne identifier.
 *
 * @param {string} hash - Hash to resolve, with or without the leading marker.
 * @returns {string|null} Canonical ligne identifier, or null when unknown.
 * @sideEffects None.
 */
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

/**
 * Return the public hash associated with a ligne identifier.
 *
 * @param {string} rowId - Canonical ligne identifier.
 * @returns {string} Public hash value without the leading marker.
 * @sideEffects None.
 */
export function getHashForRowId(rowId) {
  return ROW_HASH_BY_ID[rowId] || rowId;
}

/**
 * Compose the localized navbar and lignes for the current application state.
 *
 * @param {{lang: string, mode: string, debug: boolean, debugImageVariants: Record<string, number>}} currentState - Active language, text mode, and debug state.
 * @returns {{language: string, meta: object, uiText: object, navbarItems: NavbarItem[], rows: SiteRow[]}} Localized site content ready for rendering.
 * @sideEffects None.
 */
export function getSiteContent(currentState) {
  const requestedLanguage = currentState.lang;
  const language = TRANSLATIONS[requestedLanguage] ? requestedLanguage : "fr";
  const translation = TRANSLATIONS[language];
  const uiText = translation.ui;

  /** @type {SiteRow[]} */
  const rows = ROW_DEFINITIONS.map((definition) => ({
    id: definition.id,
    key: definition.key,
    classNames: definition.classNames,
    navTarget: definition.id,
    debugLineLabel: `${uiText.rowPrefix} ${CANONICAL_ROW_ORDER.indexOf(definition.id) + 1}`,
    media: buildMedia(definition.id, translation, currentState),
    content: buildContent(definition, translation, currentState.mode),
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
    language,
    meta: translation.meta,
    uiText,
    navbarItems,
    rows,
  };
}
