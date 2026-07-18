/**
 * Create the hash and navbar sync controller for visible lignes.
 *
 * @param {{
 *   getHashForRowId: (rowId: string) => string,
 *   setActiveNavLink: (rowId: string) => void
 * }} options
 * @returns {{sync: (rowId: string | null) => void, reset: () => void}}
 */
export function createScrollHashSync(options) {
  const { getHashForRowId, setActiveNavLink } = options;
  let lastSyncedRowId = null;

  function sync(rowId) {
    if (!rowId) {
      return;
    }

    setActiveNavLink(rowId);

    const targetHash = `#${getHashForRowId(rowId)}`;
    if (rowId === lastSyncedRowId && window.location.hash === targetHash) {
      return;
    }

    lastSyncedRowId = rowId;
    if (window.location.hash === targetHash) {
      return;
    }

    const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function reset() {
    lastSyncedRowId = null;
  }

  return {
    sync,
    reset,
  };
}
