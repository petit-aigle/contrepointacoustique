import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import { getSiteContent } from "../data/site-content.js";
import { LANGUAGE_PATHS, getLanguageUrl } from "../data/site-languages.js";
import { renderMetadata } from "../render/metadata.js";
import { renderNavbar } from "../render/navbar.js";
import { prepareResponsiveMedia } from "./responsive-media.mjs";
import { renderRows } from "../render/rows.js";

const root = new URL("../../", import.meta.url);
const template = await readFile(
  new URL("./page-template.html", import.meta.url),
  "utf8",
);
const checkOnly = process.argv.includes("--check");

async function saveGeneratedFile(relativePath, content) {
  const target = new URL(relativePath, root);
  if (checkOnly) {
    const existing = await readFile(target, "utf8");
    if (existing !== content) {
      throw new Error(`${relativePath} is outdated. Run npm run build.`);
    }
    return;
  }
  await mkdir(new URL("./", target), { recursive: true });
  await writeFile(target, content);
}

function createRowSection(row) {
  const section = document.createElement("section");
  section.id = row.id;
  section.setAttribute("tabindex", "-1");
  const media = document.createElement("div");
  media.className = "site-row__media";
  media.setAttribute("data-row-media", "");
  const text = document.createElement("div");
  text.className = "site-row__content";
  text.setAttribute("data-row-text", "");
  const isContentFirst = row.contentFirst;
  section.append(...(isContentFirst ? [text, media] : [media, text]));
  return section;
}

function linkContactValues() {
  const paragraph = document.querySelector(
    "#line-10 .site-row__body-paragraph",
  );
  const value = paragraph.textContent;
  const pattern =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b0[1-9](?:[ \u202f.-]?\d{2}){4}\b/gi;
  let cursor = 0;
  paragraph.replaceChildren();
  for (const match of value.matchAll(pattern)) {
    paragraph.append(document.createTextNode(value.slice(cursor, match.index)));
    const link = document.createElement("a");
    link.textContent = match[0];
    link.href = match[0].includes("@")
      ? `mailto:${match[0]}`
      : `tel:+33${match[0].replace(/\D/g, "").slice(1)}`;
    paragraph.append(link);
    cursor = match.index + match[0].length;
  }
  paragraph.append(document.createTextNode(value.slice(cursor)));
}

for (const [language, path] of Object.entries(LANGUAGE_PATHS)) {
  const translation = JSON.parse(
    await readFile(
      new URL(`scripts/data/translations/${language}.json`, root),
      "utf8",
    ),
  );
  const siteContent = getSiteContent({ lang: language }, translation);
  siteContent.rows = await prepareResponsiveMedia(siteContent.rows, checkOnly);
  const { document } = parseHTML(template);
  globalThis.document = document;

  renderMetadata(siteContent);
  renderNavbar(
    {
      navbarNav: document.getElementById("navbar-nav"),
      navbarMenuToggle: document.getElementById("navbar-menu-toggle"),
      navbarMenuToggleText: document.getElementById("navbar-menu-toggle-text"),
      languageNav: document.getElementById("language-nav"),
    },
    { lang: language },
    siteContent,
  );
  document.querySelector(".skip-link").textContent =
    translation.ui.labels.skipToContent;
  document.getElementById("site-interface").textContent = JSON.stringify(
    translation.ui.labels,
  ).replace(/</g, "\\u003c");

  const sections = siteContent.rows.map(createRowSection);
  document.querySelector("main").append(...sections);
  renderRows(sections, siteContent.rows);
  linkContactValues();
  const html = `<!doctype html>\n${document.documentElement.outerHTML}\n`;
  await saveGeneratedFile(`${path.slice(1)}index.html`, html);
}

const urls = Object.keys(LANGUAGE_PATHS)
  .map((language) => `  <url><loc>${getLanguageUrl(language)}</loc></url>`)
  .join("\n");
await saveGeneratedFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(
  `${checkOnly ? "Verified" : "Generated"} three complete language pages and sitemap in ${fileURLToPath(root)}.`,
);
