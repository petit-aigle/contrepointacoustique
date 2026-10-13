import { access, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../../", import.meta.url);
const widths = [640, 1280, 1920, 2560];
const desktopSizes = {
  "line-02": "75vw",
  "line-03": "50vw",
  "line-04": "50vw",
  "line-05": "67vw",
  "line-06": "67vw",
  "line-07": "67vw",
  "line-08": "67vw",
};
const preparedSources = new Map();

async function prepareSource(media, checkOnly) {
  const input = await readFile(new URL(media.src.slice(1), root));
  if (input.length < 1024 * 1024) return null;
  const hash = createHash("sha256")
    .update(input)
    .update("webp-lossless-v1")
    .digest("hex")
    .slice(0, 12);
  const stem = basename(media.src, extname(media.src));
  const variants = [];
  for (const width of widths.filter((width) => width <= media.width)) {
    const src = `/Ressource/images/optimized/${stem}-${hash}-${width}.webp`;
    const target = new URL(src.slice(1), root);
    try {
      await access(target);
    } catch {
      if (checkOnly)
        throw new Error(`Missing responsive image ${src}. Run npm run build.`);
      await mkdir(new URL("./", target), { recursive: true });
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ lossless: true, effort: 5 })
        .toFile(fileURLToPath(target));
    }
    variants.push({ src, width });
  }
  return variants;
}

/**
 * Prepare responsive copies of the selected photographs for static pages.
 *
 * @param {Array<object>} rows - Localized public lignes and their selected original media.
 * @param {boolean} checkOnly - Verify existing derived files without writing them.
 * @returns {Promise<Array<object>>} Lignes with responsive image URLs and display sizes.
 * @sideEffects Writes content-addressed WebP copies during a build; originals remain unchanged.
 */
export async function prepareResponsiveMedia(rows, checkOnly) {
  const result = [];
  for (const row of rows) {
    if (!row.media) {
      result.push(row);
      continue;
    }
    if (!preparedSources.has(row.media.src)) {
      preparedSources.set(
        row.media.src,
        await prepareSource(row.media, checkOnly),
      );
    }
    const variants = preparedSources.get(row.media.src);
    if (!variants) {
      result.push(row);
      continue;
    }
    result.push({
      ...row,
      media: {
        ...row.media,
        previewSrc:
          variants.find((variant) => variant.width === 1280)?.src ||
          variants[0].src,
        srcset: variants
          .map((variant) => `${variant.src} ${variant.width}w`)
          .join(", "),
        sizes: `(max-width: 860px) 100vw, ${desktopSizes[row.id] || "50vw"}`,
      },
    });
  }
  return result;
}
