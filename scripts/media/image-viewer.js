import {
  lockDocumentScroll,
  unlockDocumentScroll,
} from "../scroll/scroll-lock.js?v=20261013b";
import { manageModalFocus } from "../accessibility/modal-focus.js?v=20261013b";

const labels = JSON.parse(
  document.getElementById("site-interface").textContent,
);
const stackedRowMediaQuery = window.matchMedia("(max-width: 860px)");
const reducedMotionMediaQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let activeLightbox = null;
const LIGHTBOX_BG_PHASE_MS = 1200;
const LIGHTBOX_IMAGE_PHASE_MS = 840;
const LIGHTBOX_OPEN_IMAGE_DELAY_MS = 100;
const LIGHTBOX_CLOSE_BG_DELAY_MS = 400;
const LIGHTBOX_MIN_ZOOM = 1;
const LIGHTBOX_MAX_ZOOM = 3;
const LIGHTBOX_ZOOM_STEP = 0.16;
const LIGHTBOX_CLICK_ZOOM = 2;

function buildFullscreenRectForImage(imageElement) {
  const sourceRect = imageElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const sourceRatio =
    imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0
      ? imageElement.naturalWidth / imageElement.naturalHeight
      : sourceRect.width / Math.max(1, sourceRect.height);

  const isPhoneViewport = stackedRowMediaQuery.matches;

  let targetWidth;
  let targetHeight;
  let targetLeft;
  let targetTop;

  if (isPhoneViewport) {
    targetWidth = viewportWidth;
    targetHeight = targetWidth / sourceRatio;
    targetLeft = 0;
    targetTop = (viewportHeight - targetHeight) / 2;
  } else {
    targetHeight = viewportHeight;
    targetWidth = targetHeight * sourceRatio;
    targetLeft = (viewportWidth - targetWidth) / 2;
    targetTop = 0;
  }

  return {
    source: {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    },
    target: {
      left: targetLeft,
      top: targetTop,
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

function isLightboxInStableFullscreen(lightbox = activeLightbox) {
  if (!lightbox) {
    return false;
  }

  return !lightbox.isOpening && !lightbox.isClosing;
}

function canUseLightboxZoomAndPan(lightbox = activeLightbox) {
  if (!lightbox) {
    return false;
  }

  return !lightbox.disableZoomAndPan && isLightboxInStableFullscreen(lightbox);
}

function stopLightboxPanInteraction(lightbox = activeLightbox) {
  if (!lightbox) {
    return;
  }

  lightbox.isPanning = false;
  lightbox.didPanDuringDrag = false;

  if (lightbox.dragPointerId !== null) {
    try {
      lightbox.image.releasePointerCapture(lightbox.dragPointerId);
    } catch (error) {
      // Ignore capture mismatches while transitioning between states.
    }
    lightbox.dragPointerId = null;
  }

  lightbox.overlay.classList.remove("is-panning");
}

function syncLightboxInteractionState(lightbox = activeLightbox) {
  if (!lightbox) {
    return;
  }

  const canZoomAndPan = canUseLightboxZoomAndPan(lightbox);
  lightbox.zoomButtons?.forEach((button) => {
    button.disabled = !canZoomAndPan;
  });
  lightbox.overlay.classList.toggle("is-zoom-disabled", !canZoomAndPan);

  if (!canZoomAndPan) {
    stopLightboxPanInteraction(lightbox);
  }
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
    [
      { transform: `scale(${startScale})` },
      { transform: `scale(${endScale})` },
    ],
    {
      duration: LIGHTBOX_BG_PHASE_MS,
      easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      fill: "forwards",
    },
  );

  return waitForAnimationOrTimeout(
    backgroundAnimation,
    LIGHTBOX_BG_PHASE_MS + 140,
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
  activeLightbox.zoomStatus.textContent = `${Math.round(clampedZoom * 100)} %`;
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
  if (!canUseLightboxZoomAndPan()) {
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
    onWheel,
    onImagePointerDown,
    onWindowPointerMove,
    onWindowPointerUp,
  } = activeLightbox;
  activeLightbox.isClosing = true;
  syncLightboxInteractionState(activeLightbox);
  let didFinalize = false;

  const finalizeClose = () => {
    if (didFinalize) {
      return;
    }

    didFinalize = true;
    unlockDocumentScroll("image-lightbox");
    document.removeEventListener("keydown", onKeyDown);
    overlay.removeEventListener("wheel", onWheel);
    image.removeEventListener("pointerdown", onImagePointerDown);
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
    sourceImage.style.opacity = sourceImageInlineOpacity;
    activeLightbox.restoreFocus();
    overlay.remove();
    activeLightbox = null;
  };

  setLightboxZoom(1);
  if (reducedMotionMediaQuery.matches) {
    finalizeClose();
    return;
  }

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
    },
  );

  Promise.all([
    waitForAnimationOrTimeout(
      closeImageAnimation,
      LIGHTBOX_IMAGE_PHASE_MS + 140,
    ),
    waitMs(LIGHTBOX_CLOSE_BG_DELAY_MS).then(() =>
      runLightboxBackgroundPhase(overlay, overlayReveal, "close"),
    ),
  ]).finally(finalizeClose);
}

function openImageLightbox(sourceImage) {
  if (!sourceImage || activeLightbox) {
    return;
  }

  const sourceRow = sourceImage.closest(".site-row[data-row]");
  if (sourceRow?.id === "line-01") {
    return;
  }
  if (sourceRow?.id === "line-09" || sourceRow?.id === "line-10") {
    return;
  }
  const disableClickZoom =
    sourceRow?.id === "line-09" || sourceRow?.id === "line-10";

  const { source, target } = buildFullscreenRectForImage(sourceImage);
  const isFullyVisibleAtBaseScale =
    target.width <= window.innerWidth && target.height <= window.innerHeight;
  const disableZoomAndPan = !isFullyVisibleAtBaseScale;
  const overlayReveal = getLightboxOverlayReveal(source);
  const sourceFigure = sourceImage.closest(".site-row__figure");
  const sourceImageComputedStyle = window.getComputedStyle(sourceImage);
  const sourceFigureRadius = sourceFigure
    ? window.getComputedStyle(sourceFigure).borderRadius || "0px"
    : "0px";
  const sourceImageInlineOpacity = sourceImage.style.opacity || "";

  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute(
    "aria-label",
    `${labels.openImage} : ${sourceImage.alt}`,
  );
  overlay.tabIndex = -1;
  overlay.style.background = "transparent";

  const image = document.createElement("img");
  image.className = "image-lightbox__image";
  image.src =
    sourceImage.closest("a[href]")?.href ||
    sourceImage.currentSrc ||
    sourceImage.src;
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
  lockDocumentScroll("image-lightbox", "is-lightbox-open");
  sourceImage.style.opacity = "0";

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeImageLightbox();
      return;
    }
    if (!canUseLightboxZoomAndPan() || activeLightbox.zoom <= 1) return;
    const directions = {
      ArrowLeft: [40, 0],
      ArrowRight: [-40, 0],
      ArrowUp: [0, 40],
      ArrowDown: [0, -40],
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      activeLightbox.panX += direction[0];
      activeLightbox.panY += direction[1];
      confineLightboxPan();
    }
  };

  const onWheel = (event) => {
    event.preventDefault();
    zoomLightboxFromWheel(event);
  };

  const closeButton = document.createElement("button");
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", labels.closeImage);
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

    if (disableClickZoom || !canUseLightboxZoomAndPan(activeLightbox)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    toggleLightboxZoom(event.clientX, event.clientY);
  });

  const onImagePointerDown = (event) => {
    if (
      event.button !== 0 ||
      !activeLightbox ||
      !canUseLightboxZoomAndPan(activeLightbox) ||
      activeLightbox.zoom <= 1.01
    ) {
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

    if (activeLightbox.didPanDuringDrag) {
      activeLightbox.suppressNextImageClick = true;
    }
    stopLightboxPanInteraction(activeLightbox);
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
  overlay.addEventListener("wheel", onWheel, { passive: false });

  const zoomControls = document.createElement("div");
  zoomControls.className = "image-lightbox__controls";
  const zoomButtons = [
    [
      labels.zoomOut,
      "−",
      () => setLightboxZoom(activeLightbox.zoom - LIGHTBOX_ZOOM_STEP),
    ],
    [labels.resetZoom, "100 %", () => setLightboxZoom(1)],
    [
      labels.zoomIn,
      "+",
      () => setLightboxZoom(activeLightbox.zoom + LIGHTBOX_ZOOM_STEP),
    ],
  ].map(([label, text, action]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.textContent = text;
    button.addEventListener("click", action);
    zoomControls.appendChild(button);
    return button;
  });
  const zoomStatus = document.createElement("span");
  zoomStatus.className = "visually-hidden";
  zoomStatus.setAttribute("role", "status");
  zoomStatus.textContent = "100 %";
  overlay.append(closeButton, zoomControls, zoomStatus);
  document.addEventListener("keydown", onKeyDown);
  activeLightbox = {
    overlay,
    image,
    closeButton,
    zoomButtons,
    zoomStatus,
    restoreFocus: manageModalFocus(overlay, closeButton),
    sourceImage,
    sourceFigureRadius,
    sourceImageInlineOpacity,
    overlayReveal,
    onKeyDown,
    onWheel,
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
    disableZoomAndPan,
  };
  syncLightboxInteractionState(activeLightbox);

  if (reducedMotionMediaQuery.matches) {
    image.style.left = `${target.left}px`;
    image.style.top = `${target.top}px`;
    image.style.width = `${target.width}px`;
    image.style.height = `${target.height}px`;
    image.style.borderRadius = "0px";
    overlay.style.background = "#000000";
    activeLightbox.isOpening = false;
    syncLightboxInteractionState(activeLightbox);
    return;
  }

  const openImageAnimationPromise = waitMs(LIGHTBOX_OPEN_IMAGE_DELAY_MS).then(
    () =>
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
        },
      ),
  );

  Promise.all([
    runLightboxBackgroundPhase(overlay, overlayReveal, "open"),
    openImageAnimationPromise.then((animation) =>
      waitForAnimationOrTimeout(animation, LIGHTBOX_IMAGE_PHASE_MS + 140),
    ),
  ]).finally(() => {
    if (
      !activeLightbox ||
      activeLightbox.overlay !== overlay ||
      activeLightbox.isClosing
    ) {
      return;
    }

    activeLightbox.isOpening = false;
    if (activeLightbox.pendingClose) {
      closeImageLightbox();
      return;
    }

    overlay.style.background = "#000000";
    syncLightboxInteractionState(activeLightbox);
  });
}

/**
 * Enhance public image links with a keyboard-accessible fullscreen viewer.
 *
 * @returns {void}
 * @sideEffects Binds image link clicks; dialogs temporarily lock scrolling and focus.
 */
export function initializeImageViewer() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.(".site-row__image-link");
    if (
      !link ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    openImageLightbox(link.querySelector("img"));
  });
}
