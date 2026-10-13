import { renderSafeMarkdownLinks } from "./safe-markdown-links.js?v=20261013b";

function createTextElement(tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  return element;
}

function createLegalModalBody(content) {
  const modalBody = createTextElement("p", "site-row__legal-modal-body", "");
  return renderSafeMarkdownLinks(modalBody, content.legal?.modalBody || "");
}

function createMediaFigure(row) {
  const media = row.media;
  const figure = document.createElement("figure");
  figure.className = "site-row__figure";
  figure.classList.add(`site-row__figure--${media.shape}`);
  figure.dataset.rowId = row.id;

  const image = document.createElement("img");
  image.src = media.previewSrc || media.src;
  if (media.srcset) {
    image.setAttribute("srcset", media.srcset);
    image.setAttribute("sizes", media.sizes);
  }
  image.width = media.width;
  image.height = media.height;
  image.alt = media.alt;
  image.dataset.rowImage = row.id;
  image.dataset.rowId = row.id;

  image.decoding = "async";
  image.loading = ["line-01", "line-02"].includes(row.id) ? "eager" : "lazy";
  if (row.id === "line-02") {
    image.setAttribute("fetchpriority", "high");
  }

  if (
    [
      "line-02",
      "line-03",
      "line-04",
      "line-05",
      "line-06",
      "line-07",
      "line-08",
    ].includes(row.id)
  ) {
    const link = document.createElement("a");
    link.className = "site-row__image-link";
    link.href = media.src;
    link.setAttribute("aria-label", `${media.openLabel} : ${media.alt}`);
    link.appendChild(image);
    figure.appendChild(link);
  } else {
    figure.appendChild(image);
  }
  return figure;
}

function createIntroContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--intro";

  if (content.title) {
    wrapper.appendChild(
      createTextElement("p", "site-row__intro-title", content.title),
    );
  }

  return wrapper;
}

