import {
  getCanonicalHashTarget,
  getHashForRowId,
  getNavbarTargetForRowId,
} from "./data/site-content.js?v=20261013b";
import {
  captureRowViewportAnchor,
  getRowAtViewportFocus,
  getRowNavigationScrollY,
  getRowSectionById,
  getStickyNavbarOffset,
  restoreRowViewportAnchor,
} from "./scroll/geometry.js?v=20261013b";
import { createNativeScrollController } from "./scroll/engine.js?v=20261013b";
import { createScrollHashSync } from "./scroll/hash-sync.js?v=20261013b";
import { normalizePublicUrl } from "./state.js?v=20261013b";
import { initializeAdaptiveTextCurve } from "./rows/text-curve.js?v=20261013d";
import { initializeImageViewer } from "./media/image-viewer.js?v=20261013b";

const refs = {
  navbar: document.querySelector("header.navbar"),
  navbarNav: document.getElementById("navbar-nav"),
  navbarMenuToggle: document.getElementById("navbar-menu-toggle"),
  navbarMenuToggleText: document.getElementById("navbar-menu-toggle-text"),
  rowSections: Array.from(document.querySelectorAll(".site-row[data-row]")),
};

let activeRowId = getCanonicalHashTarget(window.location.hash) || null;
const MOBILE_NAV_MEDIA_QUERY = "(max-width: 1365px)";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
const mobileNavMediaQuery = window.matchMedia(MOBILE_NAV_MEDIA_QUERY);
const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);

let isMobileNavMenuOpen = false;
let lastViewportWidth = window.innerWidth;
let navbarResizeObserver = null;

