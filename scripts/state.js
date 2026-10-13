import { LANGUAGE_PATHS } from "./data/site-languages.js?v=20261013b";

/**
 * Normalize legacy query URLs to the corresponding complete language page.
 *
 * @returns {boolean} True when navigation to another language page has started.
 * @sideEffects Replaces browser location or removes obsolete query parameters.
 */
export function normalizePublicUrl() {
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang")?.toLowerCase().split(/[-_]/)[0];
  const targetPath = LANGUAGE_PATHS[language];
  if (targetPath && document.documentElement.lang !== language) {
    window.location.replace(`${targetPath}${window.location.hash}`);
    return true;
  }

  if (params.has("lang") || params.has("debug") || params.has("mode")) {
    params.delete("lang");
    params.delete("debug");
    params.delete("mode");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }
  return false;
}
