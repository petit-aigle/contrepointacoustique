const TOP_PRIORITY_DISTANCE = 1;
const BACKGROUND_CONCURRENCY = 2;
const FULL_PAGE_EAGER_DELAY_MS = 2500;

function resolveActiveIndex(rowIds, activeRowId) {
  const index = rowIds.indexOf(activeRowId);
  return index >= 0 ? index : 0;
}

function buildPriorityOrder(rowIds, activeRowId) {
  if (!rowIds.length) {
    return [];
  }

  const activeIndex = resolveActiveIndex(rowIds, activeRowId);
  const orderedIds = [];

  for (let offset = 0; orderedIds.length < rowIds.length; offset += 1) {
    const previousIndex = activeIndex - offset;
    const nextIndex = activeIndex + offset;

    if (previousIndex >= 0) {
      orderedIds.push(rowIds[previousIndex]);
    }

    if (offset === 0) {
      continue;
    }

    if (nextIndex < rowIds.length) {
      orderedIds.push(rowIds[nextIndex]);
    }
  }

  return orderedIds;
}

function setImageFetchPriority(image, fetchPriority) {
  if (!image) {
    return;
  }

  if ("fetchPriority" in image) {
    image.fetchPriority = fetchPriority;
    return;
  }

  image.setAttribute("fetchpriority", fetchPriority);
}

function applyImageStrategy(image, distanceFromActiveRow) {
  if (!image) {
    return;
  }

  image.decoding = "async";
  image.loading =
    distanceFromActiveRow <= TOP_PRIORITY_DISTANCE ? "eager" : "lazy";

  if (distanceFromActiveRow === 0) {
    setImageFetchPriority(image, "high");
    return;
  }

  if (distanceFromActiveRow === 1) {
    setImageFetchPriority(image, "auto");
    return;
  }

  setImageFetchPriority(image, "low");
}

function applyFullPageImageStrategy(image, distanceFromActiveRow) {
  if (!image) {
    return;
  }

  image.decoding = "async";
  image.loading = "eager";

  if (distanceFromActiveRow === 0) {
    setImageFetchPriority(image, "high");
    return;
  }

  if (distanceFromActiveRow === 1) {
    setImageFetchPriority(image, "auto");
    return;
  }

  setImageFetchPriority(image, "low");
}

function isImageLoaded(image) {
  return Boolean(image?.complete && image.naturalWidth > 0);
}

function requestImageDecode(image) {
  if (!image?.decode) {
    return;
  }

  const decodeImage = () => {
    image.decode().catch(() => undefined);
  };

  if (isImageLoaded(image)) {
    decodeImage();
    return;
  }

  image.addEventListener("load", decodeImage, { once: true });
}

function getOrCreateRecord(recordBySrc, src) {
  if (!recordBySrc.has(src)) {
    recordBySrc.set(src, {
      src,
      status: "idle",
      promise: null,
      loader: null,
    });
  }

  return recordBySrc.get(src);
}

function markRecordLoaded(record) {
  if (!record) {
    return;
  }

  record.status = "loaded";
  record.loader = null;
  record.promise = Promise.resolve();
}

function startBackgroundPreload(record) {
  if (!record) {
    return Promise.resolve();
  }

  if (
    record.status === "loaded" ||
    record.status === "loading" ||
    record.status === "error"
  ) {
    return record.promise || Promise.resolve();
  }

  record.status = "loading";

  const loader = new Image();
  loader.decoding = "async";
  setImageFetchPriority(loader, "low");
  record.loader = loader;

  record.promise = new Promise((resolve) => {
    const finalize = (nextStatus) => {
      record.status = nextStatus;
      record.loader = null;
      resolve();
    };

    loader.addEventListener("load", () => finalize("loaded"), { once: true });
    loader.addEventListener("error", () => finalize("error"), { once: true });
    loader.src = record.src;
  });

  return record.promise;
}

function buildMediaEntries(rowSections, rows) {
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  return rowSections
    .map((section, index) => {
      const row = rowsById.get(section.id);
      const image = section.querySelector("img[data-row-image]");

      if (!row?.media || !image) {
        return null;
      }

      return {
        id: section.id,
        index,
        src: row.media.src,
        image,
      };
    })
    .filter(Boolean);
}

