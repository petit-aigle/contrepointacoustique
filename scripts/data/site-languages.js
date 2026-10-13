/** Public languages and the paths of their complete HTML pages. */
export const LANGUAGE_PATHS = { fr: "/", en: "/en/", es: "/es/" };

/**
 * Return the canonical public URL of a language version.
 *
 * @param {string} language - Supported language code.
 * @returns {string} Absolute URL of the complete language page.
 * @sideEffects None.
 */
export function getLanguageUrl(language) {
  return new URL(
    LANGUAGE_PATHS[language] || LANGUAGE_PATHS.fr,
    "https://contrepointacoustique.com",
  ).href;
}
