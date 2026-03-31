import { state } from "../state.js?v=20260330aa";
import {
  adjustDebugEditorFontStep,
  cycleDebugEditorAlign,
  getDebugEditorRecord,
} from "./editor-state.js?v=20260330aa";
import { sanitizeRichHTML, textToRichHTML } from "./editor-html.js?v=20260330aa";

let savedSelectionRange = null;

function focusEditor(editor) {
  if (!editor) {
    return;
  }

  editor.focus({ preventScroll: true });
}

function placeCaretAtEnd(editor) {
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);

  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function getActiveDebugEditorElement() {
  if (!state.debugActiveEditorKey) {
    return null;
  }

  const escapedKey =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(state.debugActiveEditorKey)
      : state.debugActiveEditorKey.replace(/"/g, '\\"');

  return document.querySelector(`[data-debug-editor-key="${escapedKey}"]`);
}

export function syncDebugEditorStyles(editor, record) {
  if (!editor || !record) {
    return;
  }

  const fontStep = Number.isFinite(record.fontStep) ? record.fontStep : 0;
  editor.style.textAlign = record.align || "";
  editor.style.setProperty("--debug-font-step", String(fontStep));
  editor.style.fontSize = `calc(var(--debug-base-font-size, 1rem) + ${fontStep * 0.125}rem)`;
}

export function rememberDebugEditorSelection(editor) {
  const selection = document.getSelection();
  if (!editor || !selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) {
    return false;
  }

  savedSelectionRange = range.cloneRange();
  return true;
}

export function restoreDebugEditorSelection(editor) {
  if (!editor) {
    return false;
  }

  focusEditor(editor);

  if (
    savedSelectionRange &&
    editor.contains(savedSelectionRange.commonAncestorContainer)
  ) {
    const selection = document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(savedSelectionRange);
    return true;
  }

  placeCaretAtEnd(editor);
  return false;
}

export function applyInlineCommand(editor, command) {
  if (!editor) {
    return false;
  }

  restoreDebugEditorSelection(editor);
  document.execCommand(command, false);
  rememberDebugEditorSelection(editor);
  return true;
}

export function cycleActiveDebugEditorAlign() {
  const editor = getActiveDebugEditorElement();
  if (!editor) {
    return null;
  }

  const nextAlign = cycleDebugEditorAlign(editor.dataset.debugEditorKey);
  syncDebugEditorStyles(editor, getDebugEditorRecord(editor.dataset.debugEditorKey));
  return nextAlign;
}

export function adjustActiveDebugEditorFontSize(delta) {
  const editor = getActiveDebugEditorElement();
  if (!editor) {
    return null;
  }

  const nextStep = adjustDebugEditorFontStep(editor.dataset.debugEditorKey, delta);
  syncDebugEditorStyles(editor, getDebugEditorRecord(editor.dataset.debugEditorKey));
  return nextStep;
}

export function insertSanitizedContent(editor, html, text) {
  if (!editor) {
    return false;
  }

  restoreDebugEditorSelection(editor);

  const sanitized = html
    ? sanitizeRichHTML(html)
    : textToRichHTML(text || "");

  if (!sanitized) {
    return false;
  }

  document.execCommand("insertHTML", false, sanitized);
  rememberDebugEditorSelection(editor);
  return true;
}

export function getSanitizedEditorHTML(editor) {
  return sanitizeRichHTML(editor?.innerHTML || "");
}

export function syncDebugToolbarState(refs, siteContent) {
  const activeEditor = getActiveDebugEditorElement();
  const activeRecord = activeEditor
    ? getDebugEditorRecord(activeEditor.dataset.debugEditorKey)
    : null;
  const isDisabled = !activeEditor;
  const activeField = activeEditor?.dataset.debugEditorField || "";
  const activeRow = activeEditor?.dataset.debugEditorRow || "";

  [
    refs.debugBoldButton,
    refs.debugItalicButton,
    refs.debugAlignButton,
    refs.debugFontIncreaseButton,
    refs.debugFontDecreaseButton,
  ].forEach((button) => {
    button.disabled = isDisabled;
  });

  const statusLabel = isDisabled
    ? siteContent.uiText.labels.debugNoActiveField
    : `${siteContent.uiText.labels.debugActiveField}: ${activeRow}.${activeField}`;

  refs.debugToolbarStatus.textContent = statusLabel;

  if (activeRecord?.align) {
    refs.debugAlignButtonText.textContent =
      siteContent.uiText.debugAlignModes[activeRecord.align];
  } else {
    refs.debugAlignButtonText.textContent = siteContent.uiText.labels.debugAlign;
  }
}
