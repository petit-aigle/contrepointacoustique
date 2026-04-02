function getElementAbsoluteRect(element) {
  const rect = element.getBoundingClientRect();
  const top = window.scrollY + rect.top;

  return {
    top,
    bottom: top + rect.height,
    center: top + rect.height / 2,
  };
}

function getRowFallbackTarget(rowSection) {
  return rowSection.querySelector("[data-row-text]") || rowSection;
}

function getRowTopFallbackTarget(rowSection) {
  return rowSection.querySelector("[data-row-media]") || rowSection;
}

/**
 * Return the section element that matches the row id.
 *
 * @param {HTMLElement[]} rowSections
 * @param {string} rowId
 * @returns {HTMLElement|null}
 */
export function getRowSectionById(rowSections, rowId) {
  return rowSections.find((section) => section.id === rowId) || null;
}

/**
 * Return the absolute Y coordinate at the center of the viewport.
 *
 * @returns {number}
 */
export function getViewportCenterY() {
  return window.scrollY + window.innerHeight / 2;
}

/**
 * Resolve the preferred center target for a ligne.
 *
 * @param {HTMLElement|null} rowSection
 * @returns {HTMLElement|null}
 */
export function getRowAnchorTarget(rowSection) {
  if (!rowSection) {
    return null;
  }

  return (
    rowSection.querySelector("[data-row-media] .site-row__figure") ||
    getRowFallbackTarget(rowSection)
  );
}

/**
 * Resolve the preferred top-aligned target for a ligne.
 *
 * @param {HTMLElement|null} rowSection
 * @returns {HTMLElement|null}
 */
export function getRowTopAnchorTarget(rowSection) {
  if (!rowSection) {
    return null;
  }

  return (
    rowSection.querySelector("[data-row-media] .site-row__figure") ||
    getRowTopFallbackTarget(rowSection)
  );
}

/**
 * Return the absolute center Y of an element.
 *
 * @param {HTMLElement|null} element
 * @returns {number|null}
 */
export function getElementCenterY(element) {
  if (!element) {
    return null;
  }

  return getElementAbsoluteRect(element).center;
}

/**
 * Return the scrollY needed to center a ligne target in the viewport.
 *
 * @param {HTMLElement|null} rowSection
 * @returns {number}
 */
export function getRowScrollYForAnchor(rowSection) {
  const anchorCenterY = getElementCenterY(getRowAnchorTarget(rowSection));
  if (!Number.isFinite(anchorCenterY)) {
    return window.scrollY;
  }

  return anchorCenterY - window.innerHeight / 2;
}

/**
 * Return the scrollY needed to align a ligne target with the viewport top.
 *
 * @param {HTMLElement|null} rowSection
 * @param {number} [offsetY=0]
 * @returns {number}
 */
export function getRowScrollYForTopAlign(rowSection, offsetY = 0) {
  const targetElement = getRowTopAnchorTarget(rowSection);
  if (!targetElement) {
    return window.scrollY;
  }

  return getElementAbsoluteRect(targetElement).top - offsetY;
}

/**
 * Return the complete center targets for every ligne.
 *
 * @param {HTMLElement[]} rowSections
 * @returns {Array<{rowId: string, scrollY: number, centerY: number}>}
 */
export function getRowCenterTargets(rowSections) {
  return rowSections
    .map((rowSection) => {
      const targetElement = getRowAnchorTarget(rowSection);
      const centerY = getElementCenterY(targetElement);
      if (!Number.isFinite(centerY)) {
        return null;
      }

      return {
        rowId: rowSection.id,
        scrollY: centerY - window.innerHeight / 2,
        centerY,
      };
    })
    .filter(Boolean);
}

/**
 * Return the full ordered half-step grid for the current lignes.
 *
 * @param {HTMLElement[]} rowSections
 * @returns {Array<{
 *   type: "row-center" | "midpoint",
 *   scrollY: number,
 *   beforeRowId: string,
 *   afterRowId: string,
 *   rowId?: string
 * }>}
 */
export function getScrollStepPositions(rowSections) {
  const rowCenters = getRowCenterTargets(rowSections);
  const stepPositions = [];

  rowCenters.forEach((rowCenter, index) => {
    stepPositions.push({
      type: "row-center",
      rowId: rowCenter.rowId,
      beforeRowId: rowCenter.rowId,
      afterRowId: rowCenter.rowId,
      scrollY: rowCenter.scrollY,
    });

    const nextRowCenter = rowCenters[index + 1];
    if (!nextRowCenter) {
      return;
    }

    stepPositions.push({
      type: "midpoint",
      beforeRowId: rowCenter.rowId,
      afterRowId: nextRowCenter.rowId,
      scrollY: (rowCenter.scrollY + nextRowCenter.scrollY) / 2,
    });
  });

  return stepPositions;
}

/**
 * Resolve the ligne located at the center of the viewport.
 *
 * @param {HTMLElement[]} rowSections
 * @returns {HTMLElement|null}
 */
export function getRowAtViewportCenter(rowSections) {
  const viewportCenterY = getViewportCenterY();
  let containingRow = null;
  let nearestRow = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  rowSections.forEach((rowSection) => {
    const absoluteRect = getElementAbsoluteRect(rowSection);

    if (
      viewportCenterY >= absoluteRect.top &&
      viewportCenterY <= absoluteRect.bottom
    ) {
      containingRow = rowSection;
    }

    const distanceToCenter = Math.abs(absoluteRect.center - viewportCenterY);
    if (distanceToCenter < nearestDistance) {
      nearestDistance = distanceToCenter;
      nearestRow = rowSection;
    }
  });

  return containingRow || nearestRow;
}
