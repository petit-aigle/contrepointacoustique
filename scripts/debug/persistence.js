const DEBUG_CACHE_KEY = "contrepoint:debug-cache:v1";

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function canUseLocalStorage() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function sanitizeDebugTypography(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    panelOpen: Boolean(value.panelOpen),
    titleSpecialFont: value.titleSpecialFont !== false,
    titleCaseMode:
      typeof value.titleCaseMode === "string" ? value.titleCaseMode : "current",
    bodySpecialFont: Boolean(value.bodySpecialFont),
  };
}

function sanitizeDebugImageTools(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  return {
    resizeEnabled: value.resizeEnabled !== false,
  };
}

function sanitizeDebugEditorRecords(value) {
  if (!isPlainObject(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, record]) => isPlainObject(record))
      .map(([key, record]) => [
        key,
        {
          html: typeof record.html === "string" ? record.html : "",
          align: typeof record.align === "string" ? record.align : "",
          fontStep: Number.isFinite(record.fontStep) ? record.fontStep : 0,
        },
      ])
  );
}

function sanitizeDebugImageVariants(value) {
  if (!isPlainObject(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, variantIndex]) => Number.isInteger(variantIndex) && variantIndex >= 0)
      .map(([rowId, variantIndex]) => [rowId, variantIndex])
  );
}

function sanitizeDebugImageAreaRecords(value) {
  if (!isPlainObject(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, record]) => isPlainObject(record))
      .map(([rowId, record]) => [
        rowId,
        {
          baseHeight: Number.isFinite(record.baseHeight) ? record.baseHeight : 0,
          height: Number.isFinite(record.height) ? record.height : 0,
        },
      ])
  );
}

export function loadPersistedDebugState() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DEBUG_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return null;
    }

    return {
      debugEditorRecords: sanitizeDebugEditorRecords(parsed.debugEditorRecords),
      debugImageVariants: sanitizeDebugImageVariants(parsed.debugImageVariants),
      debugImageAreaRecords: sanitizeDebugImageAreaRecords(
        parsed.debugImageAreaRecords
      ),
      debugTypography: sanitizeDebugTypography(parsed.debugTypography),
      debugImageTools: sanitizeDebugImageTools(parsed.debugImageTools),
    };
  } catch {
    return null;
  }
}

export function persistDebugState(currentState) {
  if (!canUseLocalStorage() || !currentState?.debug) {
    return false;
  }

  const payload = {
    debugEditorRecords: currentState.debugEditorRecords || {},
    debugImageVariants: currentState.debugImageVariants || {},
    debugImageAreaRecords: currentState.debugImageAreaRecords || {},
    debugTypography: currentState.debugTypography || {},
    debugImageTools: currentState.debugImageTools || {},
  };

  try {
    window.localStorage.setItem(DEBUG_CACHE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedDebugState() {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(DEBUG_CACHE_KEY);
    return true;
  } catch {
    return false;
  }
}
