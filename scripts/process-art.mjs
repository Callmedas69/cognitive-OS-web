// Keys the magenta (#FF00FF-ish) background out of the generated art -> transparent,
// trims sprites tight, preserves width on parallax bands, copies full-frame tiles.
//   node scripts/process-art.mjs
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";

const SRC =
  "D:/Harry/00_THE-VAULT/04_PROJECTS/01_development/cognitiveos-website/assets/generated/";
const OUT = "public/game/art/";

// magenta key: high R + high B, very low G
const isMagenta = (r, g, b) => r > 150 && b > 150 && g < 105;

async function key(srcName, outName, { trim }) {
  const { data, info } = await sharp(SRC + srcName)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  for (let i = 0; i < data.length; i += 4) {
    if (isMagenta(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0;
    }
  }
  let img = sharp(data, { raw: { width, height, channels: 4 } });
  if (trim) {
    img = img.trim({ threshold: 1 }); // tight bbox (sprites)
    img = img.resize(560, 560, { fit: "inside", withoutEnlargement: true });
  } else {
    img = img.resize(1536, 1536, { fit: "inside", withoutEnlargement: true }); // bands keep width
  }
  await img.png({ compressionLevel: 9, palette: true }).toFile(OUT + outName);
}

await mkdir(OUT, { recursive: true });

// sprites: key + tight trim
const SPRITES = {
  "home.png": "home.png",
  "groove.png": "grove.png",
  "bridge.png": "bridge.png",
  "library.png": "library.png",
  "workshop.png": "workshop.png",
  "garden.png": "garden.png",
  "station.png": "station.png",
  "sun.png": "sun.png",
};
for (const [s, o] of Object.entries(SPRITES)) await key(s, o, { trim: true });

// parallax bands: key magenta, KEEP full width (no trim) for seamless tiling
const BANDS = ["mountain-1.png", "mountain-2.png", "mountain-3.png", "mountain-4.png", "forest-far.png"];
for (const b of BANDS) await key(b, b, { trim: false });

// full-frame tiles: no key, re-encode smaller
await sharp(SRC + "ground.png").resize(1024, 1024, { fit: "inside", withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(OUT + "ground.png");
await sharp(SRC + "river.png").resize(1024, 1024, { fit: "inside", withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(OUT + "river.png");

console.log("processed -> " + OUT);