function buildBackgroundQueue(mediaEntries, rowIds, activeRowId, recordBySrc) {
  const mediaEntryById = new Map(mediaEntries.map((entry) => [entry.id, entry]));
  const activeIndex = resolveActiveIndex(rowIds, activeRowId);
  const queuedSrcs = [];
  const seenSrcs = new Set();

  buildPriorityOrder(rowIds, activeRowId).forEach((rowId) => {
    const entry = mediaEntryById.get(rowId);
    if (!entry) {
      return;
    }

    const distanceFromActiveRow = Math.abs(entry.index - activeIndex);
    if (distanceFromActiveRow <= TOP_PRIORITY_DISTANCE) {
      return;
    }

    if (seenSrcs.has(entry.src)) {
      return;
    }

    const record = recordBySrc.get(entry.src);
    if (
      record?.status === "loaded" ||
      record?.status === "loading" ||
      record?.status === "error"
    ) {
      return;
    }

    seenSrcs.add(entry.src);
    queuedSrcs.push(entry.src);
  });

  return queuedSrcs;
}

/**
 * Create a centralized loader for ligne media.
 *
 * @returns {{
 *   sync: (rowSections: HTMLElement[], rows: Array<{id: string, media?: {src: string}}>, preferredRowId?: string) => void,
 *   setActiveRow: (rowId: string) => void
 * }}
 */
export function createRowMediaLoader() {
  const recordBySrc = new Map();

  let rowIds = [];
  let mediaEntries = [];
  let activeRowId = null;
  let backgroundQueue = [];
  let backgroundInFlight = 0;
  let backgroundReady = false;
  let firstPaintScheduled = false;
  let pumpScheduled = false;
  let fullPageWarmupDone = false;
  let fullPageWarmupTimeoutId = null;

  function applyDomStrategies() {
    if (!mediaEntries.length) {
      return;
    }

    const activeIndex = resolveActiveIndex(rowIds, activeRowId);

    mediaEntries.forEach((entry) => {
      const distanceFromActiveRow = Math.abs(entry.index - activeIndex);
      if (fullPageWarmupDone) {
        applyFullPageImageStrategy(entry.image, distanceFromActiveRow);
        requestImageDecode(entry.image);
      } else {
        applyImageStrategy(entry.image, distanceFromActiveRow);
      }

      if (isImageLoaded(entry.image)) {
        markRecordLoaded(getOrCreateRecord(recordBySrc, entry.src));
      }
    });
  }

  function rebuildBackgroundQueue() {
    backgroundQueue = buildBackgroundQueue(
      mediaEntries,
      rowIds,
      activeRowId,
      recordBySrc
    );
  }

  function pumpQueue() {
    if (!backgroundReady) {
      return;
    }

    while (
      backgroundInFlight < BACKGROUND_CONCURRENCY &&
      backgroundQueue.length > 0
    ) {
      const nextSrc = backgroundQueue.shift();
      const record = getOrCreateRecord(recordBySrc, nextSrc);

      if (
        record.status === "loaded" ||
        record.status === "loading" ||
        record.status === "error"
      ) {
        continue;
      }

      backgroundInFlight += 1;

      startBackgroundPreload(record).finally(() => {
        backgroundInFlight = Math.max(0, backgroundInFlight - 1);
        pumpQueue();
      });
    }
  }

  function schedulePump() {
    if (!backgroundReady || pumpScheduled) {
      return;
    }

    pumpScheduled = true;

    window.requestAnimationFrame(() => {
      pumpScheduled = false;
      pumpQueue();
    });
  }

  function scheduleBackgroundStart() {
    if (backgroundReady) {
      schedulePump();
      return;
    }

    if (firstPaintScheduled) {
      return;
    }

    firstPaintScheduled = true;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        firstPaintScheduled = false;
        backgroundReady = true;
        pumpQueue();
      });
    });
  }

  function scheduleFullPageWarmup() {
    if (fullPageWarmupDone || fullPageWarmupTimeoutId !== null) {
      return;
    }

    fullPageWarmupTimeoutId = window.setTimeout(() => {
      fullPageWarmupTimeoutId = null;
      fullPageWarmupDone = true;
      applyDomStrategies();
      schedulePump();
    }, FULL_PAGE_EAGER_DELAY_MS);
  }

  function sync(rowSections, rows, preferredRowId) {
    rowIds = rowSections.map((section) => section.id);
    mediaEntries = buildMediaEntries(rowSections, rows);

    if (rowIds.includes(preferredRowId)) {
      activeRowId = preferredRowId;
    } else if (!rowIds.includes(activeRowId)) {
      activeRowId = rowIds[0] || null;
    }

    applyDomStrategies();
    rebuildBackgroundQueue();
    scheduleBackgroundStart();
    scheduleFullPageWarmup();
  }

  function setActiveRow(rowId) {
    if (!rowIds.includes(rowId)) {
      return;
    }

    activeRowId = rowId;
    applyDomStrategies();
    rebuildBackgroundQueue();
    schedulePump();
  }

  return {
    sync,
    setActiveRow,
  };
}
