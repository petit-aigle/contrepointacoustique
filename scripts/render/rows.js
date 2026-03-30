import { getDebugTextKey, getDebugTextOverride } from "../state.js?v=20260330o";

function toSentenceCase(value) {
  if (!value) {
    return value;
  }

  const lower = value.toLocaleLowerCase();
  return `${lower.charAt(0).toLocaleUpperCase()}${lower.slice(1)}`;
}

function getTitleCaseClass(currentState, rowId) {
  if (!currentState.debug || rowId === "line-01") {
    return "";
  }

  switch (currentState.debugTypography.titleCaseMode) {
    case "uppercase":
      return "site-row__case-upper";
    case "lowercase":
      return "site-row__case-lower";
    case "sentence":
      return "site-row__case-none";
    case "current":
    default:
      return rowId === "line-03" ? "site-row__case-none" : "site-row__case-upper";
  }
}

function getTextPresentation(currentState, rowId, field, value) {
  let nextValue = currentState.debug
    ? getDebugTextOverride(currentState, rowId, field, value)
    : value;
  const extraClasses = [];

  if (field === "title" && rowId !== "line-01") {
    if (currentState.debug) {
      const titleCaseClass = getTitleCaseClass(currentState, rowId);

      if (currentState.debugTypography.titleCaseMode === "sentence") {
        nextValue = toSentenceCase(nextValue);
      }

      if (titleCaseClass) {
        extraClasses.push(titleCaseClass);
      }

      extraClasses.push(
        currentState.debugTypography.titleSpecialFont
          ? "site-row__font-display"
          : "site-row__font-body"
      );
    }
  } else if (currentState.debug && currentState.debugTypography.bodySpecialFont) {
    extraClasses.push("site-row__font-display");
  }

  return {
    value: nextValue,
    extraClasses,
  };
}

function createParagraph(text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  if (className) {
    paragraph.className = className;
  }

  return paragraph;
}

function createMediaFigure(media) {
  const figure = document.createElement("figure");
  figure.className = "site-row__figure";
  figure.classList.add(`site-row__figure--${media.shape}`);

  if (media.debugToggle) {
    figure.dataset.debugToggleImage = media.debugToggle;
    figure.dataset.debugVariantCount = String(media.debugVariantCount || 2);
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-pressed", String(media.isAlternate));
    figure.setAttribute("aria-label", media.debugLabel);
    figure.classList.add("site-row__figure--debug-toggle");
  }

  const image = document.createElement("img");
  image.src = media.src;
  image.width = media.width;
  image.height = media.height;
  image.alt = media.alt;
  image.loading = media.loading;

  figure.appendChild(image);
  return figure;
}

function createDebugEditor(currentState, rowId, field, value, className, label, rows = 1) {
  const presentation = getTextPresentation(currentState, rowId, field, value);
  const editor = document.createElement("textarea");
  editor.className = ["site-row__debug-editor", className, ...presentation.extraClasses]
    .filter(Boolean)
    .join(" ");
  editor.value = presentation.value;
  editor.rows = rows;
  editor.dataset.debugTextKey = getDebugTextKey(currentState, rowId, field);
  editor.setAttribute("aria-label", label);
  return editor;
}

function createStaticTextElement(tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  return element;
}

function createTextElement(
  currentState,
  rowId,
  field,
  tagName,
  className,
  value,
  label,
  rows = 1
) {
  const presentation = getTextPresentation(currentState, rowId, field, value);

  if (currentState.debug) {
    return createDebugEditor(
      currentState,
      rowId,
      field,
      value,
      className,
      label,
      rows
    );
  }

  return createStaticTextElement(
    tagName,
    [className, ...presentation.extraClasses].filter(Boolean).join(" "),
    presentation.value
  );
}

function createIntroContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--intro";

  if (content.title) {
    const title = createTextElement(
      currentState,
      rowId,
      "title",
      "h1",
      "site-row__intro-title",
      content.title,
      "Titre de la ligne"
    );
    wrapper.appendChild(title);
  }

  return wrapper;
}

function createContactBlock(currentState, rowId, contact) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__contact";

  wrapper.appendChild(
    createTextElement(
      currentState,
      rowId,
      "contact.lead",
      "p",
      "site-row__contact-lead",
      contact.lead,
      "Texte de contact",
      2
    )
  );

  const address = currentState.debug
    ? createTextElement(
        currentState,
        rowId,
        "contact.address",
        "address",
        "site-row__contact-address",
        contact.address.join("\n"),
        "Adresse de contact",
        Math.max(2, contact.address.length)
      )
    : createStaticTextElement(
        "address",
        "site-row__contact-address",
        contact.address.join("\n")
      );
  wrapper.appendChild(address);

  const email = document.createElement("p");
  email.className = "site-row__contact-email";

  if (currentState.debug) {
    email.appendChild(
      createTextElement(
        currentState,
        rowId,
        "contact.email",
        "p",
        "site-row__contact-email-value",
        contact.email,
        "Email de contact"
      )
    );
  } else {
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${contact.email}`;
    emailLink.textContent = contact.email;
    email.appendChild(emailLink);
  }

  wrapper.appendChild(email);

  return wrapper;
}

function createSpeakerContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--speaker";

  const title = createTextElement(
    currentState,
    rowId,
    "title",
    "h2",
    "site-row__title",
    content.title,
    "Titre de la ligne"
  );
  wrapper.appendChild(title);

  if (content.byline) {
    const byline = createTextElement(
      currentState,
      rowId,
      "byline",
      "p",
      "site-row__byline",
      content.byline,
      "Signature de la ligne"
    );
    wrapper.appendChild(byline);
  }

  if (content.contact) {
    wrapper.appendChild(createContactBlock(currentState, rowId, content.contact));
  }

  return wrapper;
}

function createParagraphsContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--paragraphs";

  if (content.title) {
    const title = createTextElement(
      currentState,
      rowId,
      "title",
      "h1",
      "site-row__section-title",
      content.title,
      "Titre de section"
    );
    wrapper.appendChild(title);
  }

  content.paragraphs.forEach((paragraph, index) => {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        `paragraphs.${index}`,
        "p",
        "site-row__body-paragraph",
        paragraph,
        `Texte ${index + 1} de la ligne`,
        Math.max(2, paragraph.split("\n").length)
      )
    );
  });

  return wrapper;
}

function createTextContent(currentState, rowId, content) {
  switch (content.kind) {
    case "intro":
      return createIntroContent(currentState, rowId, content);
    case "speaker":
      return createSpeakerContent(currentState, rowId, content);
    case "paragraphs":
      return createParagraphsContent(currentState, rowId, content);
    default:
      return document.createElement("div");
  }
}

export function renderRows(sectionElements, rows, currentState) {
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  sectionElements.forEach((section) => {
    const row = rowsById.get(section.id);
    if (!row) {
      return;
    }

    section.dataset.row = row.key;
    const nextClassNames = ["site-row", "reveal", ...row.classNames];
    if (section.classList.contains("is-visible")) {
      nextClassNames.push("is-visible");
    }

    section.className = nextClassNames.join(" ");

    const mediaContainer = section.querySelector("[data-row-media]");
    const textContainer = section.querySelector("[data-row-text]");

    mediaContainer.innerHTML = "";
    textContainer.innerHTML = "";

    mediaContainer.appendChild(createMediaFigure(row.media));
    textContainer.appendChild(createTextContent(currentState, row.id, row.content));
  });
}
