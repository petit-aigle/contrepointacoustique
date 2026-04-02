/**
 * Resolve the active ligne id for a scroll grid position.
 *
 * @param {{
 *   type: "row-center" | "midpoint",
 *   beforeRowId: string,
 *   afterRowId: string,
 *   rowId?: string
 * } | null} stepPosition
 * @param {number} lastDirection
 * @returns {string|null}
 */
export function getRowIdForStepPosition(stepPosition, lastDirection = 1) {
  if (!stepPosition) {
    return null;
  }

  if (stepPosition.type === "row-center") {
    return (
      stepPosition.rowId ||
      stepPosition.afterRowId ||
      stepPosition.beforeRowId ||
      null
    );
  }

  if (lastDirection < 0) {
    return stepPosition.beforeRowId || stepPosition.afterRowId || null;
  }

  return stepPosition.afterRowId || stepPosition.beforeRowId || null;
}

/**
 * Return the step index that centers the requested ligne.
 *
 * @param {Array<{
 *   type: "row-center" | "midpoint",
 *   rowId?: string
 * }>} stepPositions
 * @param {string} rowId
 * @returns {number}
 */
export function findRowCenterStepIndex(stepPositions, rowId) {
  return stepPositions.findIndex(
    (stepPosition) =>
      stepPosition.type === "row-center" && stepPosition.rowId === rowId
  );
}
