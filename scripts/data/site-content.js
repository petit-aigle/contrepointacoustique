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
 * @property {string} openLabel
 * @property {string=} previewSrc
 * @property {string=} srcset
 * @property {string=} sizes
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
 * @property {boolean} contentFirst
 * @property {string[]} classNames
 * @property {string} navTarget
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

const NAVBAR_ROW_IDS = ["line-02", "line-09", "line-10", "line-11"];
const TABULA_NAVBAR_ROW_IDS = new Set([
  "line-02",
  "line-03",
  "line-04",
  "line-05",
  "line-06",
  "line-07",
  "line-08",
]);

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
  Object.entries(ROW_HASH_BY_ID).map(([rowId, hash]) => [hash, rowId]),
);

const MEDIA_ALT_KEY_BY_SOURCE = {
  "/Ressource/images/title_and_logo_left.jpg": "brand",
  "/Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg":
    "speakerPairAmplifier",
  "/Ressource/images/enceinte_vue.jpg": "speakerFull",
  "/Ressource/images/enceinte_back_little_left.jpg": "speakerRearLeftClose",
  "/Ressource/images/enceinte_vue_back_left_close.jpg": "speakerRearLeftDetail",
  "/Ressource/images/enceinte_vue_super_face_close_left.jpg":
    "speakerFrontLeftDetail",
  "/Ressource/images/enceinte_vue_super_face_close_right.jpg":
    "speakerFrontRightDetail",
  "/Ressource/images/enceinte_vue_super_face_corner_close_left_zoom_2.jpg":
    "speakerCornerZoom",
  "/Ressource/images/speaker-top.jpg": "speakerTop",
  "/Ressource/images/camion.png": "deliveryTruck",
};

const MEDIA = {
  "line-01": {
    src: "/Ressource/images/title_and_logo_left.jpg",
    width: 3000,
    height: 647,
    shape: "brand",
  },
  "line-02": {
    src: "/Ressource/images/enceinte_vue_super_face_close_right.jpg",
    width: 3584,
    height: 4480,
    shape: "pill-left",
  },
  "line-03": {
    src: "/Ressource/images/enceinte_vue.jpg",
    width: 6720,
    height: 4480,
    shape: "circle",
  },
  "line-04": {
    src: "/Ressource/images/enceinte_vue_back_left_close.jpg",
    width: 4480,
    height: 5600,
    shape: "circle",
  },
  "line-05": {
    src: "/Ressource/images/enceinte_vue_super_face_close_left.jpg",
    width: 3584,
    height: 4480,
    shape: "pill-right",
  },
  "line-06": {
    src: "/Ressource/images/enceinte_back_little_left.jpg",
    width: 6286,
    height: 5028,
    shape: "pill-left",
  },
  "line-07": {
    src: "/Ressource/images/enceinte_vue_super_face_corner_close_left_zoom_2.jpg",
    width: 2865,
    height: 2653,
    shape: "pill-left",
  },
  "line-08": {
    src: "/Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
    width: 6720,
    height: 4480,
    shape: "pill-left",
  },
  "line-09": {
    src: "/Ressource/images/speaker-top.jpg",
    width: 800,
    height: 800,
    shape: "pill-right",
  },
  "line-10": {
    src: "/Ressource/images/camion.png",
    width: 1536,
    height: 1024,
    shape: "brand",
  },
};

const ROW_DEFINITIONS = [
  {
    id: "line-01",
    contentFirst: false,
    key: "line-01-brand-intro",
    kind: "intro",
    classNames: [
      "site-row--line-01",
      "site-row--light",
      "site-row--brand-intro",
    ],
  },
  {
    id: "line-02",
    contentFirst: true,
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
    contentFirst: false,
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
    contentFirst: true,
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
    contentFirst: false,
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
    contentFirst: true,
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
    contentFirst: false,
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
    contentFirst: false,
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
    contentFirst: true,
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
    contentFirst: false,
    key: "line-10-contact",
    kind: "paragraphs",
    classNames: ["site-row--line-10", "site-row--dark", "site-row--contact"],
  },
  {
    id: "line-11",
    contentFirst: false,
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

function buildMedia(rowId, translation) {
  const media = MEDIA[rowId];
  if (!media) {
    return undefined;
  }

  return {
    ...media,
    alt: getMediaAlt(media.src, translation, media.altKey),
    openLabel: translation.ui.labels.openImage,
  };
}

function buildContent(rowDefinition, translation) {
  const rowId = rowDefinition.id;
  const content = { kind: rowDefinition.kind, ...translation.rows[rowId] };

  if (content.legal) {
    content.legal = { ...content.legal, singleColumn: rowId === "line-11" };
  }

  return content;
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
 * Return the navbar target representing one ligne.
 *
 * @param {string} rowId - Canonical ligne identifier.
 * @returns {string|null} Visible navbar target, or null when none applies.
 * @sideEffects None.
 */
export function getNavbarTargetForRowId(rowId) {
  if (TABULA_NAVBAR_ROW_IDS.has(rowId)) {
    return "line-02";
  }

  return NAVBAR_ROW_IDS.includes(rowId) ? rowId : null;
}

/**
 * Compose the localized navbar and lignes for the current application state.
 *
 * @param {{lang: string}} currentState - Active language.
 * @param {object} translation - Reference translation for the requested language.
 * @returns {{language: string, meta: object, uiText: object, navbarItems: NavbarItem[], rows: SiteRow[]}} Localized site content ready for rendering.
 * @sideEffects None.
 */
export function getSiteContent(currentState, translation) {
  const language = currentState.lang;
  const uiText = translation.ui;

  /** @type {SiteRow[]} */
  const rows = ROW_DEFINITIONS.map((definition) => ({
    id: definition.id,
    key: definition.key,
    contentFirst: definition.contentFirst,
    classNames: definition.classNames,
    navTarget: definition.id,
    media: buildMedia(definition.id, translation),
    content: buildContent(definition, translation),
  }));

  /** @type {NavbarItem[]} */
  const navbarItems = rows
    .filter((row) => NAVBAR_ROW_IDS.includes(row.id))
    .map((row) => ({
      id: `navbar-${row.id}`,
      href: `#${getHashForRowId(row.id)}`,
      label:
        uiText.navShortLabels?.[row.id] ||
        `${uiText.rowPrefix} ${CANONICAL_ROW_ORDER.indexOf(row.id) + 1}`,
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
