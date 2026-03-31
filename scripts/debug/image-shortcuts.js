export function handleDebugImageShortcut(event, handlers) {
  const hasModifier = event.ctrlKey || event.metaKey;

  if (
    event.shiftKey &&
    !hasModifier &&
    !event.altKey &&
    (event.key === "+" || event.code === "Equal")
  ) {
    event.preventDefault();
    handlers.onIncrease?.();
    return true;
  }

  if (
    event.shiftKey &&
    !hasModifier &&
    !event.altKey &&
    (event.key === "_" || event.key === "-" || event.code === "Minus")
  ) {
    event.preventDefault();
    handlers.onDecrease?.();
    return true;
  }

  return false;
}
