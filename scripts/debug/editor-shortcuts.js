export function handleDebugEditorShortcut(event, handlers) {
  const key = event.key.toLowerCase();
  const hasModifier = event.ctrlKey || event.metaKey;

  if (hasModifier && !event.altKey && key === "b") {
    event.preventDefault();
    handlers.onBold?.();
    return true;
  }

  if (hasModifier && !event.altKey && key === "i") {
    event.preventDefault();
    handlers.onItalic?.();
    return true;
  }

  if (hasModifier && !event.altKey && key === "e") {
    event.preventDefault();
    handlers.onAlignCycle?.();
    return true;
  }

  if (
    event.shiftKey &&
    !hasModifier &&
    (event.key === "+" || event.code === "Equal")
  ) {
    event.preventDefault();
    handlers.onFontIncrease?.();
    return true;
  }

  if (
    event.shiftKey &&
    !hasModifier &&
    (event.key === "_" || event.key === "-" || event.code === "Minus")
  ) {
    event.preventDefault();
    handlers.onFontDecrease?.();
    return true;
  }

  return false;
}
