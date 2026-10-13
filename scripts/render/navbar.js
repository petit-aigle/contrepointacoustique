import { LANGUAGE_PATHS } from "../data/site-languages.js?v=20261013b";

function createNavLink(item) {
  const link = document.createElement("a");
  link.className = "navbar__link";
  link.href = item.href;
  link.dataset.navTarget = item.navTarget;
  link.textContent = item.label;
  return link;
}

/**
 * Render the localized navbar and language links.
 *
 * @param {Record<string, HTMLElement>} refs - Navbar DOM references.
 * @param {{lang: string}} state - Active language.
 * @param {object} siteContent - Localized navbar and interface content.
 * @returns {void}
 * @sideEffects Replaces navbar links and updates control labels.
 */
export function renderNavbar(refs, state, siteContent) {
  refs.navbarNav.innerHTML = "";
  refs.navbarNav.setAttribute(
    "aria-label",
    siteContent.uiText.labels.mainNavigation,
  );
  siteContent.navbarItems.forEach((item) => {
    refs.navbarNav.appendChild(createNavLink(item));
  });

  refs.languageNav.setAttribute(
    "aria-label",
    siteContent.uiText.labels.language,
  );
  Object.entries(LANGUAGE_PATHS).forEach(([language, path]) => {
    const link = document.createElement("a");
    link.className = "navbar__language";
    link.href = path;
    link.lang = language;
    link.hreflang = language;
    link.textContent = language.toUpperCase();
    link.setAttribute("aria-label", siteContent.uiText.languageNames[language]);
    if (language === state.lang) {
      link.setAttribute("aria-current", "page");
    }
    refs.languageNav.appendChild(link);
  });
  refs.navbarMenuToggleText.textContent = siteContent.uiText.labels.menuToggle;
  refs.navbarMenuToggle.setAttribute(
    "aria-label",
    siteContent.uiText.labels.menuToggle,
  );
}
