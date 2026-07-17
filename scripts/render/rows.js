import { ensureDebugEditorRecord } from "../debug/editor-state.js?v=20260330aa";
import { getDebugImageAreaHeight } from "../debug/image-state.js?v=20260330aa";
import { syncDebugEditorStyles } from "../debug/editor-toolbar.js?v=20260330aa";

function getTitleCaseClass(currentState, rowId) {
  if (!currentState.debug || rowId === "line-01") {
    return "";
  }

  switch (currentState.debugTypography.titleCaseMode) {
    case "uppercase":
      return "site-row__case-upper";
    case "sentence":
      return "site-row__case-sentence";
    case "lowercase":
      return "site-row__case-lower";
    case "current":
    default:
      return "site-row__case-lower";
  }
}

function getPresentationClasses(currentState, rowId, field) {
  if (!currentState.debug) {
    return [];
  }

  if (field === "title" && rowId !== "line-01") {
    return [
      getTitleCaseClass(currentState, rowId),
      currentState.debugTypography.titleSpecialFont
        ? "site-row__font-display"
        : "site-row__font-body",
    ].filter(Boolean);
  }

  if (currentState.debugTypography.bodySpecialFont) {
    return ["site-row__font-display"];
  }

  return [];
}

function createStaticTextElement(tagName, className, value, extraClasses = []) {
  const element = document.createElement(tagName);
  element.className = [className, ...extraClasses].filter(Boolean).join(" ");
  element.textContent = value;
  return element;
}

function createDebugEditorElement(
  currentState,
  rowId,
  field,
  className,
  value,
  label
) {
  const { key, record } = ensureDebugEditorRecord(currentState, rowId, field, value);
  const editor = document.createElement("div");

  editor.className = [
    "site-row__debug-editor",
    className,
    ...getPresentationClasses(currentState, rowId, field),
  ]
    .filter(Boolean)
    .join(" ");
  editor.contentEditable = "true";
  editor.setAttribute("role", "textbox");
  editor.setAttribute("aria-multiline", "true");
  editor.setAttribute("aria-label", label);
  editor.dataset.debugEditorKey = key;
  editor.dataset.debugEditorRow = rowId;
  editor.dataset.debugEditorField = field;
  editor.innerHTML = record.html || "";

  syncDebugEditorStyles(editor, record);
  return editor;
}

function createTextElement(
  currentState,
  rowId,
  field,
  tagName,
  className,
  value,
  label
) {
  if (currentState.debug) {
    return createDebugEditorElement(
      currentState,
      rowId,
      field,
      className,
      value,
      label
    );
  }

  return createStaticTextElement(tagName, className, value);
}

function getEditorLabel(content, key) {
  return content.editorLabels?.[key] || "";
}

function applyDebugImageAreaSize(figure, image, media, targetHeight) {
  if (!Number.isFinite(targetHeight) || targetHeight <= 0) {
    return;
  }

  if (media.shape === "circle") {
    figure.style.width = "";
    figure.style.height = `${targetHeight}px`;
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    image.style.maxWidth = "";
    return;
  }

  if (media.shape === "brand") {
    figure.style.height = `${targetHeight}px`;
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    image.style.maxWidth = "";
    return;
  }

  figure.style.height = `${targetHeight}px`;
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "cover";
  image.style.objectPosition = "center";
}

function createMediaFigure(currentState, row) {
  const media = row.media;
  const figure = document.createElement("figure");
  figure.className = "site-row__figure";
  figure.classList.add(`site-row__figure--${media.shape}`);
  figure.dataset.rowId = row.id;

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
  image.dataset.rowImage = row.id;
  image.dataset.rowId = row.id;

  if (currentState.debug) {
    figure.dataset.debugImageRow = row.id;
    figure.dataset.debugLineLabel = row.debugLineLabel || "";

    const customHeight = getDebugImageAreaHeight(row.id);
    if (customHeight > 0) {
      applyDebugImageAreaSize(figure, image, media, customHeight);
    }
  }

  figure.appendChild(image);
  return figure;
}

function createIntroContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--intro";

  if (content.title) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "title",
        "h1",
        "site-row__intro-title",
        content.title,
        getEditorLabel(content, "rowTitle")
      )
    );
  }

  return wrapper;
}

function createContactBlock(currentState, rowId, contact, editorLabels = {}) {
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
      editorLabels.contactText
    )
  );

  if (currentState.debug) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "contact.address",
        "address",
        "site-row__contact-address",
        contact.address.join("\n"),
        editorLabels.contactAddress
      )
    );
  } else {
    const address = createStaticTextElement(
      "address",
      "site-row__contact-address",
      contact.address.join("\n")
    );
    wrapper.appendChild(address);
  }

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
        editorLabels.contactEmail
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

function createContactContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--contact";

  if (content.contact) {
    wrapper.appendChild(
      createContactBlock(
        currentState,
        rowId,
        content.contact,
        content.editorLabels
      )
    );
  }

  return wrapper;
}

function createSpeakerContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--speaker";

  wrapper.appendChild(
    createTextElement(
      currentState,
      rowId,
      "title",
      "h2",
      "site-row__title",
      content.title,
      getEditorLabel(content, "rowTitle")
    )
  );

  if (content.subtitle) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "subtitle",
        "p",
        "site-row__subtitle",
        content.subtitle,
        getEditorLabel(content, "rowSubtitle")
      )
    );
  }

  if (content.quote) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "quote",
        "blockquote",
        "site-row__quote",
        content.quote,
        getEditorLabel(content, "rowQuote")
      )
    );
  }

  if (content.byline) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "byline",
        "p",
        "site-row__byline",
        content.byline,
        getEditorLabel(content, "rowByline")
      )
    );
  }

  if (content.contact) {
    wrapper.appendChild(
      createContactBlock(
        currentState,
        rowId,
        content.contact,
        content.editorLabels
      )
    );
  }

  return wrapper;
}

function createParagraphsContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--paragraphs";

  if (content.title) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "title",
        "h1",
        "site-row__section-title",
        content.title,
        getEditorLabel(content, "sectionTitle")
      )
    );
  }

  if (content.proverb) {
    wrapper.appendChild(
      createTextElement(
        currentState,
        rowId,
        "proverb",
        "p",
        "site-row__body-paragraph site-row__line04-proverb",
        content.proverb,
        getEditorLabel(content, "rowProverb")
      )
    );
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
        `${getEditorLabel(content, "rowText")} ${index + 1}`
      )
    );
  });

  return wrapper;
}

function createSpecsContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--specs";

  const specsGrid = document.createElement("div");
  specsGrid.className = "site-row__specs-grid";

  const specsLeftColumn = document.createElement("div");
  specsLeftColumn.className = "site-row__specs-col site-row__specs-col--table";

  const specsRightColumn = document.createElement("div");
  specsRightColumn.className = "site-row__specs-col site-row__specs-col--details";

  if (content.title) {
    specsLeftColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "title",
        "h1",
        "site-row__section-title",
        content.title,
        getEditorLabel(content, "sectionTitle")
      )
    );
  }

  const tableHeaders = content.specs?.tableHeaders || {
    label: "",
    value: "",
  };
  const tableRows = content.specs?.tableRows || [];

  if (tableRows.length) {
    const table = document.createElement("table");
    table.className = "site-row__spec-table";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headLabel = document.createElement("th");
    const headValue = document.createElement("th");

    headLabel.scope = "col";
    headValue.scope = "col";
    headLabel.className = "site-row__spec-head";
    headValue.className = "site-row__spec-head";

    headLabel.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.tableHeaders.label",
        "span",
        "site-row__spec-head-label",
        tableHeaders.label,
        getEditorLabel(content, "specFeatureHeader")
      )
    );
    headValue.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.tableHeaders.value",
        "span",
        "site-row__spec-head-label",
        tableHeaders.value,
        getEditorLabel(content, "specValueHeader")
      )
    );

    headRow.append(headLabel, headValue);
    head.appendChild(headRow);

    const body = document.createElement("tbody");

    tableRows.forEach((rowValue, index) => {
      const row = document.createElement("tr");
      const labelCell = document.createElement("th");
      const valueCell = document.createElement("td");

      labelCell.scope = "row";
      labelCell.appendChild(
        createTextElement(
          currentState,
          rowId,
          `specs.tableRows.${index}.label`,
          "span",
          "site-row__spec-label",
          rowValue.label,
          `${getEditorLabel(content, "specLabel")} ${index + 1}`
        )
      );

      valueCell.appendChild(
        createTextElement(
          currentState,
          rowId,
          `specs.tableRows.${index}.value`,
          "p",
          "site-row__spec-value",
          rowValue.value,
          `${getEditorLabel(content, "specValue")} ${index + 1}`
        )
      );

      row.append(labelCell, valueCell);
      body.appendChild(row);
    });

    table.appendChild(head);
    table.appendChild(body);
    specsLeftColumn.appendChild(table);
  }

  if (content.specs?.production) {
    specsLeftColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.production",
        "p",
        "site-row__spec-production",
        content.specs.production,
        getEditorLabel(content, "specProduction")
      )
    );
  }

  if (content.specs?.price) {
    specsLeftColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.price",
        "p",
        "site-row__spec-price",
        content.specs.price,
        getEditorLabel(content, "specPrice")
      )
    );
  }

  if (content.specs?.taxNote) {
    specsLeftColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.taxNote",
        "p",
        "site-row__spec-tax-note",
        content.specs.taxNote,
        getEditorLabel(content, "specTaxNote")
      )
    );
  }

  if (content.specs?.sustainableTitle) {
    specsRightColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.sustainableTitle",
        "h2",
        "site-row__spec-subtitle",
        content.specs.sustainableTitle,
        getEditorLabel(content, "specSustainableTitle")
      )
    );
  }

  if (content.specs?.sustainableBody) {
    specsRightColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.sustainableBody",
        "p",
        "site-row__body-paragraph",
        content.specs.sustainableBody,
        getEditorLabel(content, "specSustainableBody")
      )
    );
  }

  if (content.specs?.technicalTitle) {
    specsRightColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.technicalTitle",
        "h2",
        "site-row__spec-subtitle",
        content.specs.technicalTitle,
        getEditorLabel(content, "specTechnicalTitle")
      )
    );
  }

  if (content.specs?.technicalBody) {
    specsRightColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.technicalBody",
        "p",
        "site-row__body-paragraph",
        content.specs.technicalBody,
        getEditorLabel(content, "specTechnicalBody")
      )
    );
  }

  if (content.specs?.usageNote) {
    specsRightColumn.appendChild(
      createTextElement(
        currentState,
        rowId,
        "specs.usageNote",
        "p",
        "site-row__spec-usage-note",
        content.specs.usageNote,
        getEditorLabel(content, "specUsageNote")
      )
    );
  }

  specsGrid.append(specsLeftColumn, specsRightColumn);
  wrapper.appendChild(specsGrid);

  return wrapper;
}

