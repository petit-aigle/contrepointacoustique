import {
  getCanonicalHashTarget,
  getHashForRowId,
  getSiteContent,
} from "./data/site-content.js?v=20260330aa";
import {
  adjustActiveDebugEditorFontSize,
  applyInlineCommand,
  cycleActiveDebugEditorAlign,
  insertSanitizedContent,
  rememberDebugEditorSelection,
  syncDebugToolbarState,
} from "./debug/editor-toolbar.js?v=20260330aa";
import { handleDebugEditorShortcut } from "./debug/editor-shortcuts.js?v=20260330aa";
import { handleDebugHoverPointerMove, hideDebugHoverBadge } from "./debug/hover-badge.js?v=20260330aa";
import { adjustDebugHoveredImageAreaHeight, clearDebugHoveredImageRowId, setDebugHoveredImageRowId } from "./debug/image-state.js?v=20260330aa";
import { handleDebugImageShortcut } from "./debug/image-shortcuts.js?v=20260330aa";
import {
  clearPersistedDebugState,
  loadPersistedDebugState,
  persistDebugState,
} from "./debug/persistence.js?v=20260330aa";
import { clearActiveDebugEditorKey, setActiveDebugEditorKey, updateDebugEditorHTML } from "./debug/editor-state.js?v=20260330aa";
import { createRevealObserver, createSectionObserver, observeRevealItems } from "./observers.js";
import { renderNavbar } from "./render/navbar.js?v=20260330aa";
import { renderRows } from "./render/rows.js?v=20260330aa";
import {
  applyModeFallback,
  parseInitialState,
  resetDebugState,
  state,
  syncUrl,
  toggleDebugImageVariant,
} from "./state.js?v=20260330aa";

const refs = {
  navbarNav: document.getElementById("navbar-nav"),
  languageSelect: document.getElementById("language-select"),
  modeSelect: document.getElementById("mode-select"),
  debugControls: document.getElementById("debug-controls"),
  debugFlag: document.getElementById("debug-flag"),
  debugPanel: document.getElementById("debug-panel"),
  debugPanelTitle: document.getElementById("debug-panel-title"),
  debugToolbar: document.getElementById("debug-toolbar"),
  debugToolbarTitle: document.getElementById("debug-toolbar-title"),
  debugBoldButton: document.getElementById("debug-bold-button"),
  debugBoldButtonText: document.getElementById("debug-bold-button-text"),
  debugItalicButton: document.getElementById("debug-italic-button"),
  debugItalicButtonText: document.getElementById("debug-italic-button-text"),
  debugAlignButton: document.getElementById("debug-align-button"),
  debugAlignButtonText: document.getElementById("debug-align-button-text"),
  debugFontDecreaseButton: document.getElementById("debug-font-decrease-button"),
  debugFontDecreaseButtonText: document.getElementById("debug-font-decrease-button-text"),
  debugFontIncreaseButton: document.getElementById("debug-font-increase-button"),
  debugFontIncreaseButtonText: document.getElementById("debug-font-increase-button-text"),
  debugToolbarStatus: document.getElementById("debug-toolbar-status"),
  debugManualTitle: document.getElementById("debug-manual-title"),
  debugManualBoldText: document.getElementById("debug-manual-bold-text"),
  debugManualItalicText: document.getElementById("debug-manual-italic-text"),
  debugManualAlignText: document.getElementById("debug-manual-align-text"),
  debugManualFontUpText: document.getElementById("debug-manual-font-up-text"),
  debugManualFontDownText: document.getElementById("debug-manual-font-down-text"),
  debugManualImageText: document.getElementById("debug-manual-image-text"),
  debugTitleFontToggle: document.getElementById("debug-title-font-toggle"),
  debugTitleFontLabel: document.getElementById("debug-title-font-label"),
  debugTitleCaseSelect: document.getElementById("debug-title-case-select"),
  debugTitleCaseLabel: document.getElementById("debug-title-case-label"),
  debugBodyFontToggle: document.getElementById("debug-body-font-toggle"),
  debugBodyFontLabel: document.getElementById("debug-body-font-label"),
  debugImageHeightToggle: document.getElementById("debug-image-height-toggle"),
  debugImageHeightLabel: document.getElementById("debug-image-height-label"),
  debugResetButton: document.getElementById("debug-reset-button"),
  debugMessage: document.getElementById("debug-message"),
  debugHoverBadge: document.getElementById("debug-hover-badge"),
  languageLabel: document.getElementById("language-label"),
  modeLabel: document.getElementById("mode-label"),
  rowSections: Array.from(document.querySelectorAll(".site-row[data-row]")),
};

