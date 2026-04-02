/**
 * Create the reveal observer used to animate lignes once.
 *
 * @returns {IntersectionObserver}
 */
export function createRevealObserver() {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
}

/**
 * Attach the reveal observer to each revealable element once.
 *
 * @param {IntersectionObserver} revealObserver
 * @returns {void}
 */
export function observeRevealItems(revealObserver) {
  document.querySelectorAll(".reveal").forEach((element) => {
    if (element.dataset.revealObserved) {
      return;
    }

    element.dataset.revealObserved = "1";
    revealObserver.observe(element);
  });
}

/**
 * Observe visible lignes and report the current active row.
 *
 * @param {{onActiveRowChange?: (rowId: string) => void}=} options
 * @returns {{refresh: () => void}}
 */
export function createSectionObserver(options = {}) {
  const { onActiveRowChange } = options;
  let lastActiveRowId = null;

  const observer = new IntersectionObserver(
    (entries) => {
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      if (!intersectingEntries.length) {
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const nextActiveEntry = intersectingEntries.reduce((bestMatch, entry) => {
        const rect = entry.target.getBoundingClientRect();
        const distanceToCenter = Math.abs(
          rect.top + rect.height / 2 - viewportCenter
        );

        if (!bestMatch || distanceToCenter < bestMatch.distanceToCenter) {
          return {
            entry,
            distanceToCenter,
          };
        }

        return bestMatch;
      }, null);

      const nextActiveRowId = nextActiveEntry?.entry?.target?.id;
      if (!nextActiveRowId || nextActiveRowId === lastActiveRowId) {
        return;
      }

      lastActiveRowId = nextActiveRowId;
      onActiveRowChange?.(nextActiveRowId);
    },
    {
      threshold: 0,
      rootMargin: "-40% 0px -45% 0px",
    }
  );

  return {
    refresh() {
      observer.disconnect();

      document.querySelectorAll(".site-row[data-row]").forEach((section) => {
        observer.observe(section);
      });
    },
  };
}