function createLegalContent(currentState, rowId, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--legal";

  const singleColumn = Boolean(content.legal?.singleColumn);
  const rightColumn = document.createElement("div");
  rightColumn.className = singleColumn ? "site-row__line11-legal" : "site-row__line10-right";

  if (!singleColumn) {
    const leftColumn = document.createElement("div");
    leftColumn.className = "site-row__line10-left";

    const leftTitle = createTextElement(
      currentState,
      rowId,
      "legal.leftTitle",
      "h1",
      "site-row__section-title site-row__line10-left-title",
      content.legal?.leftTitle || "",
      getEditorLabel(content, "legalLeftTitle")
    );
    leftColumn.appendChild(leftTitle);

    const leftBody = createTextElement(
      currentState,
      rowId,
      "legal.leftBody",
      "p",
      "site-row__body-paragraph site-row__line10-left-body",
      content.legal?.leftBody || "",
      getEditorLabel(content, "legalContactBody")
    );
    leftColumn.appendChild(leftBody);
    wrapper.appendChild(leftColumn);
  }

  const rightTitle = createTextElement(
    currentState,
    rowId,
    "legal.rightTitle",
    "h1",
    "site-row__section-title site-row__line10-right-title",
    content.legal?.rightTitle || "",
    getEditorLabel(content, "legalRightTitle")
  );
  rightColumn.appendChild(rightTitle);

  const rightBody = createTextElement(
    currentState,
    rowId,
    "legal.rightBody",
    "p",
    "site-row__body-paragraph site-row__line10-right-body",
    content.legal?.rightBody || "",
    getEditorLabel(content, "legalSummary")
  );
  rightColumn.appendChild(rightBody);

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "site-row__legal-open";
  openButton.textContent = content.legal?.modalOpenLabel || "";
  rightColumn.appendChild(openButton);

  const modal = document.createElement("div");
  modal.className = "site-row__legal-modal";
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "site-row__legal-modal-dialog";
  modalDialog.setAttribute("role", "dialog");
  modalDialog.setAttribute("aria-modal", "true");

  const modalHeader = document.createElement("div");
  modalHeader.className = "site-row__legal-modal-header";
  const modalTitle = document.createElement("h2");
  modalTitle.className = "site-row__legal-modal-title";
  modalTitle.textContent = content.legal?.modalTitle || "";
  modalHeader.appendChild(modalTitle);

  const modalCloseTop = document.createElement("button");
  modalCloseTop.type = "button";
  modalCloseTop.className = "site-row__legal-modal-close";
  modalCloseTop.textContent = "×";
  modalCloseTop.setAttribute("aria-label", content.legal?.modalCloseLabel || "");
  modalHeader.appendChild(modalCloseTop);
  modalDialog.appendChild(modalHeader);

  const modalBody = createTextElement(
    currentState,
    rowId,
    "legal.modalBody",
    "p",
    "site-row__legal-modal-body",
    content.legal?.modalBody || "",
    getEditorLabel(content, "legalModalBody")
  );
  modalDialog.appendChild(modalBody);

  const modalActions = document.createElement("div");
  modalActions.className = "site-row__legal-modal-actions";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "site-row__legal-modal-back";
  closeButton.textContent = content.legal?.modalBackLabel || "";
  modalActions.appendChild(closeButton);

  modalDialog.appendChild(modalActions);
  modal.appendChild(modalDialog);
  rightColumn.appendChild(modal);

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-legal-modal-open");
    document.removeEventListener("keydown", onKeyDown);
  };

  const openModal = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-legal-modal-open");
    document.addEventListener("keydown", onKeyDown);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  openButton.addEventListener("click", openModal);
  modalCloseTop.addEventListener("click", closeModal);
  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  wrapper.appendChild(rightColumn);
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
    case "specs":
      return createSpecsContent(currentState, rowId, content);
    case "legal":
      return createLegalContent(currentState, rowId, content);
    case "contact":
      return createContactContent(currentState, rowId, content);
    default:
      return document.createElement("div");
  }
}

/**
 * Render all ligne sections from the current content state.
 *
 * @param {HTMLElement[]} sectionElements
 * @param {Array<{id: string, key: string, classNames: string[], media?: object, content: object, debugLineLabel?: string}>} rows
 * @param {{debug: boolean, debugTypography: object}} currentState
 * @returns {void}
 */
export function renderRows(sectionElements, rows, currentState) {
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  sectionElements.forEach((section) => {
    const row = rowsById.get(section.id);
    if (!row) {
      return;
    }

    section.dataset.row = row.key;
    section.dataset.debugLineLabel = row.debugLineLabel || "";
    const nextClassNames = ["site-row", "reveal", ...row.classNames];
    if (section.classList.contains("is-visible")) {
      nextClassNames.push("is-visible");
    }

    section.className = nextClassNames.join(" ");

    const mediaContainer = section.querySelector("[data-row-media]");
    const textContainer = section.querySelector("[data-row-text]");

    mediaContainer.innerHTML = "";
    textContainer.innerHTML = "";
    mediaContainer.hidden = !row.media;

    if (row.media) {
      mediaContainer.appendChild(createMediaFigure(currentState, row));
    }

    textContainer.appendChild(createTextContent(currentState, row.id, row.content));
  });
}
