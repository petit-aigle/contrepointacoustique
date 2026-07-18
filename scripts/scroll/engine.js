const NAVIGATION_EPSILON_PX = 2;
const NAVIGATION_SCROLL_IDLE_MS = 120;
const NAVIGATION_COMMAND_GRACE_MS = 850;
const NAVIGATION_MAX_DURATION_MS = 2800;
const NAVIGATION_MAX_CORRECTIONS = 2;
const USER_SCROLL_LAYOUT_RELEASE_MS = 240;

function getNativeScrollBehavior(requestedBehavior, reduceMotion) {
  if (reduceMotion || requestedBehavior === "auto") {
    return "auto";
  }

  return "smooth";
}

/**
 * Create the native scroll navigation and ligne focus controller.
 *
 * @param {{
 *   getScrollY?: () => number,
 *   setScrollY?: (scrollY: number, behavior: "auto"|"smooth") => void,
 *   getRowScrollY: (rowId: string) => number|null,
 *   getFocusedRowId: (currentRowId: string|null) => string|null,
 *   captureViewportAnchor: (rowId: string|null) => ({rowId: string, contentTop: number}|null),
 *   restoreViewportAnchor: (anchor: {rowId: string, contentTop: number}|null) => boolean,
 *   shouldReduceMotion?: () => boolean,
 *   onActiveRowChange?: (rowId: string, context: {reason: string, isNavigating: boolean}) => void
 * }} options - Native scroll dependencies and callbacks.
 * @returns {{
 *   navigateToRow: (rowId: string, navigationOptions?: {behavior?: "auto"|"smooth"}) => boolean,
 *   handleScroll: () => void,
 *   handleScrollEnd: () => void,
 *   noteUserScrollIntent: () => void,
 *   syncActiveRow: (force?: boolean) => void,
 *   captureCurrentViewportAnchor: () => ({rowId: string, contentTop: number}|null),
 *   restoreCapturedViewportAnchor: (anchor: {rowId: string, contentTop: number}|null) => void,
 *   refreshLayout: (refreshOptions?: {preserveAnchor?: boolean}) => void,
 *   observeLayout: (elements: HTMLElement[]) => void,
 *   cancelNavigation: () => void
 * }} Native scroll controller.
 * @sideEffects May scroll the document, schedule frames and timers, and observe layout.
 */