const revealObserver = createRevealObserver();
const sectionObserver = createSectionObserver();
const WHEEL_STEP_LOCK_MS = 700;
const WHEEL_TICKS_PER_STEP = 3;
const LIGHTBOX_BG_PHASE_MS = 1200;
const LIGHTBOX_IMAGE_PHASE_MS = 840;
const LIGHTBOX_OPEN_IMAGE_DELAY_MS = 100;
const LIGHTBOX_CLOSE_BG_DELAY_MS = 400;
const LIGHTBOX_MIN_ZOOM = 1;
const LIGHTBOX_MAX_ZOOM = 3;
const LIGHTBOX_ZOOM_STEP = 0.16;
const LIGHTBOX_CLICK_ZOOM = 2;

let wheelStepLocked = false;
let wheelTickCount = 0;
let wheelDirection = 0;
let activeLightbox = null;

function getEditorFromEventTarget(target) {
  return target?.closest?.(".site-row__debug-editor[data-debug-editor-key]") || null;
}

function getActiveEditor() {
  if (!state.debugActiveEditorKey) {
    return null;
  }

  const escapedKey =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(state.debugActiveEditorKey)
      : state.debugActiveEditorKey.replace(/"/g, '\\"');

  return document.querySelector(`[data-debug-editor-key="${escapedKey}"]`);
}

function getHoveredImageFigure() {
  if (!state.debugHoveredImageRowId) {
    return null;
  }

  const escapedRowId =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(state.debugHoveredImageRowId)
      : state.debugHoveredImageRowId.replace(/"/g, '\\"');

  return document.querySelector(`[data-debug-image-row="${escapedRowId}"]`);
}

function buildFullscreenRectForImage(imageElement) {
  const sourceRect = imageElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const sourceRatio =
    imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0
      ? imageElement.naturalWidth / imageElement.naturalHeight
      : sourceRect.width / Math.max(1, sourceRect.height);

  const targetHeight = viewportHeight;
  const targetWidth = targetHeight * sourceRatio;
  const targetLeft = (viewportWidth - targetWidth) / 2;

  return {
    source: {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    },
    target: {
      left: targetLeft,
      top: 0,
      width: targetWidth,
      height: targetHeight,
    },
  };
}

function getLightboxOverlayReveal(sourceRect) {
  const centerX = sourceRect.left + sourceRect.width / 2;
  const centerY = sourceRect.top + sourceRect.height / 2;
  const distances = [
    Math.hypot(centerX, centerY),
    Math.hypot(window.innerWidth - centerX, centerY),
    Math.hypot(centerX, window.innerHeight - centerY),
    Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY),
  ];
  const maxRadius = Math.max(...distances) * 2;

  return {
    centerX,
    centerY,
    maxRadius,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function waitForAnimationOrTimeout(animation, timeoutMs) {
  return Promise.race([
    animation?.finished?.catch?.(() => undefined) || Promise.resolve(),
    new Promise((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

function waitMs(durationMs) {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

function runLightboxBackgroundPhase(overlay, overlayReveal, direction) {
  const revealDisk = document.createElement("div");
  revealDisk.className = "image-lightbox__reveal";

  const radius = overlayReveal.maxRadius;
  const diameter = radius * 2;
  const startScale = direction === "open" ? 0 : 1;
  const endScale = direction === "open" ? 1 : 0;

  revealDisk.style.width = `${diameter}px`;
  revealDisk.style.height = `${diameter}px`;
  revealDisk.style.left = `${overlayReveal.centerX - radius}px`;
  revealDisk.style.top = `${overlayReveal.centerY - radius}px`;
  revealDisk.style.transform = `scale(${startScale})`;

  overlay.style.background = "transparent";
  overlay.appendChild(revealDisk);

  const backgroundAnimation = revealDisk.animate(
    [{ transform: `scale(${startScale})` }, { transform: `scale(${endScale})` }],
    {
      duration: LIGHTBOX_BG_PHASE_MS,
      easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      fill: "forwards",
    }
  );

  return waitForAnimationOrTimeout(
    backgroundAnimation,
    LIGHTBOX_BG_PHASE_MS + 140
  ).finally(() => {
    if (direction === "open") {
      overlay.style.background = "#000000";
    }

    revealDisk.remove();
  });
}

function applyLightboxTransform() {
  if (!activeLightbox) {
    return;
  }

  const { image, zoom, panX, panY } = activeLightbox;
  if (zoom <= 1.01) {
    image.style.transform = "none";
    return;
  }

  image.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

function confineLightboxPan() {
  if (!activeLightbox || activeLightbox.zoom <= 1.01) {
    return;
  }

  const baseWidth = Number.parseFloat(activeLightbox.image.style.width) || 0;
  const baseHeight = Number.parseFloat(activeLightbox.image.style.height) || 0;
  const scaledWidth = baseWidth * activeLightbox.zoom;
  const scaledHeight = baseHeight * activeLightbox.zoom;
  const maxPanX = Math.max(0, (scaledWidth - window.innerWidth) / 2);
  const maxPanY = Math.max(0, (scaledHeight - window.innerHeight) / 2);

  activeLightbox.panX = clamp(activeLightbox.panX, -maxPanX, maxPanX);
  activeLightbox.panY = clamp(activeLightbox.panY, -maxPanY, maxPanY);
  applyLightboxTransform();
}

function setLightboxZoom(nextZoom, clientX, clientY) {
  if (!activeLightbox) {
    return;
  }

  const { image } = activeLightbox;
  const clampedZoom = clamp(nextZoom, LIGHTBOX_MIN_ZOOM, LIGHTBOX_MAX_ZOOM);
  image.style.transformOrigin = "50% 50%";

  if (clampedZoom <= 1.01) {
    activeLightbox.panX = 0;
    activeLightbox.panY = 0;
  }

  activeLightbox.overlay.classList.toggle("is-zoomed", clampedZoom > 1.01);
  activeLightbox.zoom = clampedZoom;
  applyLightboxTransform();
  confineLightboxPan();
}

function toggleLightboxZoom(clientX, clientY) {
  if (!activeLightbox) {
    return;
  }

  const nextZoom =
    activeLightbox.zoom > LIGHTBOX_MIN_ZOOM + 0.01
      ? LIGHTBOX_MIN_ZOOM
      : LIGHTBOX_CLICK_ZOOM;
  setLightboxZoom(nextZoom, clientX, clientY);
}

function zoomLightboxFromWheel(event) {
  if (!activeLightbox) {
    return;
  }

  const direction = event.deltaY < 0 ? 1 : -1;
  const nextZoom = activeLightbox.zoom + direction * LIGHTBOX_ZOOM_STEP;
  setLightboxZoom(nextZoom, event.clientX, event.clientY);
}

function closeImageLightbox() {
  if (!activeLightbox) {
    return;
  }

  if (activeLightbox.isOpening) {
    activeLightbox.pendingClose = true;
    return;
  }

  if (activeLightbox.isClosing) {
    return;
  }

  const {
    overlay,
    image,
    sourceImage,
    sourceFigureRadius,
    sourceImageInlineOpacity,
    overlayReveal,
    onKeyDown,
    onImagePointerDown,
    onWindowPointerMove,
    onWindowPointerUp,
  } = activeLightbox;
  activeLightbox.isClosing = true;
  let didFinalize = false;

  const finalizeClose = () => {
    if (didFinalize) {
      return;
    }

    didFinalize = true;
    document.body.classList.remove("is-lightbox-open");
    document.removeEventListener("keydown", onKeyDown);
    image.removeEventListener("pointerdown", onImagePointerDown);
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
    sourceImage.style.opacity = sourceImageInlineOpacity;
    overlay.remove();
    activeLightbox = null;
  };

  setLightboxZoom(1);
  const nextRect = buildFullscreenRectForImage(sourceImage);
  const currentRect = image.getBoundingClientRect();

  const closeImageAnimation = image.animate(
      [
        {
          left: `${currentRect.left}px`,
          top: `${currentRect.top}px`,
          width: `${currentRect.width}px`,
          height: `${currentRect.height}px`,
          borderRadius: "0px",
        },
        {
          left: `${nextRect.source.left}px`,
          top: `${nextRect.source.top}px`,
          width: `${nextRect.source.width}px`,
          height: `${nextRect.source.height}px`,
          borderRadius: sourceFigureRadius,
        },
      ],
      {
        duration: LIGHTBOX_IMAGE_PHASE_MS,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      }
    );

  Promise.all([
    waitForAnimationOrTimeout(closeImageAnimation, LIGHTBOX_IMAGE_PHASE_MS + 140),
    waitMs(LIGHTBOX_CLOSE_BG_DELAY_MS).then(() =>
      runLightboxBackgroundPhase(overlay, overlayReveal, "close")
    ),
  ])
    .finally(finalizeClose);
}

function openImageLightbox(sourceImage) {
  if (!sourceImage || activeLightbox) {
    return;
  }

  const sourceRow = sourceImage.closest(".site-row[data-row]");
  if (sourceRow?.id === "line-01") {
    return;
  }

  const { source, target } = buildFullscreenRectForImage(sourceImage);
  const overlayReveal = getLightboxOverlayReveal(source);
  const sourceFigure = sourceImage.closest(".site-row__figure");
  const sourceImageComputedStyle = window.getComputedStyle(sourceImage);
  const sourceFigureRadius = sourceFigure
    ? window.getComputedStyle(sourceFigure).borderRadius || "0px"
    : "0px";
  const sourceImageInlineOpacity = sourceImage.style.opacity || "";

  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.background = "transparent";

  const image = document.createElement("img");
  image.className = "image-lightbox__image";
  image.src = sourceImage.currentSrc || sourceImage.src;
  image.alt = sourceImage.alt || "";
  image.decoding = "async";
  image.style.left = `${source.left}px`;
  image.style.top = `${source.top}px`;
  image.style.width = `${source.width}px`;
  image.style.height = `${source.height}px`;
  image.style.borderRadius = sourceFigureRadius;
  image.style.objectFit = sourceImageComputedStyle.objectFit || "cover";
  image.style.objectPosition =
    sourceImageComputedStyle.objectPosition || "50% 50%";

  overlay.appendChild(image);
  document.body.appendChild(overlay);
  document.body.classList.add("is-lightbox-open");
  sourceImage.style.opacity = "0";

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      closeImageLightbox();
    }
  };

  const closeButton = document.createElement("button");
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image");
  closeButton.textContent = "×";

  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeImageLightbox();
  });

  image.addEventListener("click", (event) => {
    if (activeLightbox?.suppressNextImageClick) {
      activeLightbox.suppressNextImageClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    toggleLightboxZoom(event.clientX, event.clientY);
  });

  const onImagePointerDown = (event) => {
    if (event.button !== 0 || !activeLightbox || activeLightbox.zoom <= 1.01) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activeLightbox.isPanning = true;
    activeLightbox.didPanDuringDrag = false;
    activeLightbox.dragLastX = event.clientX;
    activeLightbox.dragLastY = event.clientY;
    activeLightbox.dragPointerId = event.pointerId;
    image.setPointerCapture(event.pointerId);
    activeLightbox.overlay.classList.add("is-panning");
  };

  const onWindowPointerMove = (event) => {
    if (!activeLightbox?.isPanning) {
      return;
    }

    const deltaX = event.clientX - activeLightbox.dragLastX;
    const deltaY = event.clientY - activeLightbox.dragLastY;
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      activeLightbox.didPanDuringDrag = true;
    }
    activeLightbox.dragLastX = event.clientX;
    activeLightbox.dragLastY = event.clientY;
    activeLightbox.panX += deltaX;
    activeLightbox.panY += deltaY;
    applyLightboxTransform();
    confineLightboxPan();
  };

  const onWindowPointerUp = () => {
    if (!activeLightbox?.isPanning) {
      return;
    }

    activeLightbox.isPanning = false;
    if (activeLightbox.didPanDuringDrag) {
      activeLightbox.suppressNextImageClick = true;
    }
    if (activeLightbox.dragPointerId !== null) {
      image.releasePointerCapture(activeLightbox.dragPointerId);
      activeLightbox.dragPointerId = null;
    }
    activeLightbox.overlay.classList.remove("is-panning");
  };

  image.addEventListener("pointerdown", onImagePointerDown);
  window.addEventListener("pointermove", onWindowPointerMove);
  window.addEventListener("pointerup", onWindowPointerUp);
  window.addEventListener("pointercancel", onWindowPointerUp);

  overlay.addEventListener("click", (event) => {
    if (event.target !== overlay) {
      return;
    }
    closeImageLightbox();
  });

  overlay.appendChild(closeButton);
  document.addEventListener("keydown", onKeyDown);
  activeLightbox = {
    overlay,
    image,
    closeButton,
    sourceImage,
    sourceFigureRadius,
    sourceImageInlineOpacity,
    overlayReveal,
    onKeyDown,
    zoom: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    didPanDuringDrag: false,
    suppressNextImageClick: false,
    dragLastX: 0,
    dragLastY: 0,
    dragPointerId: null,
    isOpening: true,
    isClosing: false,
    pendingClose: false,
    onImagePointerDown,
    onWindowPointerMove,
    onWindowPointerUp,
  };

  const openImageAnimationPromise = waitMs(LIGHTBOX_OPEN_IMAGE_DELAY_MS).then(() =>
    image.animate(
      [
        {
          left: `${source.left}px`,
          top: `${source.top}px`,
          width: `${source.width}px`,
          height: `${source.height}px`,
          borderRadius: sourceFigureRadius,
        },
        {
          left: `${source.left}px`,
          top: `${source.top}px`,
          width: `${source.width}px`,
          height: `${source.height}px`,
          borderRadius: "0px",
          offset: 0.28,
        },
        {
          left: `${target.left}px`,
          top: `${target.top}px`,
          width: `${target.width}px`,
          height: `${target.height}px`,
          borderRadius: "0px",
          offset: 0.9,
        },
        {
          left: `${target.left}px`,
          top: `${target.top}px`,
          width: `${target.width}px`,
          height: `${target.height}px`,
          borderRadius: "0px",
        },
      ],
      {
        duration: LIGHTBOX_IMAGE_PHASE_MS,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      }
    )
  );

  Promise.all([
    runLightboxBackgroundPhase(overlay, overlayReveal, "open"),
    openImageAnimationPromise.then((animation) =>
      waitForAnimationOrTimeout(animation, LIGHTBOX_IMAGE_PHASE_MS + 140)
    ),
  ]).finally(() => {
    if (!activeLightbox || activeLightbox.overlay !== overlay || activeLightbox.isClosing) {
      return;
    }

    activeLightbox.isOpening = false;
    if (activeLightbox.pendingClose) {
      closeImageLightbox();
      return;
    }

    overlay.style.background = "#000000";
  });
}

function persistEditor(editor) {
  if (!editor) {
    return;
  }

  updateDebugEditorHTML(editor.dataset.debugEditorKey, editor.innerHTML);
}

function runActiveEditorAction(siteContent, action) {
  const activeEditor = getActiveEditor();
  if (!activeEditor) {
    syncDebugToolbarState(refs, siteContent);
    return;
  }

  action(activeEditor);
  persistEditor(activeEditor);
  persistDebugState(state);
  syncDebugToolbarState(refs, siteContent);
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

function getRowCenterTarget(targetId) {
  const row = document.getElementById(targetId);
  if (!row) {
    return null;
  }

  const figure = row.querySelector("[data-row-media] .site-row__figure");
  if (figure) {
    return figure;
  }

  const mediaContainer = row.querySelector("[data-row-media]");
  if (
    mediaContainer &&
    !mediaContainer.hidden &&
    mediaContainer.getBoundingClientRect().height > 2
  ) {
    return mediaContainer;
  }

  return row.querySelector("[data-row-text]") || row;
}

function scrollElementToViewportCenter(element, behavior = "auto") {
  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const absoluteCenterY = window.scrollY + rect.top + rect.height / 2;
  const nextTop = Math.max(0, absoluteCenterY - window.innerHeight / 2);

  window.scrollTo({
    top: nextTop,
    behavior,
  });
}

function scrollRowToCenter(targetId, behavior = "auto") {
  const centerTarget = getRowCenterTarget(targetId);
  scrollElementToViewportCenter(centerTarget, behavior);
}

function centerRowAfterLayout(targetId, behavior = "auto") {
  scrollRowToCenter(targetId, behavior);
  window.requestAnimationFrame(() => scrollRowToCenter(targetId, "auto"));
}

function getNearestRowIdToViewportCenter() {
  const viewportCenter = window.innerHeight / 2;
  let nearestId = refs.rowSections[0]?.id || "line-01";
  let nearestDistance = Number.POSITIVE_INFINITY;

  refs.rowSections.forEach((row) => {
    const figure = row.querySelector("[data-row-media] .site-row__figure");
    const mediaContainer = row.querySelector("[data-row-media]");
    const centerTarget =
      figure ||
      (mediaContainer &&
      !mediaContainer.hidden &&
      mediaContainer.getBoundingClientRect().height > 2
        ? mediaContainer
        : row.querySelector("[data-row-text]")) ||
      row;
    const rect = centerTarget.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = row.id;
    }
  });

  return nearestId;
}

function getActiveRowIndexForWheelStep() {
  const hashTarget = getCanonicalHashTarget(window.location.hash);
  const targetId = hashTarget || getNearestRowIdToViewportCenter();
  const index = refs.rowSections.findIndex((row) => row.id === targetId);
  return index >= 0 ? index : 0;
}

function goToRowByIndex(index, behavior = "smooth") {
  const clampedIndex = Math.max(0, Math.min(refs.rowSections.length - 1, index));
  const targetId = refs.rowSections[clampedIndex]?.id;
  if (!targetId) {
    return;
  }

  const targetHash = getHashForRowId(targetId);
  const nextUrl = `${window.location.pathname}${window.location.search}#${targetHash}`;
  window.history.replaceState({}, "", nextUrl);
  scrollRowToCenter(targetId, behavior);
  syncActiveNavLink(targetId);
}

function remapLegacyHash() {
  const targetId = getCanonicalHashTarget(window.location.hash);
  if (!targetId) {
    syncActiveNavLink("line-01");
    return;
  }

  const currentId = window.location.hash.replace(/^#/, "");
  const targetHash = getHashForRowId(targetId);
  if (currentId !== targetHash) {
    const nextUrl = `${window.location.pathname}${window.location.search}#${targetHash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  centerRowAfterLayout(targetId, "auto");
  syncActiveNavLink(targetId);
}

function renderAll(showFallback = false) {
  const siteContent = getSiteContent(state);

  document.documentElement.lang = state.lang;

  renderNavbar(refs, state, siteContent, showFallback);
  renderRows(refs.rowSections, siteContent.rows, state);
  syncDebugToolbarState(refs, siteContent);

  if (!state.debug) {
    hideDebugHoverBadge(refs.debugHoverBadge);
    clearDebugHoveredImageRowId();
  }

  sectionObserver.refresh();
  observeRevealItems(revealObserver);
  syncActiveNavLink(getCanonicalHashTarget(window.location.hash) || "line-01");
  syncUrl();
}

function commitDebugState(showFallback = false) {
  renderAll(showFallback);
  persistDebugState(state);
}

function bindEvents() {
  refs.navbarNav.addEventListener("click", (event) => {
    const link = event.target.closest?.(".navbar__link[data-nav-target]");
    if (!link) {
      return;
    }

    event.preventDefault();
    const rawTargetId = link.dataset.navTarget;
    const targetId = getCanonicalHashTarget(`#${rawTargetId}`) || rawTargetId;
    if (!targetId) {
      return;
    }

    const targetHash = getHashForRowId(targetId);
    const nextUrl = `${window.location.pathname}${window.location.search}#${targetHash}`;
    window.history.pushState({}, "", nextUrl);
    centerRowAfterLayout(targetId, "smooth");
    syncActiveNavLink(targetId);
  });

  refs.languageSelect.addEventListener("change", (event) => {
    state.lang = event.target.value;
    const showFallback = applyModeFallback();
    commitDebugState(showFallback);
    remapLegacyHash();
  });

  refs.modeSelect.addEventListener("change", (event) => {
    if (!state.debug) {
      return;
    }

    state.mode = event.target.value;
    const showFallback = applyModeFallback();
    commitDebugState(showFallback);
    remapLegacyHash();
  });

  refs.debugFlag.addEventListener("click", () => {
    if (!state.debug) {
      return;
    }

    state.debugTypography.panelOpen = !state.debugTypography.panelOpen;
    commitDebugState(false);
  });

  refs.debugTitleFontToggle.addEventListener("change", (event) => {
    state.debugTypography.titleSpecialFont = event.target.checked;
    commitDebugState(false);
  });

  refs.debugTitleCaseSelect.addEventListener("change", (event) => {
    state.debugTypography.titleCaseMode = event.target.value;
    commitDebugState(false);
  });

  refs.debugBodyFontToggle.addEventListener("change", (event) => {
    state.debugTypography.bodySpecialFont = event.target.checked;
    commitDebugState(false);
  });

  refs.debugImageHeightToggle.addEventListener("change", (event) => {
    state.debugImageTools.resizeEnabled = event.target.checked;
    if (!state.debugImageTools.resizeEnabled) {
      clearDebugHoveredImageRowId();
    }
    commitDebugState(false);
  });

  refs.debugResetButton.addEventListener("click", () => {
    if (!state.debug) {
      return;
    }

    resetDebugState();
    clearPersistedDebugState();
    commitDebugState(false);
  });

  refs.debugToolbar.addEventListener("mousedown", (event) => {
    if (event.target.closest?.("[data-debug-action]")) {
      event.preventDefault();
    }
  });

  refs.debugToolbar.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-debug-action]");
    if (!button || !state.debug) {
      return;
    }

    const siteContent = getSiteContent(state);
    const action = button.dataset.debugAction;

    if (action === "bold") {
      runActiveEditorAction(siteContent, (editor) => {
        applyInlineCommand(editor, "bold");
      });
      return;
    }

    if (action === "italic") {
      runActiveEditorAction(siteContent, (editor) => {
        applyInlineCommand(editor, "italic");
      });
      return;
    }

    if (action === "align") {
      runActiveEditorAction(siteContent, () => {
        cycleActiveDebugEditorAlign();
      });
      return;
    }

    if (action === "font-up") {
      runActiveEditorAction(siteContent, () => {
        adjustActiveDebugEditorFontSize(1);
      });
      return;
    }

    if (action === "font-down") {
      runActiveEditorAction(siteContent, () => {
        adjustActiveDebugEditorFontSize(-1);
      });
    }
  });

  window.addEventListener("hashchange", remapLegacyHash);
  window.addEventListener("scroll", () => {
    hideDebugHoverBadge(refs.debugHoverBadge);
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (activeLightbox) {
        event.preventDefault();
        zoomLightboxFromWheel(event);
        return;
      }

      if (wheelStepLocked) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 4) {
        return;
      }

      if (
        event.target.closest?.(
          "input, textarea, select, [contenteditable='true'], #debug-panel"
        )
      ) {
        return;
      }

      event.preventDefault();
      const nextDirection = event.deltaY > 0 ? 1 : -1;

      if (nextDirection !== wheelDirection) {
        wheelDirection = nextDirection;
        wheelTickCount = 0;
      }

      wheelTickCount += 1;
      if (wheelTickCount < WHEEL_TICKS_PER_STEP) {
        return;
      }

      wheelTickCount = 0;
      wheelStepLocked = true;

      const currentIndex = getActiveRowIndexForWheelStep();
      const nextIndex = nextDirection > 0 ? currentIndex + 1 : currentIndex - 1;
      goToRowByIndex(nextIndex, "smooth");

      window.setTimeout(() => {
        wheelStepLocked = false;
      }, WHEEL_STEP_LOCK_MS);
    },
    { passive: false }
  );

  document.addEventListener("pointermove", (event) => {
    if (!state.debug) {
      hideDebugHoverBadge(refs.debugHoverBadge);
      clearDebugHoveredImageRowId();
      return;
    }

    handleDebugHoverPointerMove(event, refs.debugHoverBadge);

    const hoveredFigure = event.target.closest?.(
      ".site-row__figure[data-debug-image-row]"
    );

    if (!hoveredFigure || !state.debugImageTools.resizeEnabled) {
      clearDebugHoveredImageRowId();
      return;
    }

    setDebugHoveredImageRowId(
      hoveredFigure.dataset.debugImageRow,
      hoveredFigure.getBoundingClientRect().height
    );
  });

  document.addEventListener("pointerdown", () => {
    hideDebugHoverBadge(refs.debugHoverBadge);
  });

  document.addEventListener("click", (event) => {
    const imageTarget = event.target.closest?.(".site-row__figure img");
    const toggleTarget = event.target.closest?.("[data-debug-toggle-image]");

    if (
      imageTarget &&
      !(state.debug && toggleTarget && event.ctrlKey)
    ) {
      event.preventDefault();
      openImageLightbox(imageTarget);
      return;
    }

    if (!toggleTarget || !state.debug) {
      return;
    }

    if (!event.ctrlKey) {
      return;
    }

    const rowId = toggleTarget.dataset.debugToggleImage;
    const variantCount = Number.parseInt(
      toggleTarget.dataset.debugVariantCount || "0",
      10
    );

    toggleDebugImageVariant(rowId, variantCount);
    commitDebugState(false);
  });

  document.addEventListener("keydown", (event) => {
    const toggleTarget = event.target.closest?.("[data-debug-toggle-image]");
    if (!toggleTarget || !state.debug || !event.ctrlKey) {
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
    commitDebugState(false);
  });

  document.addEventListener("focusin", (event) => {
    const editor = getEditorFromEventTarget(event.target);
    if (!state.debug) {
      return;
    }

    if (editor) {
      setActiveDebugEditorKey(editor.dataset.debugEditorKey);
      const siteContent = getSiteContent(state);
      syncDebugToolbarState(refs, siteContent);
      return;
    }

    if (!event.target.closest?.("#debug-panel")) {
      clearActiveDebugEditorKey();
      const siteContent = getSiteContent(state);
      syncDebugToolbarState(refs, siteContent);
    }
  });

  document.addEventListener("selectionchange", () => {
    if (!state.debug) {
      return;
    }

    rememberDebugEditorSelection(getActiveEditor());
  });

  document.addEventListener("input", (event) => {
    const editor = getEditorFromEventTarget(event.target);
    if (!editor || !state.debug) {
      return;
    }

    updateDebugEditorHTML(editor.dataset.debugEditorKey, editor.innerHTML);
    persistDebugState(state);
  });

  document.addEventListener("paste", (event) => {
    const editor = getEditorFromEventTarget(event.target);
    if (!editor || !state.debug) {
      return;
    }

    event.preventDefault();
    insertSanitizedContent(
      editor,
      event.clipboardData?.getData("text/html"),
      event.clipboardData?.getData("text/plain")
    );
    persistEditor(editor);
    persistDebugState(state);
  });

  document.addEventListener("keydown", (event) => {
    const editor = getEditorFromEventTarget(event.target);
    if (!editor || !state.debug) {
      return;
    }

    const siteContent = getSiteContent(state);
    handleDebugEditorShortcut(event, {
      onBold: () =>
        runActiveEditorAction(siteContent, (activeEditor) => {
          applyInlineCommand(activeEditor, "bold");
        }),
      onItalic: () =>
        runActiveEditorAction(siteContent, (activeEditor) => {
          applyInlineCommand(activeEditor, "italic");
        }),
      onAlignCycle: () =>
        runActiveEditorAction(siteContent, () => {
          cycleActiveDebugEditorAlign();
        }),
      onFontIncrease: () =>
        runActiveEditorAction(siteContent, () => {
          adjustActiveDebugEditorFontSize(1);
        }),
      onFontDecrease: () =>
        runActiveEditorAction(siteContent, () => {
          adjustActiveDebugEditorFontSize(-1);
        }),
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!state.debug || !state.debugImageTools.resizeEnabled) {
      return;
    }

    if (getEditorFromEventTarget(event.target)) {
      return;
    }

    if (event.target.closest?.("input, select, button")) {
      return;
    }

    const hoveredFigure = getHoveredImageFigure();
    if (!hoveredFigure) {
      return;
    }

    handleDebugImageShortcut(event, {
      onIncrease: () => {
        adjustDebugHoveredImageAreaHeight(
          1,
          hoveredFigure.getBoundingClientRect().height
        );
        commitDebugState(false);
      },
      onDecrease: () => {
        adjustDebugHoveredImageAreaHeight(
          -1,
          hoveredFigure.getBoundingClientRect().height
        );
        commitDebugState(false);
      },
    });
  });
}

const persistedDebugState = loadPersistedDebugState();
parseInitialState(persistedDebugState);
const showFallback = applyModeFallback();
renderAll(showFallback);
remapLegacyHash();
bindEvents();
