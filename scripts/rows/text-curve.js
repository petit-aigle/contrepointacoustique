const TEXT_CLEARANCE_PX = 24;
const SIDE_BY_SIDE_QUERY = "(min-width: 861px)";

function getTextBounds(element) {
  const bounds = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;

    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (rect.width > 0 && rect.height > 0) bounds.push(rect);
    }
  }

  return bounds;
}

function getSafeCornerRadius(panelBounds, textBounds) {
  let radius = Math.min(panelBounds.width, panelBounds.height);

  for (const bounds of textBounds) {
    const leftSpace = Math.max(
      0,
      bounds.left - panelBounds.left - TEXT_CLEARANCE_PX,
    );
    const bottomSpace = Math.max(
      0,
      panelBounds.bottom - bounds.bottom - TEXT_CLEARANCE_PX,
    );

    // Keep the lower-left corner of each padded text line inside the white curve.
    const safeRadius =
      leftSpace + bottomSpace + Math.sqrt(2 * leftSpace * bottomSpace);
    radius = Math.min(radius, safeRadius);
  }

  return Math.floor(radius * 4) / 4;
}

function updateCornerRadius(panel, text, sideBySideQuery) {
  const panelBounds = panel.getBoundingClientRect();
  if (!panelBounds.width || !panelBounds.height) return;

  const radius = sideBySideQuery.matches
    ? getSafeCornerRadius(panelBounds, getTextBounds(text))
    : 0;
  const value = `${radius}px`;
  if (panel.style.getPropertyValue("--row-text-corner-radius") !== value) {
    panel.style.setProperty("--row-text-corner-radius", value);
  }
}

/**
 * Fit the rounded white background of line-08 around its rendered text.
 *
 * @returns {() => void} Cleanup that stops observing the ligne and its typography.
 * @sideEffects Observes size and font changes and updates one decorative CSS variable.
 */
export function initializeAdaptiveTextCurve() {
  const panel = document.querySelector("#line-08 [data-row-text]");
  const text = panel?.querySelector(".site-row__content-inner");
  if (!panel || !text) return () => {};

  const sideBySideQuery = window.matchMedia(SIDE_BY_SIDE_QUERY);
  const update = () => updateCornerRadius(panel, text, sideBySideQuery);
  const observer = new ResizeObserver(update);
  observer.observe(panel);
  observer.observe(text);
  sideBySideQuery.addEventListener("change", update);
  document.fonts.addEventListener("loadingdone", update);
  update();

  return () => {
    observer.disconnect();
    sideBySideQuery.removeEventListener("change", update);
    document.fonts.removeEventListener("loadingdone", update);
  };
}
