function createNavLink(item) {
  const link = document.createElement("a");
  link.className = "navbar__link";
  link.href = item.href;
  link.dataset.navTarget = item.navTarget;
  link.textContent = item.label;
  return link;
}

export function renderNavbar(refs, state, siteContent, showFallback = false) {
  refs.navbarNav.innerHTML = "";
  siteContent.navbarItems.forEach((item) => {
    refs.navbarNav.appendChild(createNavLink(item));
  });

  refs.languageLabel.textContent = siteContent.uiText.labels.language;
  refs.modeLabel.textContent = siteContent.uiText.labels.mode;
  refs.languageSelect.value = state.lang;
  refs.modeSelect.value = state.mode;

  Array.from(refs.modeSelect.options).forEach((option) => {
    option.textContent = siteContent.uiText.modes[option.value];
  });

  refs.debugControls.hidden = !state.debug;
  refs.debugFlag.hidden = !state.debug;
  refs.debugFlag.setAttribute(
    "aria-expanded",
    String(Boolean(state.debug && state.debugTypography.panelOpen))
  );
  refs.debugPanel.hidden = !state.debug || !state.debugTypography.panelOpen;
  refs.debugPanelTitle.textContent = siteContent.uiText.labels.debugPanelTitle;
  refs.debugTitleFontLabel.textContent = siteContent.uiText.labels.debugTitleFont;
  refs.debugTitleCaseLabel.textContent = siteContent.uiText.labels.debugTitleCase;
  refs.debugBodyFontLabel.textContent = siteContent.uiText.labels.debugBodyFont;
  refs.debugTitleFontToggle.checked = state.debugTypography.titleSpecialFont;
  refs.debugTitleCaseSelect.value = state.debugTypography.titleCaseMode;
  refs.debugBodyFontToggle.checked = state.debugTypography.bodySpecialFont;

  Array.from(refs.debugTitleCaseSelect.options).forEach((option) => {
    option.textContent =
      siteContent.uiText.debugTitleCaseModes[option.value] || option.textContent;
  });

  refs.debugMessage.hidden = !showFallback;
  refs.debugMessage.textContent = showFallback
    ? siteContent.uiText.labels.rawFallback
    : "";
}
