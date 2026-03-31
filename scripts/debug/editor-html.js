export function escapeHTML(value) {
  const container = document.createElement("div");
  container.textContent = value || "";
  return container.innerHTML;
}

export function textToRichHTML(value) {
  return escapeHTML(value || "").replace(/\n/g, "<br>");
}

function appendBreak(target) {
  if (target.lastChild?.nodeName === "BR") {
    return;
  }

  target.appendChild(document.createElement("br"));
}

function sanitizeChildren(source, target) {
  Array.from(source.childNodes).forEach((node) => {
    sanitizeNode(node, target);
  });
}

function sanitizeNode(node, target) {
  if (node.nodeType === Node.TEXT_NODE) {
    target.appendChild(document.createTextNode(node.textContent || ""));
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const tagName = node.nodeName.toUpperCase();

  if (tagName === "BR") {
    appendBreak(target);
    return;
  }

  if (tagName === "STRONG" || tagName === "B") {
    const strong = document.createElement("strong");
    sanitizeChildren(node, strong);

    if (strong.childNodes.length > 0) {
      target.appendChild(strong);
    }

    return;
  }

  if (tagName === "EM" || tagName === "I") {
    const em = document.createElement("em");
    sanitizeChildren(node, em);

    if (em.childNodes.length > 0) {
      target.appendChild(em);
    }

    return;
  }

  if (tagName === "DIV" || tagName === "P") {
    if (target.childNodes.length > 0) {
      appendBreak(target);
    }

    sanitizeChildren(node, target);
    appendBreak(target);
    return;
  }

  sanitizeChildren(node, target);
}

export function sanitizeRichHTML(html) {
  if (!html) {
    return "";
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  const container = document.createElement("div");
  sanitizeChildren(template.content, container);

  return container.innerHTML
    .replace(/(?:<br>\s*){3,}/g, "<br><br>")
    .replace(/^(?:<br>\s*)+|(?:<br>\s*)+$/g, "");
}
