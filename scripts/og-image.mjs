/**
 * Renders scripts/og-image/template.html to public/og-image.png, the card shown
 * when the site is shared (the `og:image` tag in index.html).
 *
 * Run with `npm run og:image` after editing the template. It needs network access
 * (the fonts come from Google Fonts) and a local Chromium for Playwright
 * (`npx playwright install chromium`).
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const WIDTH = 2400;
const HEIGHT = 1260;
const MAX_BYTES = 1_000_000;
// Every font face the template uses. If one is missing, the browser falls back to a
// system font without any error, so the script checks them itself.
const REQUIRED_FONTS = ['Outfit 800', 'DM Mono 400', 'DM Mono 500'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = path.join(root, 'scripts/og-image/template.html');
const output = path.join(root, 'public/og-image.png');

/** Lists the chunks of a PNG file: [{ type, data }]. */
function readChunks(png) {
  const chunks = [];
  for (let offset = 8; offset < png.length; ) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('latin1', offset + 4, offset + 8);
    chunks.push({ type, data: png.subarray(offset + 8, offset + 8 + length) });
    offset += 12 + length;
  }
  return chunks;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(template).href, { waitUntil: 'load' });

  const state = await page.evaluate(async () => {
    await document.fonts.ready;
    const image = document.querySelector('img');
    await image.decode().catch(() => {});
    return {
      loadedFonts: [...document.fonts]
        .filter((face) => face.status === 'loaded')
        .map((face) => `${face.family.replaceAll(/["']/g, '')} ${face.weight}`),
      imageWidth: image.naturalWidth,
    };
  });

  const missingFonts = REQUIRED_FONTS.filter((font) => !state.loadedFonts.includes(font));
  if (missingFonts.length > 0) {
    throw new Error(
      `Fonts not loaded: ${missingFonts.join(', ')}. Check the network access to Google Fonts. ` +
        'Nothing was written.',
    );
  }
  if (state.imageWidth === 0) {
    throw new Error('The portrait (src/assets/profile.jpg) did not load. Nothing was written.');
  }

  const png = await page.screenshot({ type: 'png' });

  const chunks = readChunks(png);
  const header = chunks[0].data;
  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  if (width !== WIDTH || height !== HEIGHT) {
    throw new Error(`Expected a ${WIDTH}x${HEIGHT} image, got ${width}x${height}.`);
  }
  // Only the chunks needed to decode the pixels: no text, EXIF or XMP metadata.
  const extraChunks = chunks
    .map((chunk) => chunk.type)
    .filter((type) => !/^(IHDR|IDAT|IEND)$/.test(type));
  if (extraChunks.length > 0) {
    throw new Error(`Unexpected PNG chunks: ${[...new Set(extraChunks)].join(', ')}.`);
  }
  if (png.length > MAX_BYTES) {
    throw new Error(`The image is ${png.length} bytes, over the ${MAX_BYTES} bytes limit.`);
  }

  writeFileSync(output, png);
  console.log(
    `wrote ${path.relative(root, output)}: ${width}x${height}, ${Math.round(png.length / 1024)} KB`,
  );
} finally {
  await browser.close();
}