function setActiveNavLink(targetId) {
  const navbarTargetId = getNavbarTargetForRowId(targetId);
  document
    .querySelectorAll(".navbar__link[data-nav-target]")
    .forEach((link) => {
      const isActive = link.dataset.navTarget === navbarTargetId;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
}

const hashSync = createScrollHashSync({
  getHashForRowId,
  setActiveNavLink,
});

function getPreferredActiveRowId() {
  return (
    activeRowId ||
    getCanonicalHashTarget(window.location.hash) ||
    refs.rowSections[0]?.id ||
    "line-01"
  );
}

function setCurrentActiveRow(targetId) {
  if (!targetId) {
    return;
  }

  activeRowId = targetId;
}

function isMobileNavbarViewport() {
  return mobileNavMediaQuery.matches;
}

function syncNavbarHeightVariable() {
  const navbarHeight = getStickyNavbarOffset(refs.navbar);
  document.documentElement.style.setProperty(
    "--navbar-height",
    `${navbarHeight}px`,
  );
}

function observeNavbarHeight() {
  navbarResizeObserver?.disconnect();
  if (!refs.navbar || typeof ResizeObserver === "undefined") {
    return;
  }

  navbarResizeObserver = new ResizeObserver(() => {
    syncNavbarHeightVariable();
    scrollController.refreshLayout();
  });
  navbarResizeObserver.observe(refs.navbar);
}

function syncMobileNavbarMenuState() {
  if (!refs.navbar || !refs.navbarMenuToggle) {
    return;
  }

  const isOpen = isMobileNavbarViewport() && isMobileNavMenuOpen;
  refs.navbar.classList.toggle("is-menu-open", isOpen);
  refs.navbarMenuToggle.setAttribute("aria-expanded", String(isOpen));
  syncNavbarHeightVariable();
}

function openMobileNavbarMenu() {
  if (!isMobileNavbarViewport()) {
    return;
  }

  isMobileNavMenuOpen = true;
  syncMobileNavbarMenuState();
}

function closeMobileNavbarMenu() {
  isMobileNavMenuOpen = false;
  syncMobileNavbarMenuState();
}

function toggleMobileNavbarMenu() {
  if (isMobileNavMenuOpen) {
    closeMobileNavbarMenu();
    return;
  }

  openMobileNavbarMenu();
}

function isScrollInputTarget(target) {
  return Boolean(
    target?.closest?.(
      "input, textarea, select, button, a, summary, [role=dialog]",
    ),
  );
}

function getCanonicalHashTargetId() {
  const targetId = getCanonicalHashTarget(window.location.hash);
  if (!targetId) {
    return null;
  }

  const currentHash = window.location.hash.replace(/^#/, "");
  const canonicalHash = getHashForRowId(targetId);
  if (currentHash !== canonicalHash) {
    const nextUrl = `${window.location.pathname}${window.location.search}#${canonicalHash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  return targetId;
}

function scrollToRow(targetId) {
  scrollController.navigateToRow(targetId);
}

function navigateToHashTarget() {
  const targetId = getCanonicalHashTargetId();
  if (!targetId) {
    scrollController.syncActiveRow(true);
    return;
  }

  scrollToRow(targetId);
}

function handleActiveRowChange(targetId) {
  if (!targetId) {
    return;
  }

  setCurrentActiveRow(targetId);
  hashSync.sync(targetId);
}

const scrollController = createNativeScrollController({
  getScrollY: () => window.scrollY,
  setScrollY: (scrollY, behavior) => {
    window.scrollTo({ top: scrollY, behavior });
  },
  getRowScrollY: (rowId) => {
    const rowSection = getRowSectionById(refs.rowSections, rowId);
    if (!rowSection) {
      return null;
    }

    return getRowNavigationScrollY(
      rowSection,
      getStickyNavbarOffset(refs.navbar),
    );
  },
  getFocusedRowId: (currentRowId) =>
    getRowAtViewportFocus(refs.rowSections, {
      navbarOffset: getStickyNavbarOffset(refs.navbar),
      currentRowId,
    })?.id || null,
  captureViewportAnchor: (rowId) =>
    captureRowViewportAnchor(
      getRowSectionById(refs.rowSections, rowId),
      getStickyNavbarOffset(refs.navbar),
    ),
  restoreViewportAnchor: (anchor) =>
    restoreRowViewportAnchor(
      refs.rowSections,
      anchor,
      getStickyNavbarOffset(refs.navbar),
    ),
  shouldReduceMotion: () => reducedMotionMediaQuery.matches,
  onActiveRowChange: handleActiveRowChange,
});

function initializeContent() {
  const preferredRowId =
    getCanonicalHashTarget(window.location.hash) || getPreferredActiveRowId();
  syncMobileNavbarMenuState();
  setActiveNavLink(preferredRowId);
  navigateToHashTarget();
}

function bindEvents() {
  refs.navbarMenuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMobileNavbarMenu();
  });

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

    closeMobileNavbarMenu();
    scrollToRow(targetId);
    getRowSectionById(refs.rowSections, targetId)?.focus({
      preventScroll: true,
    });
  });

  document.getElementById("language-nav").addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (link && window.location.hash) {
      link.hash = window.location.hash;
    }
  });

  document.addEventListener("click", (event) => {
    if (!isMobileNavbarViewport() || !isMobileNavMenuOpen) {
      return;
    }

    if (event.target.closest?.(".navbar")) {
      return;
    }

    closeMobileNavbarMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    scrollController.cancelNavigation();
    if (isMobileNavMenuOpen) {
      closeMobileNavbarMenu();
      refs.navbarMenuToggle.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "PageDown" &&
      event.key !== "PageUp" &&
      event.key !== "Home" &&
      event.key !== "End" &&
      event.key !== " " &&
      event.key !== "Spacebar"
    ) {
      return;
    }

    if (isScrollInputTarget(event.target)) {
      return;
    }

    scrollController.noteUserScrollIntent();
  });

  window.addEventListener("resize", () => {
    const didViewportWidthChange = window.innerWidth !== lastViewportWidth;
    lastViewportWidth = window.innerWidth;

    if (!isMobileNavbarViewport()) {
      closeMobileNavbarMenu();
    } else {
      syncMobileNavbarMenuState();
    }

    syncNavbarHeightVariable();
    scrollController.refreshLayout({
      preserveAnchor: didViewportWidthChange,
    });
  });

  window.visualViewport?.addEventListener(
    "resize",
    () => {
      syncNavbarHeightVariable();
      scrollController.refreshLayout();
    },
    { passive: true },
  );

  if (mobileNavMediaQuery.addEventListener) {
    mobileNavMediaQuery.addEventListener("change", () => {
      if (!isMobileNavbarViewport()) {
        closeMobileNavbarMenu();
        return;
      }

      syncMobileNavbarMenuState();
    });
  } else if (mobileNavMediaQuery.addListener) {
    mobileNavMediaQuery.addListener(() => {
      if (!isMobileNavbarViewport()) {
        closeMobileNavbarMenu();
        return;
      }

      syncMobileNavbarMenuState();
    });
  }

  window.addEventListener("hashchange", () => {
    navigateToHashTarget();
  });
  window.addEventListener("scroll", () => {
    scrollController.handleScroll();
  });
  window.addEventListener("scrollend", () => {
    scrollController.handleScrollEnd();
  });

  window.addEventListener(
    "wheel",
    () => {
      scrollController.noteUserScrollIntent();
    },
    { passive: true },
  );

  document.addEventListener(
    "touchstart",
    () => {
      scrollController.noteUserScrollIntent();
    },
    { passive: true },
  );

  document.addEventListener("pointerdown", () => {
    scrollController.noteUserScrollIntent();
  });
}

if (!normalizePublicUrl()) {
  document.documentElement.classList.add("has-js");
  refs.navbarMenuToggle.hidden = false;
  initializeContent();
  bindEvents();
  initializeImageViewer();
  initializeAdaptiveTextCurve();
  observeNavbarHeight();
  scrollController.observeLayout([
    document.querySelector(".site-main"),
    refs.navbar,
    ...refs.rowSections,
  ]);
  scrollController.refreshLayout();
}
