function createNavLink(item) {
  const link = document.createElement("a");
  link.className = "navbar__link";
  link.href = item.href;
  link.dataset.navTarget = item.navTarget;
  link.textContent = item.label;
  return link;
}

/**
 * Render the localized navbar and debug controls.
 *
 * @param {Record<string, HTMLElement>} refs - Navbar DOM references.
 * @param {object} state - Current application and debug state.
 * @param {object} siteContent - Localized navbar and interface content.
 * @param {boolean} showFallback - Whether to display the mode fallback message.
 * @returns {void}
 * @sideEffects Updates the navbar DOM.
 */
export function renderNavbar(refs, state, siteContent, showFallback = false) {
  refs.navbarNav.innerHTML = "";
  refs.navbarNav.setAttribute(
    "aria-label",
    siteContent.uiText.labels.mainNavigation
  );
  siteContent.navbarItems.forEach((item) => {
    refs.navbarNav.appendChild(createNavLink(item));
  });

  refs.languageLabel.textContent = siteContent.uiText.labels.language;
  refs.modeLabel.textContent = siteContent.uiText.labels.mode;
  refs.navbarMenuToggleText.textContent =
    siteContent.uiText.labels.menuToggle || "";
  refs.navbarMenuToggle.setAttribute(
    "aria-label",
    siteContent.uiText.labels.menuToggle || ""
  );
  refs.languageSelect.value = state.lang;
  refs.modeSelect.value = state.mode;

  Array.from(refs.modeSelect.options).forEach((option) => {
    option.textContent = siteContent.uiText.modes[option.value];
  });

  refs.debugControls.hidden = !state.debug;
  refs.debugControls.style.display = state.debug ? "flex" : "none";
  refs.debugControls.setAttribute("aria-hidden", String(!state.debug));
  refs.modeSelect.disabled = !state.debug;
  refs.debugFlag.hidden = !state.debug;
  refs.debugFlag.setAttribute(
    "aria-expanded",
    String(Boolean(state.debug && state.debugTypography.panelOpen))
  );
  refs.debugPanel.hidden = !state.debug || !state.debugTypography.panelOpen;
  refs.debugPanelTitle.textContent = siteContent.uiText.labels.debugPanelTitle;
  refs.debugToolbarTitle.textContent = siteContent.uiText.labels.debugToolbarTitle;
  refs.debugManualTitle.textContent = siteContent.uiText.labels.debugManualTitle;
  refs.debugTitleFontLabel.textContent = siteContent.uiText.labels.debugTitleFont;
  refs.debugTitleCaseLabel.textContent = siteContent.uiText.labels.debugTitleCase;
  refs.debugBodyFontLabel.textContent = siteContent.uiText.labels.debugBodyFont;
  refs.debugBoldButtonText.textContent = siteContent.uiText.labels.debugBold;
  refs.debugItalicButtonText.textContent = siteContent.uiText.labels.debugItalic;
  refs.debugAlignButtonText.textContent = siteContent.uiText.labels.debugAlign;
  refs.debugFontIncreaseButtonText.textContent =
    siteContent.uiText.labels.debugFontIncrease;
  refs.debugFontDecreaseButtonText.textContent =
    siteContent.uiText.labels.debugFontDecrease;
  refs.debugManualBoldText.textContent = siteContent.uiText.labels.debugManualBold;
  refs.debugManualItalicText.textContent =
    siteContent.uiText.labels.debugManualItalic;
  refs.debugManualAlignText.textContent = siteContent.uiText.labels.debugManualAlign;
  refs.debugManualFontUpText.textContent =
    siteContent.uiText.labels.debugManualFontIncrease;
  refs.debugManualFontDownText.textContent =
    siteContent.uiText.labels.debugManualFontDecrease;
  refs.debugManualImageText.textContent =
    siteContent.uiText.labels.debugManualImageResize;
  refs.debugTitleFontToggle.checked = state.debugTypography.titleSpecialFont;
  refs.debugTitleCaseSelect.value = state.debugTypography.titleCaseMode;
  refs.debugBodyFontToggle.checked = state.debugTypography.bodySpecialFont;
  refs.debugImageHeightToggle.checked = state.debugImageTools.resizeEnabled;
  refs.debugImageHeightLabel.textContent =
    siteContent.uiText.labels.debugImageResize;
  refs.debugResetButton.textContent = siteContent.uiText.labels.debugReset;

  Array.from(refs.debugTitleCaseSelect.options).forEach((option) => {
    option.textContent =
      siteContent.uiText.debugTitleCaseModes[option.value] || option.textContent;
  });

  refs.debugMessage.hidden = !showFallback;
  refs.debugMessage.textContent = showFallback
    ? siteContent.uiText.labels.rawFallback
    : "";
}
