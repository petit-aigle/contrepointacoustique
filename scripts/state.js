export const SUPPORTED_LANGUAGES = ["fr", "en", "es"];
export const SUPPORTED_MODES = ["corrected", "marketing", "raw"];

export const state = {
  lang: "fr",
  mode: "corrected",
  debug: true,
  debugImageVariants: {
    "line-01": 0,
    "line-02": 0,
  },
  debugTextOverrides: {},
  debugEditorRecords: {},
  debugActiveEditorKey: null,
  debugTypography: {
    panelOpen: false,
    titleSpecialFont: true,
    titleCaseMode: "current",
    bodySpecialFont: false,
  },
};

export function parseInitialState() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const mode = params.get("mode");

  const debugParam = params.get("debug");
  state.debug = debugParam === null ? true : debugParam === "1";

  if (SUPPORTED_LANGUAGES.includes(lang)) {
    state.lang = lang;
  }

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
  params.set("debug", state.debug ? "1" : "0");

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
