// Slices the Brackeys world_tileset into the named tiles the site uses, and
// copies the source sheets + chosen clouds into public/game/. Run once:
//   node scripts/slice-tiles.mjs
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import { dirname } from "node:path";

const VAULT =
  "D:/Harry/00_THE-VAULT/04_PROJECTS/01_development/cognitiveos-website/assets/";
const TILESET = VAULT + "brackeys_platformer_assets/sprites/world_tileset.png";
const PLATFORMS = VAULT + "brackeys_platformer_assets/sprites/platforms.png";
const OUT = "public/game/";
const TILES_OUT = OUT + "tiles/";
const CLOUDS_OUT = OUT + "clouds/";
const PREVIEW =
  "C:/Users/HERRYA~1/AppData/Local/Temp/claude/D--Harry/1ef69760-a54a-4eff-aba4-ab775bbcf870/scratchpad/tiles_preview.png";

// [left, top, width, height] on the 16px grid.
const TILES = {
  "grass-top": [0, 0, 16, 16],
  dirt: [0, 16, 16, 16],
  tree: [0, 48, 16, 48],
  bush: [16, 64, 16, 16],
  palm: [32, 80, 32, 64],
  rock: [16, 96, 16, 16],
  mushroom: [112, 80, 16, 16],
  "water-top": [64, 144, 16, 16],
  "water-body": [64, 160, 16, 16],
  sign: [128, 48, 16, 32],
};

const CLOUDS = ["Cloud-2", "Cloud-21", "Cloud-25"].map((c) => [
  VAULT + `Cloudy-Pack-Free/Frosty Clouds/Smooth/${c}.png`,
  CLOUDS_OUT + `${c}.png`,
]);

await mkdir(TILES_OUT, { recursive: true });
await mkdir(CLOUDS_OUT, { recursive: true });

// 1. slice tiles
for (const [name, [left, top, width, height]] of Object.entries(TILES)) {
  await sharp(TILESET)
    .extract({ left, top, width, height })
    .toFile(TILES_OUT + name + ".png");
}

// 2. copy source sheets + clouds
await copyFile(TILESET, OUT + "world_tileset.png");
await copyFile(PLATFORMS, OUT + "platforms.png");
for (const [src, dst] of CLOUDS) {
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
}

// 3. preview montage (8x nearest, labeled) for visual verification
const scale = 8;
const names = Object.keys(TILES);
const colW = 32 * scale + 16; // widest tile (palm 32) + gap
const rowH = 64 * scale + 28; // tallest tile (palm 64) + label
const cols = 5;
const rows = Math.ceil(names.length / cols);
const W = colW * cols;
const H = rowH * rows;
const comps = [];
let labels = "";
for (let i = 0; i < names.length; i++) {
  const name = names[i];
  const [, , w, h] = TILES[name];
  const cx = (i % cols) * colW + 8;
  const cy = Math.floor(i / cols) * rowH + 24;
  const buf = await sharp(TILES_OUT + name + ".png")
    .resize(w * scale, h * scale, { kernel: "nearest" })
    .png()
    .toBuffer();
  comps.push({ input: buf, left: cx, top: cy });
  labels += `<text x="${cx}" y="${cy - 6}" fill="black" font-size="18" font-family="monospace">${name}</text>`;
}
await sharp({
  create: { width: W, height: H, channels: 4, background: "#dddddd" },
})
  .composite([...comps, { input: Buffer.from(`<svg width="${W}" height="${H}">${labels}</svg>`), left: 0, top: 0 }])
  .png()
  .toFile(PREVIEW);

console.log("tiles + clouds written to", OUT, "| preview:", PREVIEW);
