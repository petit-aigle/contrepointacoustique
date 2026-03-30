import { getCanonicalHashTarget, getSiteContent } from "./data/site-content.js?v=20260330o";
import { createRevealObserver, createSectionObserver, observeRevealItems } from "./observers.js";
import { renderNavbar } from "./render/navbar.js?v=20260330o";
import { renderRows } from "./render/rows.js?v=20260330o";
import {
  applyModeFallback,
  parseInitialState,
  setDebugTextOverride,
  state,
  syncUrl,
  toggleDebugImageVariant,
} from "./state.js?v=20260330o";

const refs = {
  navbarNav: document.getElementById("navbar-nav"),
  languageSelect: document.getElementById("language-select"),
  modeSelect: document.getElementById("mode-select"),
  debugControls: document.getElementById("debug-controls"),
  debugFlag: document.getElementById("debug-flag"),
  debugPanel: document.getElementById("debug-panel"),
  debugPanelTitle: document.getElementById("debug-panel-title"),
  debugTitleFontToggle: document.getElementById("debug-title-font-toggle"),
  debugTitleFontLabel: document.getElementById("debug-title-font-label"),
  debugTitleCaseSelect: document.getElementById("debug-title-case-select"),
  debugTitleCaseLabel: document.getElementById("debug-title-case-label"),
  debugBodyFontToggle: document.getElementById("debug-body-font-toggle"),
  debugBodyFontLabel: document.getElementById("debug-body-font-label"),
  debugMessage: document.getElementById("debug-message"),
  languageLabel: document.getElementById("language-label"),
  modeLabel: document.getElementById("mode-label"),
  rowSections: Array.from(document.querySelectorAll(".site-row[data-row]")),
};

const revealObserver = createRevealObserver();
const sectionObserver = createSectionObserver();

function resizeDebugEditor(editor) {
  if (!editor) {
    return;
  }

  editor.style.height = "0px";
  editor.style.height = `${editor.scrollHeight}px`;
}

function resizeDebugEditors() {
  document.querySelectorAll(".site-row__debug-editor").forEach((editor) => {
    resizeDebugEditor(editor);
  });
}

function setActiveNavLink(targetId) {
  document
    .querySelectorAll(".navbar__link[data-nav-target]")
    .forEach((link) => {
      link.classList.toggle("is-active", link.dataset.navTarget === targetId);
    });
}

function syncActiveNavLink(targetId) {
  setActiveNavLink(targetId);
  window.requestAnimationFrame(() => setActiveNavLink(targetId));
  window.setTimeout(() => setActiveNavLink(targetId), 120);
}

function remapLegacyHash() {
  const targetId = getCanonicalHashTarget(window.location.hash);
  if (!targetId) {
    syncActiveNavLink("line-01");
    return;
  }

  const currentId = window.location.hash.replace(/^#/, "");
  if (currentId !== targetId) {
    const nextUrl = `${window.location.pathname}${window.location.search}#${targetId}`;
    window.history.replaceState({}, "", nextUrl);
  }

  document.getElementById(targetId)?.scrollIntoView({ block: "start" });
  syncActiveNavLink(targetId);
}

function renderAll(showFallback = false) {
  const siteContent = getSiteContent(state);

  document.documentElement.lang = state.lang;

  renderNavbar(refs, state, siteContent, showFallback);
  renderRows(refs.rowSections, siteContent.rows, state);
  resizeDebugEditors();
  sectionObserver.refresh();
  observeRevealItems(revealObserver);
  syncActiveNavLink(getCanonicalHashTarget(window.location.hash) || "line-01");
  syncUrl();
}

function bindEvents() {
  refs.languageSelect.addEventListener("change", (event) => {
    state.lang = event.target.value;
    const showFallback = applyModeFallback();
    renderAll(showFallback);
    remapLegacyHash();
  });

  refs.modeSelect.addEventListener("change", (event) => {
    if (!state.debug) {
      return;
    }

    state.mode = event.target.value;
    const showFallback = applyModeFallback();
    renderAll(showFallback);
    remapLegacyHash();
  });

  refs.debugFlag.addEventListener("click", () => {
    if (!state.debug) {
      return;
    }

    state.debugTypography.panelOpen = !state.debugTypography.panelOpen;
    renderAll(false);
  });

  refs.debugTitleFontToggle.addEventListener("change", (event) => {
    state.debugTypography.titleSpecialFont = event.target.checked;
    renderAll(false);
  });

  refs.debugTitleCaseSelect.addEventListener("change", (event) => {
    state.debugTypography.titleCaseMode = event.target.value;
    renderAll(false);
  });

  refs.debugBodyFontToggle.addEventListener("change", (event) => {
    state.debugTypography.bodySpecialFont = event.target.checked;
    renderAll(false);
  });

  window.addEventListener("hashchange", remapLegacyHash);

  document.addEventListener("click", (event) => {
    const toggleTarget = event.target.closest("[data-debug-toggle-image]");
    if (!toggleTarget || !state.debug) {
      return;
    }

    const rowId = toggleTarget.dataset.debugToggleImage;
    const variantCount = Number.parseInt(
      toggleTarget.dataset.debugVariantCount || "0",
      10
    );

    toggleDebugImageVariant(rowId, variantCount);
    renderAll(false);
  });

  document.addEventListener("keydown", (event) => {
    const toggleTarget = event.target.closest("[data-debug-toggle-image]");
    if (!toggleTarget || !state.debug) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    const rowId = toggleTarget.dataset.debugToggleImage;
    const variantCount = Number.parseInt(
      toggleTarget.dataset.debugVariantCount || "0",
      10
    );

    toggleDebugImageVariant(rowId, variantCount);
    renderAll(false);
  });

  document.addEventListener("input", (event) => {
    const editor = event.target.closest(".site-row__debug-editor[data-debug-text-key]");
    if (!editor || !state.debug) {
      return;
    }

    setDebugTextOverride(editor.dataset.debugTextKey, editor.value);
    resizeDebugEditor(editor);
  });
}

parseInitialState();
const showFallback = applyModeFallback();
renderAll(showFallback);
remapLegacyHash();
bindEvents();
