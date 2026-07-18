const activeScrollLocks = new Map();

function getScrollbarWidth() {
  return Math.max(
    0,
    window.innerWidth - document.documentElement.clientWidth
  );
}

/**
 * Lock document scrolling while preserving the current content width.
 *
 * @param {string} lockId - Stable identifier for the requesting overlay.
 * @param {string} bodyClass - Body class that applies the overflow lock.
 * @returns {void}
 * @sideEffects Adds a body class and a scrollbar compensation CSS variable.
 */
export function lockDocumentScroll(lockId, bodyClass) {
  if (!lockId || !bodyClass || activeScrollLocks.has(lockId)) {
    return;
  }

  if (activeScrollLocks.size === 0) {
    document.body.style.setProperty(
      "--scroll-lock-compensation",
      `${getScrollbarWidth()}px`
    );
  }

  activeScrollLocks.set(lockId, bodyClass);
  document.body.classList.add(bodyClass);
}

/**
 * Release one document scroll lock.
 *
 * @param {string} lockId - Identifier passed to lockDocumentScroll.
 * @returns {void}
 * @sideEffects Removes the matching body class and final compensation variable.
 */
export function unlockDocumentScroll(lockId) {
  const bodyClass = activeScrollLocks.get(lockId);
  if (!bodyClass) {
    return;
  }

  activeScrollLocks.delete(lockId);
  document.body.classList.remove(bodyClass);

  if (activeScrollLocks.size === 0) {
    document.body.style.removeProperty("--scroll-lock-compensation");
  }
}
