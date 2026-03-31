export const SUPPORTED_LANGUAGES = ["fr", "en", "es"];
export const SUPPORTED_MODES = ["corrected", "marketing", "raw"];
const DEFAULT_LANGUAGE = "fr";

const DEFAULT_DEBUG_STATE = {
  debugImageVariants: {
    "line-01": 0,
    "line-02": 0,
  },
  debugTextOverrides: {},
  debugEditorRecords: {},
  debugActiveEditorKey: null,
  debugImageAreaRecords: {},
  debugHoveredImageRowId: null,
  debugTypography: {
    panelOpen: false,
    titleSpecialFont: true,
    titleCaseMode: "current",
    bodySpecialFont: false,
  },
  debugImageTools: {
    resizeEnabled: true,
  },
};

export const state = {
  lang: DEFAULT_LANGUAGE,
  mode: "corrected",
  debug: false,
  debugImageVariants: { ...DEFAULT_DEBUG_STATE.debugImageVariants },
  debugTextOverrides: { ...DEFAULT_DEBUG_STATE.debugTextOverrides },
  debugEditorRecords: { ...DEFAULT_DEBUG_STATE.debugEditorRecords },
  debugActiveEditorKey: DEFAULT_DEBUG_STATE.debugActiveEditorKey,
  debugImageAreaRecords: { ...DEFAULT_DEBUG_STATE.debugImageAreaRecords },
  debugHoveredImageRowId: DEFAULT_DEBUG_STATE.debugHoveredImageRowId,
  debugTypography: { ...DEFAULT_DEBUG_STATE.debugTypography },
  debugImageTools: { ...DEFAULT_DEBUG_STATE.debugImageTools },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

function normalizeLanguageTag(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase().replace(/_/g, "-");
}

function resolveSupportedLanguage(value) {
  const normalizedTag = normalizeLanguageTag(value);
  if (!normalizedTag) {
    return null;
  }

  if (SUPPORTED_LANGUAGES.includes(normalizedTag)) {
    return normalizedTag;
  }

  const primaryLanguage = normalizedTag.split("-")[0];
  return SUPPORTED_LANGUAGES.includes(primaryLanguage)
    ? primaryLanguage
    : null;
}

function resolveBrowserLanguage() {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const candidates = [];
  if (Array.isArray(navigator.languages)) {
    candidates.push(...navigator.languages);
  }

  candidates.push(navigator.language, navigator.userLanguage);

  for (const candidate of candidates) {
    const supportedLanguage = resolveSupportedLanguage(candidate);
    if (supportedLanguage) {
      return supportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function parseInitialState(persistedDebugState = null) {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const mode = params.get("mode");
  const debugParam = params.get("debug");

  if (isPlainObject(persistedDebugState)) {
    if (isPlainObject(persistedDebugState.debugEditorRecords)) {
      state.debugEditorRecords = persistedDebugState.debugEditorRecords;
    }

    if (isPlainObject(persistedDebugState.debugImageVariants)) {
      state.debugImageVariants = persistedDebugState.debugImageVariants;
    }

    if (isPlainObject(persistedDebugState.debugImageAreaRecords)) {
      state.debugImageAreaRecords = persistedDebugState.debugImageAreaRecords;
    }

    const persistedTypography = sanitizeDebugTypography(
      persistedDebugState.debugTypography
    );
    if (persistedTypography) {
      state.debugTypography = persistedTypography;
    }

    const persistedImageTools = sanitizeDebugImageTools(
      persistedDebugState.debugImageTools
    );
    if (persistedImageTools) {
      state.debugImageTools = persistedImageTools;
    }

  }

  state.debug = debugParam === "1";

  state.lang = resolveSupportedLanguage(lang) || resolveBrowserLanguage();

  if (state.debug && SUPPORTED_MODES.includes(mode)) {
    state.mode = mode;
  }
}

export function applyModeFallback() {
  if (state.mode === "raw" && state.lang !== "fr") {
    state.mode = "corrected";
    return true;
  }

  return false;
}

export function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", state.lang);
  if (state.debug) {
    params.set("debug", "1");
  } else {
    params.delete("debug");
  }

  if (state.debug) {
    if (state.mode !== "corrected") {
      params.set("mode", state.mode);
    } else {
      params.delete("mode");
    }
  } else {
    params.delete("mode");
  }

  const query = params.toString();
  const hash = window.location.hash;
  const nextUrl = query
    ? `${window.location.pathname}?${query}${hash}`
    : `${window.location.pathname}${hash}`;

  window.history.replaceState({}, "", nextUrl);
}

export function toggleDebugImageVariant(rowId, variantCount) {
  if (!rowId || !Number.isInteger(variantCount) || variantCount < 2) {
    return 0;
  }

  const currentVariant = state.debugImageVariants[rowId] || 0;
  const nextVariant = (currentVariant + 1) % variantCount;
  state.debugImageVariants[rowId] = nextVariant;
  return nextVariant;
}

export function getDebugTextKey(currentState, rowId, field) {
  return [currentState.lang, currentState.mode, rowId, field].join("::");
}

export function getDebugTextOverride(currentState, rowId, field, fallbackValue) {
  const key = getDebugTextKey(currentState, rowId, field);
  return Object.prototype.hasOwnProperty.call(state.debugTextOverrides, key)
    ? state.debugTextOverrides[key]
    : fallbackValue;
}

export function setDebugTextOverride(key, value) {
  if (!key) {
    return value;
  }

  state.debugTextOverrides[key] = value;
  return value;
}

export function resetDebugState() {
  state.debugImageVariants = { ...DEFAULT_DEBUG_STATE.debugImageVariants };
  state.debugTextOverrides = { ...DEFAULT_DEBUG_STATE.debugTextOverrides };
  state.debugEditorRecords = { ...DEFAULT_DEBUG_STATE.debugEditorRecords };
  state.debugActiveEditorKey = DEFAULT_DEBUG_STATE.debugActiveEditorKey;
  state.debugImageAreaRecords = { ...DEFAULT_DEBUG_STATE.debugImageAreaRecords };
  state.debugHoveredImageRowId = DEFAULT_DEBUG_STATE.debugHoveredImageRowId;
  state.debugTypography = {
    ...DEFAULT_DEBUG_STATE.debugTypography,
    panelOpen: true,
  };
  state.debugImageTools = { ...DEFAULT_DEBUG_STATE.debugImageTools };
}
