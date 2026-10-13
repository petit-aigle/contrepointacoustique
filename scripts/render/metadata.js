import { getLanguageUrl } from "../data/site-languages.js?v=20261013b";
const LOCALE_BY_LANGUAGE = { fr: "fr_FR", en: "en_GB", es: "es_ES" };

function setMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute("content", content);
}

/**
 * Render static search and sharing metadata for one language page.
 *
 * @param {{language: string, meta: {title: string, description: string}, rows: Array<object>}} siteContent - Localized page metadata.
 * @returns {void}
 * @sideEffects Updates the document language, title, meta tags and canonical link.
 */
export function renderMetadata(siteContent) {
  const { language, meta } = siteContent;
  const url = getLanguageUrl(language);

  document.documentElement.lang = language;
  document.title = meta.title;
  setMetaContent('meta[name="description"]', meta.description);
  setMetaContent('meta[property="og:title"]', meta.title);
  setMetaContent('meta[property="og:description"]', meta.description);
  setMetaContent('meta[property="og:locale"]', LOCALE_BY_LANGUAGE[language]);
  setMetaContent('meta[property="og:url"]', url);
  const media = siteContent.rows.find((row) => row.id === "line-02").media;
  setMetaContent(
    'meta[property="og:image"]',
    new URL(media.previewSrc || media.src, url).href,
  );
  setMetaContent('meta[property="og:image:alt"]', media.alt);
  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((link) => {
      const language = link.getAttribute("hreflang");
      link.setAttribute(
        "href",
        getLanguageUrl(language === "x-default" ? "fr" : language),
      );
    });

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Contrepoint acoustique",
    url: getLanguageUrl("fr"),
    inLanguage: ["fr", "en", "es"],
  };
  document.querySelector('script[type="application/ld+json"]').textContent =
    JSON.stringify(structuredData);
}
