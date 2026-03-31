import { getDebugTextKey, state } from "../state.js?v=20260330aa";
import { sanitizeRichHTML, textToRichHTML } from "./editor-html.js?v=20260330aa";

const ALIGNMENT_CYCLE = ["justify", "left", "right", "center"];
const FONT_STEP_MIN = -4;
const FONT_STEP_MAX = 8;

function createDebugEditorRecord(initialHTML = "") {
  return {
    html: sanitizeRichHTML(initialHTML),
    align: "",
    fontStep: 0,
  };
}

export function ensureDebugEditorRecord(currentState, rowId, field, fallbackText) {
  const key = getDebugTextKey(currentState, rowId, field);

  if (!state.debugEditorRecords[key]) {
    const legacyText = state.debugTextOverrides[key];
    const nextHTML = textToRichHTML(legacyText ?? fallbackText ?? "");
    state.debugEditorRecords[key] = createDebugEditorRecord(nextHTML);
  }

  return {
    key,
    record: state.debugEditorRecords[key],
  };
}

export function getDebugEditorRecord(key) {
  return state.debugEditorRecords[key] || null;
}

export function updateDebugEditorHTML(key, html) {
  const record = state.debugEditorRecords[key] || createDebugEditorRecord();
  record.html = sanitizeRichHTML(html);
  state.debugEditorRecords[key] = record;
  return record;
}

export function cycleDebugEditorAlign(key) {
  const record = state.debugEditorRecords[key] || createDebugEditorRecord();
  const currentIndex = ALIGNMENT_CYCLE.indexOf(record.align);
  const nextAlign =
    currentIndex === -1
      ? ALIGNMENT_CYCLE[0]
      : ALIGNMENT_CYCLE[(currentIndex + 1) % ALIGNMENT_CYCLE.length];

  record.align = nextAlign;
  state.debugEditorRecords[key] = record;
  return nextAlign;
}

export function adjustDebugEditorFontStep(key, delta) {
  const record = state.debugEditorRecords[key] || createDebugEditorRecord();
  const currentStep = Number.isFinite(record.fontStep) ? record.fontStep : 0;
  const nextStep = Math.min(FONT_STEP_MAX, Math.max(FONT_STEP_MIN, currentStep + delta));

  record.fontStep = nextStep;
  state.debugEditorRecords[key] = record;
  return nextStep;
}

export function setActiveDebugEditorKey(key) {
  state.debugActiveEditorKey = key || null;
  return state.debugActiveEditorKey;
}

export function clearActiveDebugEditorKey() {
  state.debugActiveEditorKey = null;
  return state.debugActiveEditorKey;
}
