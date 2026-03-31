import { state } from "../state.js?v=20260330aa";

const DEBUG_IMAGE_HEIGHT_STEP_PX = 24;
const DEBUG_IMAGE_MIN_HEIGHT = 120;
const DEBUG_IMAGE_MAX_HEIGHT = 1400;

function clampHeight(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return Math.min(
    DEBUG_IMAGE_MAX_HEIGHT,
    Math.max(DEBUG_IMAGE_MIN_HEIGHT, Math.round(value))
  );
}

function createImageAreaRecord(baseHeight = 0) {
  return {
    baseHeight: clampHeight(baseHeight),
    height: 0,
  };
}

export function getDebugImageAreaRecord(rowId) {
  return state.debugImageAreaRecords[rowId] || null;
}

export function getDebugImageAreaHeight(rowId) {
  return state.debugImageAreaRecords[rowId]?.height || 0;
}

export function syncDebugImageAreaBaseHeight(rowId, baseHeight = 0) {
  if (!rowId) {
    return null;
  }

  const normalizedBaseHeight = clampHeight(baseHeight);
  const record = state.debugImageAreaRecords[rowId] || createImageAreaRecord();

  if (normalizedBaseHeight > 0) {
    record.baseHeight = normalizedBaseHeight;
  }

  state.debugImageAreaRecords[rowId] = record;
  return record;
}

export function setDebugHoveredImageRowId(rowId, baseHeight = 0) {
  state.debugHoveredImageRowId = rowId || null;

  if (rowId) {
    syncDebugImageAreaBaseHeight(rowId, baseHeight);
  }

  return state.debugHoveredImageRowId;
}

export function clearDebugHoveredImageRowId() {
  state.debugHoveredImageRowId = null;
  return state.debugHoveredImageRowId;
}

export function adjustDebugImageAreaHeight(rowId, delta, baseHeight = 0) {
  if (!rowId || !Number.isFinite(delta) || delta === 0) {
    return null;
  }

  const record = syncDebugImageAreaBaseHeight(rowId, baseHeight) || createImageAreaRecord();
  const fallbackBaseHeight = clampHeight(baseHeight);
  const effectiveBaseHeight = record.baseHeight || fallbackBaseHeight;

  if (effectiveBaseHeight === 0) {
    return null;
  }

  const currentHeight = record.height || effectiveBaseHeight;
  const nextHeight = clampHeight(currentHeight + delta * DEBUG_IMAGE_HEIGHT_STEP_PX);

  if (!nextHeight) {
    return null;
  }

  record.height =
    Math.abs(nextHeight - effectiveBaseHeight) < DEBUG_IMAGE_HEIGHT_STEP_PX / 2
      ? 0
      : nextHeight;
  state.debugImageAreaRecords[rowId] = record;

  return record.height || effectiveBaseHeight;
}

export function adjustDebugHoveredImageAreaHeight(delta, baseHeight = 0) {
  if (!state.debugImageTools.resizeEnabled || !state.debugHoveredImageRowId) {
    return null;
  }

  return adjustDebugImageAreaHeight(state.debugHoveredImageRowId, delta, baseHeight);
}
