let hoverTimerId = 0;

function clearHoverTimer() {
  if (!hoverTimerId) {
    return;
  }

  window.clearTimeout(hoverTimerId);
  hoverTimerId = 0;
}

function positionBadge(badgeElement, point) {
  badgeElement.style.left = `${point.x + 18}px`;
  badgeElement.style.top = `${point.y + 20}px`;
}

export function hideDebugHoverBadge(badgeElement) {
  clearHoverTimer();

  if (!badgeElement) {
    return;
  }

  badgeElement.hidden = true;
  badgeElement.textContent = "";
  badgeElement.style.left = "-9999px";
  badgeElement.style.top = "-9999px";
}

export function handleDebugHoverPointerMove(event, badgeElement) {
  const rowElement = event.target.closest?.(".site-row[data-row]");

  if (!rowElement) {
    hideDebugHoverBadge(badgeElement);
    return null;
  }

  const rowLabel = rowElement.dataset.debugLineLabel;
  if (!rowLabel) {
    hideDebugHoverBadge(badgeElement);
    return null;
  }

  clearHoverTimer();
  badgeElement.hidden = true;

  const point = {
    x: event.clientX,
    y: event.clientY,
  };

  hoverTimerId = window.setTimeout(() => {
    badgeElement.textContent = rowLabel;
    positionBadge(badgeElement, point);
    badgeElement.hidden = false;
  }, 320);

  return rowElement;
}