export function createNativeScrollController(options) {
  const {
    getRowScrollY,
    getFocusedRowId,
    captureViewportAnchor,
    restoreViewportAnchor,
    onActiveRowChange,
  } = options;
  const getScrollY = options.getScrollY || (() => window.scrollY);
  const setScrollY =
    options.setScrollY ||
    ((scrollY, behavior) => window.scrollTo({ top: scrollY, behavior }));
  const shouldReduceMotion = options.shouldReduceMotion || (() => false);

  const state = {
    activeRowId: null,
    viewportAnchor: null,
    activeFrameId: 0,
    layoutFrameId: 0,
    settleTimeoutId: 0,
    lastScrollAt: 0,
    pendingNavigation: null,
    resizeObserver: null,
    pendingLayoutAnchor: null,
    shouldPreserveLayoutAnchor: false,
    isUserScrollActive: false,
    userScrollReleaseTimeoutId: 0,
  };

  function clearUserScrollReleaseTimer() {
    if (!state.userScrollReleaseTimeoutId) {
      return;
    }

    window.clearTimeout(state.userScrollReleaseTimeoutId);
    state.userScrollReleaseTimeoutId = 0;
  }

  function releaseUserScroll() {
    clearUserScrollReleaseTimer();
    state.isUserScrollActive = false;
  }

  function scheduleUserScrollRelease() {
    clearUserScrollReleaseTimer();
    state.userScrollReleaseTimeoutId = window.setTimeout(
      releaseUserScroll,
      USER_SCROLL_LAYOUT_RELEASE_MS
    );
  }

  function clearSettleTimer() {
    if (!state.settleTimeoutId) {
      return;
    }

    window.clearTimeout(state.settleTimeoutId);
    state.settleTimeoutId = 0;
  }

  function scheduleSettleCheck(delayMs = NAVIGATION_COMMAND_GRACE_MS) {
    if (!state.pendingNavigation) {
      return;
    }

    clearSettleTimer();
    state.settleTimeoutId = window.setTimeout(() => {
      state.settleTimeoutId = 0;
      settlePendingNavigation(false);
    }, Math.max(0, delayMs));
  }

  function updateViewportAnchor(rowId = state.activeRowId) {
    if (state.pendingNavigation) {
      return;
    }

    state.viewportAnchor = captureViewportAnchor(rowId);
  }

  function emitActiveRow(reason, force = false) {
    if (state.pendingNavigation) {
      return;
    }

    const nextRowId = getFocusedRowId(state.activeRowId);
    if (!nextRowId) {
      return;
    }

    const didChange = nextRowId !== state.activeRowId;
    state.activeRowId = nextRowId;
    updateViewportAnchor(nextRowId);

    if (didChange || force) {
      onActiveRowChange?.(nextRowId, {
        reason,
        isNavigating: false,
      });
    }
  }

  function runActiveFrame() {
    state.activeFrameId = 0;
    emitActiveRow("scroll");
  }

  function scheduleActiveFrame() {
    if (state.activeFrameId) {
      return;
    }

    state.activeFrameId = window.requestAnimationFrame(runActiveFrame);
  }

  function commandPendingNavigation(targetY, behavior) {
    const pendingNavigation = state.pendingNavigation;
    if (!pendingNavigation) {
      return;
    }

    const now = performance.now();
    pendingNavigation.lastTargetY = targetY;

    pendingNavigation.lastCommandAt = now;
    state.lastScrollAt = now;
    setScrollY(targetY, behavior);
    scheduleSettleCheck();
  }

  function finishPendingNavigation() {
    const pendingNavigation = state.pendingNavigation;
    if (!pendingNavigation) {
      return;
    }

    clearSettleTimer();
    state.pendingNavigation = null;
    state.activeRowId = pendingNavigation.rowId;
    updateViewportAnchor(pendingNavigation.rowId);
    onActiveRowChange?.(pendingNavigation.rowId, {
      reason: "navigation-settled",
      isNavigating: false,
    });
  }

  function forcePendingNavigationTarget(targetY) {
    setScrollY(targetY, "auto");
    window.requestAnimationFrame(finishPendingNavigation);
  }

  function correctPendingNavigationAfterLayout() {
    const pendingNavigation = state.pendingNavigation;
    if (!pendingNavigation) {
      return;
    }

    const targetY = getRowScrollY(pendingNavigation.rowId);
    if (!Number.isFinite(targetY)) {
      cancelNavigation();
      scheduleActiveFrame();
      return;
    }

    const didTargetMove =
      Math.abs(targetY - pendingNavigation.lastTargetY) > NAVIGATION_EPSILON_PX;
    if (didTargetMove) {
      commandPendingNavigation(
        targetY,
        getNativeScrollBehavior(
          pendingNavigation.behavior,
          shouldReduceMotion()
        )
      );
    }

    scheduleSettleCheck(NAVIGATION_SCROLL_IDLE_MS);
  }

  function settlePendingNavigation(force) {
    const pendingNavigation = state.pendingNavigation;
    if (!pendingNavigation) {
      return;
    }

    const now = performance.now();
    const idleDuration = now - state.lastScrollAt;
    if (!force && idleDuration < NAVIGATION_SCROLL_IDLE_MS) {
      scheduleSettleCheck(NAVIGATION_SCROLL_IDLE_MS - idleDuration);
      return;
    }

    const targetY = getRowScrollY(pendingNavigation.rowId);
    if (!Number.isFinite(targetY)) {
      cancelNavigation();
      scheduleActiveFrame();
      return;
    }

    if (Math.abs(targetY - pendingNavigation.lastTargetY) > NAVIGATION_EPSILON_PX) {
      pendingNavigation.lastTargetY = targetY;
    }

    const distanceToTarget = Math.abs(getScrollY() - targetY);
    if (distanceToTarget <= NAVIGATION_EPSILON_PX) {
      finishPendingNavigation();
      return;
    }

    const navigationAge = now - pendingNavigation.startedAt;
    const commandAge = now - pendingNavigation.lastCommandAt;
    const correctionLimitReached =
      pendingNavigation.correctionCount >= NAVIGATION_MAX_CORRECTIONS;

    if (
      navigationAge >= NAVIGATION_MAX_DURATION_MS ||
      correctionLimitReached
    ) {
      forcePendingNavigationTarget(targetY);
      return;
    }

    if (!force && commandAge < NAVIGATION_COMMAND_GRACE_MS) {
      scheduleSettleCheck(NAVIGATION_COMMAND_GRACE_MS - commandAge);
      return;
    }

    pendingNavigation.correctionCount += 1;
    commandPendingNavigation(targetY, pendingNavigation.behavior);
  }

  function runLayoutRefresh() {
    state.layoutFrameId = 0;

    if (
      state.shouldPreserveLayoutAnchor &&
      !state.pendingNavigation &&
      state.pendingLayoutAnchor
    ) {
      restoreViewportAnchor(state.pendingLayoutAnchor);
    }

    state.shouldPreserveLayoutAnchor = false;
    state.pendingLayoutAnchor = null;

    if (state.pendingNavigation) {
      correctPendingNavigationAfterLayout();
      return;
    }

    emitActiveRow("layout");
  }

  /**
   * Navigate to a ligne with native browser scrolling.
   *
   * @param {string} rowId - Canonical ligne id.
   * @param {{behavior?: "auto"|"smooth"}} [navigationOptions] - Requested motion.
   * @returns {boolean} Whether navigation started.
   * @sideEffects Updates active state and scrolls the document.
   */
  function navigateToRow(rowId, navigationOptions = {}) {
    const targetY = getRowScrollY(rowId);
    if (!Number.isFinite(targetY)) {
      return false;
    }

    cancelNavigation();
    const behavior = getNativeScrollBehavior(
      navigationOptions.behavior || "smooth",
      shouldReduceMotion()
    );
    const now = performance.now();
    state.pendingNavigation = {
      rowId,
      behavior,
      startedAt: now,
      lastCommandAt: 0,
      lastTargetY: targetY,
      correctionCount: 0,
    };
    state.activeRowId = rowId;
    onActiveRowChange?.(rowId, {
      reason: "navigation-start",
      isNavigating: true,
    });
    commandPendingNavigation(targetY, behavior);
    return true;
  }

  /**
   * Record a native document scroll event.
   *
   * @returns {void}
   * @sideEffects Schedules active ligne and navigation-settle work.
   */
  function handleScroll() {
    state.lastScrollAt = performance.now();
    if (state.isUserScrollActive) {
      scheduleUserScrollRelease();
    }
    scheduleActiveFrame();

    if (state.pendingNavigation) {
      scheduleSettleCheck(NAVIGATION_SCROLL_IDLE_MS);
    }
  }

  /**
   * Record the browser's native scroll-end signal.
   *
   * @returns {void}
   * @sideEffects May correct or finish explicit navigation.
   */
  function handleScrollEnd() {
    releaseUserScroll();

    if (state.pendingNavigation) {
      settlePendingNavigation(true);
      return;
    }

    emitActiveRow("scroll-end");
  }

  /**
   * Cancel explicit navigation when native user scrolling begins.
   *
   * @returns {void}
   * @sideEffects Cancels pending navigation timers.
   */
  function noteUserScrollIntent() {
    cancelNavigation();
    state.isUserScrollActive = true;
    scheduleUserScrollRelease();
    state.pendingLayoutAnchor = null;
    state.shouldPreserveLayoutAnchor = false;
    scheduleActiveFrame();
  }

  /**
   * Synchronize the focused ligne immediately.
   *
   * @param {boolean} [force=false] - Emit even when the ligne is unchanged.
   * @returns {void}
   * @sideEffects Updates active state and may invoke the callback.
   */
  function syncActiveRow(force = false) {
    emitActiveRow("sync", force);
  }

  /**
   * Capture the current focused ligne position in the viewport.
   *
   * @returns {{rowId: string, contentTop: number}|null} Viewport anchor.
   * @sideEffects Reads the current layout.
   */
  function captureCurrentViewportAnchor() {
    return captureViewportAnchor(state.activeRowId);
  }

  /**
   * Restore a captured ligne position after synchronous content rendering.
   *
   * @param {{rowId: string, contentTop: number}|null} anchor - Saved viewport anchor.
   * @returns {void}
   * @sideEffects Cancels navigation and may update document scroll position.
   */
  function restoreCapturedViewportAnchor(anchor) {
    cancelNavigation();
    restoreViewportAnchor(anchor);
    emitActiveRow("render", true);
  }

  /**
   * Refresh focused ligne state after viewport or content layout changes.
   *
   * @param {{preserveAnchor?: boolean}} [refreshOptions] - Layout refresh policy.
   * @returns {void}
   * @sideEffects Schedules a frame and may preserve the current ligne position.
   */
  function refreshLayout(refreshOptions = {}) {
    const shouldPreserveAnchor =
      Boolean(refreshOptions.preserveAnchor) && !state.isUserScrollActive;

    if (shouldPreserveAnchor && !state.pendingLayoutAnchor) {
      state.pendingLayoutAnchor = state.viewportAnchor;
    }
    state.shouldPreserveLayoutAnchor =
      state.shouldPreserveLayoutAnchor || shouldPreserveAnchor;

    if (state.layoutFrameId) {
      return;
    }

    state.layoutFrameId = window.requestAnimationFrame(runLayoutRefresh);
  }

  /**
   * Observe elements whose size changes affect scroll geometry.
   *
   * @param {HTMLElement[]} elements - Navbar, main area and ligne sections.
   * @returns {void}
   * @sideEffects Replaces the active ResizeObserver.
   */
  function observeLayout(elements) {
    state.resizeObserver?.disconnect();
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    state.resizeObserver = new ResizeObserver(() => {
      refreshLayout({ preserveAnchor: true });
    });
    elements.filter(Boolean).forEach((element) => {
      state.resizeObserver.observe(element);
    });
  }

  /**
   * Cancel pending explicit navigation.
   *
   * @returns {void}
   * @sideEffects Clears navigation timers and state.
   */
  function cancelNavigation() {
    const shouldStopNativeScroll = Boolean(state.pendingNavigation);
    clearSettleTimer();
    state.pendingNavigation = null;

    if (shouldStopNativeScroll) {
      setScrollY(getScrollY(), "auto");
    }
  }

  return {
    navigateToRow,
    handleScroll,
    handleScrollEnd,
    noteUserScrollIntent,
    syncActiveRow,
    captureCurrentViewportAnchor,
    restoreCapturedViewportAnchor,
    refreshLayout,
    observeLayout,
    cancelNavigation,
  };
}
