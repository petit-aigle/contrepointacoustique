const MARKDOWN_LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

function createSafeLink(label, rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    const link = document.createElement("a");
    link.href = url.href;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  } catch {
    return null;
  }
}

/**
 * Render plain text and safe Markdown links inside an existing element.
 *
 * @param {HTMLElement} target - Element whose children will be replaced.
 * @param {string} value - Text containing optional `[label](URL)` links.
 * @returns {HTMLElement} The populated target element.
 * @sideEffects Replaces the target children with text nodes and safe HTTP(S) links.
 */
export function renderSafeMarkdownLinks(target, value) {
  target.replaceChildren();
  let cursor = 0;

  for (const match of value.matchAll(MARKDOWN_LINK_PATTERN)) {
    const matchStart = match.index ?? 0;
    target.append(document.createTextNode(value.slice(cursor, matchStart)));

    const link = createSafeLink(match[1], match[2]);
    target.append(link || document.createTextNode(match[0]));
    cursor = matchStart + match[0].length;
  }

  target.append(document.createTextNode(value.slice(cursor)));
  return target;
}
