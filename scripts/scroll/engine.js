import {
  findRowCenterStepIndex,
  getRowIdForStepPosition,
} from "./anchor.js?v=20260403a";

const INTERNAL_SCROLL_IGNORE_MS = 48;
const MIN_ANIMATION_DURATION_MS = 260;
const MAX_ANIMATION_DURATION_MS = 560;
const TOUCH_SNAP_DURATION_MS = 320;
const STEP_DURATION_MS = 320;
const STEP_EPSILON_PX = 0.5;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeSoft(progress) {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  return 0.5 - Math.cos(progress * Math.PI) / 2;
}

function findNearestStepIndex(stepPositions, scrollY) {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  stepPositions.forEach((stepPosition, index) => {
    const distance = Math.abs(stepPosition.scrollY - scrollY);
    if (distance >= nearestDistance) {
      return;
    }

    nearestDistance = distance;
    nearestIndex = index;
  });

  return nearestIndex;
}

function findDirectionalBaseIndex(stepPositions, scrollY, direction) {
  if (!stepPositions.length) {
    return 0;
  }

  if (direction > 0) {
    let baseIndex = 0;

    stepPositions.forEach((stepPosition, index) => {
      if (stepPosition.scrollY <= scrollY + STEP_EPSILON_PX) {
        baseIndex = index;
      }
    });

    return baseIndex;
  }

  let baseIndex = stepPositions.length - 1;

  for (let index = 0; index < stepPositions.length; index += 1) {
    if (stepPositions[index].scrollY >= scrollY - STEP_EPSILON_PX) {
      baseIndex = index;
      break;
    }
  }

  return baseIndex;
}

function mergeDuplicateStep(previousStep, nextStep) {
  if (!previousStep) {
    return nextStep;
  }

  if (previousStep.type === "row-center") {
    return previousStep;
  }

  if (nextStep.type === "row-center") {
    return nextStep;
  }

  return nextStep;
}

/**
 * Create the discrete half-step scroll controller.
 *
 * @param {{
 *   getBounds: () => {minY: number, maxY: number},
 *   getScrollY: () => number,
 *   setScrollY: (scrollY: number) => void,
 *   getStepPositions: () => Array<{
 *     type: "row-center" | "midpoint",
 *     scrollY: number,
 *     beforeRowId: string,
 *     afterRowId: string,
 *     rowId?: string
 *   }>,
 *   getCenteredRowId?: () => (string | null),
 *   onGridStateChange?: (gridState: {
 *     activeRowId: string | null,
 *     stepIndex: number,
 *     stepPosition: {
 *       type: "row-center" | "midpoint",
 *       scrollY: number,
 *       beforeRowId: string,
 *       afterRowId: string,
 *       rowId?: string
 *     } | null,
 *     lastDirection: number,
 *     scrollY: number
 *   }) => void,
 *   onCenteredRowChange?: (rowId: string | null) => void
 * }} options
 * @returns {{
 *   stepBy: (deltaSteps: number) => void,
 *   scrollToRowCenter: (rowId: string) => void,
 *   scrollToY: (scrollY: number, durationMs?: number) => void,
 *   beginTouch: (clientY: number) => void,
 *   moveTouch: (clientY: number) => void,
 *   snapTouchEnd: () => void,
 *   syncFromNativeScroll: (force?: boolean) => void,
 *   cancel: () => void
 * }}
 */
