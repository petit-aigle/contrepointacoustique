const TRANSLATION_URLS = {
  fr: new URL("./fr.json?v=20260717a", import.meta.url),
  en: new URL("./en.json?v=20260717a", import.meta.url),
  es: new URL("./es.json?v=20260717a", import.meta.url),
};

async function loadTranslation(language, url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Unable to load the ${language} translation (${response.status}).`
    );
  }

  return response.json();
}

async function loadOptionalTranslation(language, url) {
  try {
    return [language, await loadTranslation(language, url)];
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const frenchTranslation = await loadTranslation("fr", TRANSLATION_URLS.fr);
const optionalTranslationEntries = await Promise.all(
  Object.entries(TRANSLATION_URLS)
    .filter(([language]) => language !== "fr")
    .map(([language, url]) => loadOptionalTranslation(language, url))
);
const translationEntries = [
  ["fr", frenchTranslation],
  ...optionalTranslationEntries.filter(Boolean),
];

export const TRANSLATIONS = Object.fromEntries(translationEntries);
