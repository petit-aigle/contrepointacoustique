const FOCUSABLE_SELECTOR =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex='0']";

/**
 * Confine keyboard focus to an open modal and isolate its background.
 *
 * @param {HTMLElement} modal - Modal already attached directly to the document body.
 * @param {HTMLElement} initialFocus - Control to focus when opening.
 * @returns {() => void} Cleanup that restores background access and the previous focus.
 * @sideEffects Sets inert on body siblings, traps focus, and moves keyboard focus.
 */
export function manageModalFocus(modal, initialFocus) {
  const previousFocus = document.activeElement;
  const siblings = Array.from(document.body.children).filter(
    (element) => element !== modal,
  );
  const previousInert = siblings.map((element) => [element, element.inert]);
  siblings.forEach((element) => {
    element.inert = true;
  });

  const onKeyDown = (event) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = controls[0];
    const last = controls.at(-1);
    if (!first) {
      event.preventDefault();
      modal.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const onFocusIn = (event) => {
    if (!modal.contains(event.target)) initialFocus.focus();
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("focusin", onFocusIn);
  initialFocus.focus({ preventScroll: true });

  return () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("focusin", onFocusIn);
    previousInert.forEach(([element, inert]) => {
      element.inert = inert;
    });
    if (previousFocus?.isConnected)
      previousFocus.focus({ preventScroll: true });
  };
}