export function createScrollStepController(options) {
  const {
    getBounds,
    getScrollY,
    setScrollY,
    getStepPositions,
    getCenteredRowId,
    onGridStateChange,
    onCenteredRowChange,
  } = options;

  const state = {
    mode: "idle",
    scrollY: clamp(getScrollY(), getBounds().minY, getBounds().maxY),
    currentStepIndex: 0,
    targetStepIndex: null,
    pendingStepDelta: 0,
    lastDirection: 1,
    frameId: 0,
    animationStartTime: 0,
    animationDurationMs: 0,
    animationFromY: 0,
    animationToY: 0,
    animationCompletionMode: "grid",
    lastInternalScrollAt: 0,
    touchActive: false,
    touchLastClientY: 0,
    lastEmittedGridKey: "",
    lastCenteredRowId: null,
  };

  function getNormalizedStepPositions() {
    const bounds = getBounds();
    const rawStepPositions = (getStepPositions?.() || []).map((stepPosition) => ({
      ...stepPosition,
      scrollY: clamp(stepPosition.scrollY, bounds.minY, bounds.maxY),
    }));

    return rawStepPositions.reduce((normalizedStepPositions, stepPosition) => {
      const previousStep =
        normalizedStepPositions[normalizedStepPositions.length - 1] || null;

      if (
        previousStep &&
        Math.abs(previousStep.scrollY - stepPosition.scrollY) < STEP_EPSILON_PX
      ) {
        normalizedStepPositions[normalizedStepPositions.length - 1] =
          mergeDuplicateStep(previousStep, stepPosition);
        return normalizedStepPositions;
      }

      normalizedStepPositions.push(stepPosition);
      return normalizedStepPositions;
    }, []);
  }

  function stopAnimation() {
    if (!state.frameId) {
      return;
    }

    window.cancelAnimationFrame(state.frameId);
    state.frameId = 0;
  }

  function applyScrollY(nextScrollY, timestamp) {
    const bounds = getBounds();
    state.scrollY = clamp(nextScrollY, bounds.minY, bounds.maxY);
    state.lastInternalScrollAt = timestamp;
    setScrollY(state.scrollY);
  }

  function emitCenteredRow(rowId) {
    if (rowId === state.lastCenteredRowId) {
      return;
    }

    state.lastCenteredRowId = rowId;
    onCenteredRowChange?.(rowId);
  }

  function emitGridState(stepPositions, stepIndex) {
    const stepPosition = stepPositions[stepIndex] || null;
    const activeRowId = getRowIdForStepPosition(stepPosition, state.lastDirection);
    const directionToken = state.lastDirection < 0 ? "-1" : "1";
    const stepToken = stepPosition?.type === "row-center"
      ? stepPosition.rowId || activeRowId || ""
      : `${stepPosition?.beforeRowId || ""}:${stepPosition?.afterRowId || ""}`;
    const nextGridKey = `${stepIndex}:${directionToken}:${stepToken}`;

    if (nextGridKey === state.lastEmittedGridKey) {
      return;
    }

    state.lastEmittedGridKey = nextGridKey;
    onGridStateChange?.({
      activeRowId,
      stepIndex,
      stepPosition,
      lastDirection: state.lastDirection,
      scrollY: state.scrollY,
    });
  }

  function syncCurrentStepIndex(stepPositions) {
    if (!stepPositions.length) {
      state.currentStepIndex = 0;
      return;
    }

    state.currentStepIndex = findNearestStepIndex(stepPositions, state.scrollY);
  }

  function finishIdle(stepPositions, stepIndex) {
    state.mode = "idle";
    state.targetStepIndex = null;
    state.animationStartTime = 0;
    state.animationDurationMs = 0;
    state.animationFromY = state.scrollY;
    state.animationToY = state.scrollY;
    state.currentStepIndex = stepIndex;
    emitGridState(stepPositions, stepIndex);
  }

  function finishCenteredIdle(stepPositions) {
    state.mode = "idle";
    state.targetStepIndex = null;
    state.animationStartTime = 0;
    state.animationDurationMs = 0;
    state.animationFromY = state.scrollY;
    state.animationToY = state.scrollY;
    state.currentStepIndex = stepPositions.length
      ? findNearestStepIndex(stepPositions, state.scrollY)
      : 0;
    emitCenteredRow(getCenteredRowId?.() || null);
  }

  function getAnimationDuration(stepDistance, currentY, targetY) {
    const distancePx = Math.abs(targetY - currentY);
    const nextDuration =
      STEP_DURATION_MS +
      Math.max(0, stepDistance - 1) * 26 +
      Math.min(60, distancePx * 0.04);

    return clamp(
      Math.round(nextDuration),
      MIN_ANIMATION_DURATION_MS,
      MAX_ANIMATION_DURATION_MS
    );
  }

  function startAnimation(targetY, durationMs, completionMode, targetStepIndex) {
    if (!Number.isFinite(targetY)) {
      return;
    }

    stopAnimation();
    state.mode = "animating";
    state.targetStepIndex = targetStepIndex;
    state.animationCompletionMode = completionMode;
    state.animationStartTime = performance.now();
    state.animationFromY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
    state.scrollY = state.animationFromY;
    state.animationToY = clamp(targetY, getBounds().minY, getBounds().maxY);
    state.animationDurationMs = durationMs || STEP_DURATION_MS;
    state.frameId = window.requestAnimationFrame(runAnimationFrame);
  }

  function startAnimationToStepIndex(stepPositions, targetStepIndex, durationMs) {
    const stepPosition = stepPositions[targetStepIndex];
    if (!stepPosition) {
      return;
    }

    const currentScrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);

    startAnimation(
      stepPosition.scrollY,
      durationMs ||
        getAnimationDuration(
          Math.abs(targetStepIndex - state.currentStepIndex),
          currentScrollY,
          stepPosition.scrollY
        ),
      "grid",
      targetStepIndex
    );
  }

  function runAnimationFrame(timestamp) {
    state.frameId = 0;

    const stepPositions = getNormalizedStepPositions();
    if (!stepPositions.length || state.targetStepIndex === null) {
      state.mode = "idle";
      return;
    }

    const elapsedMs = timestamp - state.animationStartTime;
    const progress = clamp(elapsedMs / state.animationDurationMs, 0, 1);
    const easedProgress = easeSoft(progress);
    const nextScrollY =
      state.animationFromY +
      (state.animationToY - state.animationFromY) * easedProgress;

    applyScrollY(nextScrollY, timestamp);

    if (progress < 1) {
      state.frameId = window.requestAnimationFrame(runAnimationFrame);
      return;
    }

    applyScrollY(state.animationToY, timestamp);

    if (
      state.animationCompletionMode === "grid" &&
      state.targetStepIndex !== null
    ) {
      state.currentStepIndex = state.targetStepIndex;
      emitGridState(stepPositions, state.currentStepIndex);
      finishIdle(stepPositions, state.currentStepIndex);
      return;
    }

    finishCenteredIdle(stepPositions);
  }

  function resetQueue() {
    state.pendingStepDelta = 0;
    state.targetStepIndex = null;
  }

  function interruptAnimation() {
    stopAnimation();
    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
    resetQueue();
    state.mode = "idle";
  }

  function stepBy(deltaSteps) {
    if (!Number.isFinite(deltaSteps) || !deltaSteps) {
      return;
    }

    const stepCount = Math.trunc(deltaSteps);
    if (!stepCount) {
      return;
    }

    const direction = Math.sign(stepCount);
    const stepPositions = getNormalizedStepPositions();
    if (!stepPositions.length) {
      return;
    }

    if (state.touchActive) {
      state.touchActive = false;
    }

    if (
      state.mode === "animating" &&
      state.targetStepIndex !== null &&
      direction === state.lastDirection
    ) {
      state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
      state.currentStepIndex = findNearestStepIndex(stepPositions, state.scrollY);
      const extendedTargetStepIndex = clamp(
        state.targetStepIndex + stepCount,
        0,
        stepPositions.length - 1
      );

      if (extendedTargetStepIndex === state.targetStepIndex) {
        return;
      }

      state.pendingStepDelta = 0;
      startAnimationToStepIndex(stepPositions, extendedTargetStepIndex);
      return;
    }

    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);

    if (state.mode === "animating") {
      interruptAnimation();
    }

    const baseIndex = findDirectionalBaseIndex(
      stepPositions,
      state.scrollY,
      direction
    );
    const nextStepIndex = clamp(
      baseIndex + direction,
      0,
      stepPositions.length - 1
    );

    if (nextStepIndex === baseIndex) {
      state.currentStepIndex = baseIndex;
      state.pendingStepDelta = 0;
      finishIdle(stepPositions, baseIndex);
      return;
    }

    state.currentStepIndex = baseIndex;
    state.lastDirection = direction;
    state.pendingStepDelta = 0;
    const targetStepIndex = clamp(
      baseIndex + stepCount,
      0,
      stepPositions.length - 1
    );
    startAnimationToStepIndex(stepPositions, targetStepIndex, STEP_DURATION_MS);
  }

  function scrollToRowCenter(rowId) {
    const stepPositions = getNormalizedStepPositions();
    if (!stepPositions.length) {
      return;
    }

    const targetStepIndex = findRowCenterStepIndex(stepPositions, rowId);
    if (targetStepIndex < 0) {
      return;
    }

    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
    state.lastDirection = Math.sign(
      stepPositions[targetStepIndex].scrollY - state.scrollY
    ) || state.lastDirection;
    resetQueue();
    startAnimationToStepIndex(stepPositions, targetStepIndex);
  }

  function scrollToY(scrollY, durationMs = STEP_DURATION_MS) {
    if (!Number.isFinite(scrollY)) {
      return;
    }

    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
    if (Math.abs(scrollY - state.scrollY) < STEP_EPSILON_PX) {
      finishCenteredIdle(getNormalizedStepPositions());
      return;
    }

    resetQueue();
    state.lastEmittedGridKey = "";
    startAnimation(scrollY, durationMs, "centered", null);
  }

  function beginTouch(clientY) {
    interruptAnimation();
    state.lastEmittedGridKey = "";
    state.touchActive = true;
    state.mode = "touch";
    state.touchLastClientY = clientY;
  }

  function moveTouch(clientY) {
    if (!state.touchActive) {
      return;
    }

    const now = performance.now();
    const deltaY = state.touchLastClientY - clientY;
    state.touchLastClientY = clientY;
    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
    applyScrollY(state.scrollY + deltaY, now);
    emitCenteredRow(getCenteredRowId?.() || null);
  }

  function snapTouchEnd() {
    if (!state.touchActive) {
      return;
    }

    state.touchActive = false;
    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);

    const stepPositions = getNormalizedStepPositions();
    if (!stepPositions.length) {
      state.mode = "idle";
      return;
    }

    const nearestStepIndex = findNearestStepIndex(stepPositions, state.scrollY);
    const nearestStep = stepPositions[nearestStepIndex];
    state.lastDirection =
      Math.sign(nearestStep.scrollY - state.scrollY) || state.lastDirection;
    resetQueue();
    startAnimationToStepIndex(stepPositions, nearestStepIndex, TOUCH_SNAP_DURATION_MS);
  }

  function syncFromNativeScroll(force = false) {
    const now = performance.now();
    if (!force && now - state.lastInternalScrollAt < INTERNAL_SCROLL_IGNORE_MS) {
      return;
    }

    if (state.touchActive) {
      return;
    }

    const bounds = getBounds();
    const domScrollY = clamp(getScrollY(), bounds.minY, bounds.maxY);

    if (!force && Math.abs(domScrollY - state.scrollY) < STEP_EPSILON_PX) {
      return;
    }

    if (state.mode === "animating") {
      interruptAnimation();
    }

    state.lastEmittedGridKey = "";
    state.mode = "native";
    state.scrollY = domScrollY;
    syncCurrentStepIndex(getNormalizedStepPositions());
    emitCenteredRow(getCenteredRowId?.() || null);
  }

  function cancel() {
    stopAnimation();
    state.touchActive = false;
    state.mode = "idle";
    resetQueue();
    state.lastEmittedGridKey = "";
    state.scrollY = clamp(getScrollY(), getBounds().minY, getBounds().maxY);
  }

  return {
    stepBy,
    scrollToRowCenter,
    scrollToY,
    beginTouch,
    moveTouch,
    snapTouchEnd,
    syncFromNativeScroll,
    cancel,
  };
}
