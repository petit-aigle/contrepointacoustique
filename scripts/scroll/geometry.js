const MIN_FOCUS_OFFSET_PX = 24;
const MAX_FOCUS_OFFSET_PX = 72;
const FOCUS_OFFSET_VIEWPORT_RATIO = 0.08;
const DEFAULT_FOCUS_HYSTERESIS_PX = 28;

function getElementAbsoluteTop(element) {
  return window.scrollY + element.getBoundingClientRect().top;
}

function getDistanceToRect(clientY, rect) {
  if (clientY < rect.top) {
    return rect.top - clientY;
  }

  if (clientY > rect.bottom) {
    return clientY - rect.bottom;
  }

  return 0;
}

/**
 * Return the section element that matches the ligne id.
 *
 * @param {HTMLElement[]} rowSections - Ordered ligne section elements.
 * @param {string} rowId - Canonical ligne id.
 * @returns {HTMLElement|null} Matching section, when present.
 * @sideEffects None.
 */
export function getRowSectionById(rowSections, rowId) {
  return rowSections.find((section) => section.id === rowId) || null;
}

/**
 * Return the current bottom edge of the sticky navbar.
 *
 * @param {HTMLElement|null} navbar - Sticky navbar element.
 * @returns {number} Viewport offset in pixels.
 * @sideEffects Reads the current layout.
 */
export function getStickyNavbarOffset(navbar) {
  if (!navbar) {
    return 0;
  }

  return Math.max(0, navbar.getBoundingClientRect().bottom);
}

/**
 * Resolve the section used to align a ligne after explicit navigation.
 *
 * @param {HTMLElement|null} rowSection - Ligne section element.
 * @returns {HTMLElement|null} Ligne section element.
 * @sideEffects None.
 */
export function getRowNavigationTarget(rowSection) {
  return rowSection || null;
}

/**
 * Return the scroll position that places a ligne below the sticky navbar.
 *
 * @param {HTMLElement|null} rowSection - Ligne section element.
 * @param {number} navbarOffset - Current sticky navbar bottom offset.
 * @returns {number} Absolute document scroll position.
 * @sideEffects Reads the current layout.
 */
export function getRowNavigationScrollY(rowSection, navbarOffset = 0) {
  const target = getRowNavigationTarget(rowSection);
  if (!target) {
    return window.scrollY;
  }

  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const targetY = getElementAbsoluteTop(target) - Math.max(0, navbarOffset);
  return Math.min(maxScrollY, Math.max(0, targetY));
}

/**
 * Return the ligne selected by a stable focus point in the visible viewport.
 *
 * @param {HTMLElement[]} rowSections - Ordered ligne section elements.
 * @param {{
 *   navbarOffset?: number,
 *   currentRowId?: string|null,
 *   hysteresisPx?: number
 * }} [options] - Focus position and stability settings.
 * @returns {HTMLElement|null} Focused ligne section.
 * @sideEffects Reads the current layout.
 */
export function getRowAtViewportFocus(rowSections, options = {}) {
  if (!rowSections.length) {
    return null;
  }

  const navbarOffset = Math.max(0, options.navbarOffset || 0);
  const availableHeight = Math.max(0, window.innerHeight - navbarOffset);
  const focusOffset = Math.min(
    MAX_FOCUS_OFFSET_PX,
    Math.max(MIN_FOCUS_OFFSET_PX, availableHeight * FOCUS_OFFSET_VIEWPORT_RATIO)
  );
  const focusClientY = navbarOffset + focusOffset;
  const hysteresisPx = Number.isFinite(options.hysteresisPx)
    ? Math.max(0, options.hysteresisPx)
    : DEFAULT_FOCUS_HYSTERESIS_PX;
  const currentRow = getRowSectionById(
    rowSections,
    options.currentRowId || ""
  );
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );

  if (window.scrollY <= 1) {
    return rowSections[0];
  }

  if (window.scrollY >= maxScrollY - 1) {
    return rowSections[rowSections.length - 1];
  }

  if (currentRow) {
    const currentRect = currentRow.getBoundingClientRect();
    if (
      focusClientY >= currentRect.top - hysteresisPx &&
      focusClientY <= currentRect.bottom + hysteresisPx
    ) {
      return currentRow;
    }
  }

  let nearestRow = rowSections[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  rowSections.forEach((rowSection) => {
    const distance = getDistanceToRect(
      focusClientY,
      rowSection.getBoundingClientRect()
    );
    if (distance >= nearestDistance) {
      return;
    }

    nearestDistance = distance;
    nearestRow = rowSection;
  });

  return nearestRow;
}

/**
 * Capture a ligne top edge so layout refreshes can preserve viewport position.
 *
 * @param {HTMLElement|null} rowSection - Ligne section element.
 * @param {number} [viewportOffset=0] - Stable content viewport top edge.
 * @returns {{rowId: string, contentTop: number}|null} Viewport anchor snapshot.
 * @sideEffects Reads the current layout.
 */
export function captureRowViewportAnchor(rowSection, viewportOffset = 0) {
  if (!rowSection?.id) {
    return null;
  }

  return {
    rowId: rowSection.id,
    contentTop:
      rowSection.getBoundingClientRect().top - Math.max(0, viewportOffset),
  };
}

/**
 * Restore a previously captured ligne top edge after a layout refresh.
 *
 * @param {HTMLElement[]} rowSections - Ordered ligne section elements.
 * @param {{rowId: string, contentTop: number}|null} anchor - Saved viewport anchor.
 * @param {number} [viewportOffset=0] - Current content viewport top edge.
 * @returns {boolean} Whether the document scroll position changed.
 * @sideEffects May update the native document scroll position.
 */
export function restoreRowViewportAnchor(
  rowSections,
  anchor,
  viewportOffset = 0
) {
  if (!anchor || !Number.isFinite(anchor.contentTop)) {
    return false;
  }

  const rowSection = getRowSectionById(rowSections, anchor.rowId);
  if (!rowSection) {
    return false;
  }

  const currentContentTop =
    rowSection.getBoundingClientRect().top - Math.max(0, viewportOffset);
  const deltaY = currentContentTop - anchor.contentTop;
  if (Math.abs(deltaY) < 1) {
    return false;
  }

  window.scrollBy({ top: deltaY, behavior: "auto" });
  return true;
}