function createContactBlock(contact) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__contact";
  wrapper.appendChild(
    createTextElement("p", "site-row__contact-lead", contact.lead),
  );
  wrapper.appendChild(
    createTextElement(
      "address",
      "site-row__contact-address",
      contact.address.join("\n"),
    ),
  );

  const email = document.createElement("p");
  email.className = "site-row__contact-email";
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${contact.email}`;
  emailLink.textContent = contact.email;
  email.appendChild(emailLink);
  wrapper.appendChild(email);
  return wrapper;
}

function createContactContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "site-row__content-inner site-row__content-inner--contact";
  if (content.contact) {
    wrapper.appendChild(createContactBlock(content.contact));
  }
  return wrapper;
}

function createSpeakerContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "site-row__content-inner site-row__content-inner--speaker";

  wrapper.appendChild(
    createTextElement("h1", "site-row__title", content.title),
  );

  if (content.subtitle) {
    wrapper.appendChild(
      createTextElement("p", "site-row__subtitle", content.subtitle),
    );
  }

  if (content.quote) {
    wrapper.appendChild(
      createTextElement("blockquote", "site-row__quote", content.quote),
    );
  }

  if (content.byline) {
    wrapper.appendChild(
      createTextElement("p", "site-row__byline", content.byline),
    );
  }

  if (content.contact) {
    wrapper.appendChild(createContactBlock(content.contact));
  }

  return wrapper;
}

function createParagraphsContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "site-row__content-inner site-row__content-inner--paragraphs";

  if (content.title) {
    wrapper.appendChild(
      createTextElement("h2", "site-row__section-title", content.title),
    );
  }

  if (content.proverb) {
    wrapper.appendChild(
      createTextElement(
        "p",
        "site-row__body-paragraph site-row__line04-proverb",
        content.proverb,
      ),
    );
  }

  content.paragraphs.forEach((paragraph) => {
    wrapper.appendChild(
      createTextElement("p", "site-row__body-paragraph", paragraph),
    );
  });

  return wrapper;
}

function createSpecsContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--specs";

  const specsGrid = document.createElement("div");
  specsGrid.className = "site-row__specs-grid";

  const specsLeftColumn = document.createElement("div");
  specsLeftColumn.className = "site-row__specs-col site-row__specs-col--table";

  const specsRightColumn = document.createElement("div");
  specsRightColumn.className =
    "site-row__specs-col site-row__specs-col--details";

  if (content.title) {
    specsLeftColumn.appendChild(
      createTextElement("h2", "site-row__section-title", content.title),
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
        "span",
        "site-row__spec-head-label",
        tableHeaders.label,
      ),
    );
    headValue.appendChild(
      createTextElement(
        "span",
        "site-row__spec-head-label",
        tableHeaders.value,
      ),
    );

    headRow.append(headLabel, headValue);
    head.appendChild(headRow);

    const body = document.createElement("tbody");

    tableRows.forEach((rowValue) => {
      const row = document.createElement("tr");
      const labelCell = document.createElement("th");
      const valueCell = document.createElement("td");

      labelCell.scope = "row";
      labelCell.appendChild(
        createTextElement("span", "site-row__spec-label", rowValue.label),
      );

      valueCell.appendChild(
        createTextElement("p", "site-row__spec-value", rowValue.value),
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
        "p",
        "site-row__spec-production",
        content.specs.production,
      ),
    );
  }

  if (content.specs?.price) {
    specsLeftColumn.appendChild(
      createTextElement("p", "site-row__spec-price", content.specs.price),
    );
  }

  if (content.specs?.taxNote) {
    specsLeftColumn.appendChild(
      createTextElement("p", "site-row__spec-tax-note", content.specs.taxNote),
    );
  }

  if (content.specs?.sustainableTitle) {
    specsRightColumn.appendChild(
      createTextElement(
        "h3",
        "site-row__spec-subtitle",
        content.specs.sustainableTitle,
      ),
    );
  }

  if (content.specs?.sustainableBody) {
    specsRightColumn.appendChild(
      createTextElement(
        "p",
        "site-row__body-paragraph",
        content.specs.sustainableBody,
      ),
    );
  }

  if (content.specs?.technicalTitle) {
    specsRightColumn.appendChild(
      createTextElement(
        "h3",
        "site-row__spec-subtitle",
        content.specs.technicalTitle,
      ),
    );
  }

  if (content.specs?.technicalBody) {
    specsRightColumn.appendChild(
      createTextElement(
        "p",
        "site-row__body-paragraph",
        content.specs.technicalBody,
      ),
    );
  }

  if (content.specs?.usageNote) {
    specsRightColumn.appendChild(
      createTextElement(
        "p",
        "site-row__spec-usage-note",
        content.specs.usageNote,
      ),
    );
  }

  specsGrid.append(specsLeftColumn, specsRightColumn);
  wrapper.appendChild(specsGrid);

  return wrapper;
}

function createLegalContent(content) {
  const wrapper = document.createElement("div");
  wrapper.className = "site-row__content-inner site-row__content-inner--legal";

  const singleColumn = Boolean(content.legal?.singleColumn);
  const rightColumn = document.createElement("div");
  rightColumn.className = singleColumn
    ? "site-row__line11-legal"
    : "site-row__line10-right";

  if (!singleColumn) {
    const leftColumn = document.createElement("div");
    leftColumn.className = "site-row__line10-left";

    const leftTitle = createTextElement(
      "h2",
      "site-row__section-title site-row__line10-left-title",
      content.legal?.leftTitle || "",
    );
    leftColumn.appendChild(leftTitle);

    const leftBody = createTextElement(
      "p",
      "site-row__body-paragraph site-row__line10-left-body",
      content.legal?.leftBody || "",
    );
    leftColumn.appendChild(leftBody);
    wrapper.appendChild(leftColumn);
  }

  const rightTitle = createTextElement(
    "h2",
    "site-row__section-title site-row__line10-right-title",
    content.legal?.rightTitle || "",
  );
  rightColumn.appendChild(rightTitle);

  const rightBody = createTextElement(
    "p",
    "site-row__body-paragraph site-row__line10-right-body",
    content.legal?.rightBody || "",
  );
  rightColumn.appendChild(rightBody);

  const details = document.createElement("details");
  details.className = "site-row__legal-details";
  const summary = document.createElement("summary");
  summary.className = "site-row__legal-open";
  summary.textContent = content.legal?.modalOpenLabel || "";
  details.appendChild(summary);
  details.appendChild(createLegalModalBody(content));
  rightColumn.appendChild(details);

  wrapper.appendChild(rightColumn);
  return wrapper;
}

function createTextContent(content) {
  switch (content.kind) {
    case "intro":
      return createIntroContent(content);
    case "speaker":
      return createSpeakerContent(content);
    case "paragraphs":
      return createParagraphsContent(content);
    case "specs":
      return createSpecsContent(content);
    case "legal":
      return createLegalContent(content);
    case "contact":
      return createContactContent(content);
    default:
      return document.createElement("div");
  }
}

/**
 * Render all ligne sections from the current content state.
 *
 * @param {HTMLElement[]} sectionElements - Existing ligne sections to populate.
 * @param {Array<{id: string, key: string, classNames: string[], media?: object, content: object}>} rows - Public localized content.
 * @returns {void}
 * @sideEffects Replaces ligne content with semantic text, image links and legal details.
 */
export function renderRows(sectionElements, rows) {
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
    mediaContainer.hidden = !row.media;

    if (row.media) {
      mediaContainer.appendChild(createMediaFigure(row));
    }

    textContainer.appendChild(createTextContent(row.content));
    const heading = textContainer.querySelector("h1, h2");
    if (heading) {
      heading.id = `${row.id}-title`;
      section.setAttribute("aria-labelledby", heading.id);
    }
    if (row.id === "line-11") {
      section.setAttribute("data-nosnippet", "");
    }
  });
}
