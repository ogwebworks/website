// Usage: put originals in images-src/ named after a slot (e.g. pillar-build.png), then `npm run images`.
// Each is cropped to the slot's exact size (centre/attention crop) and written to public/images/
// as WebP (og -> JPEG, which social networks handle best).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const srcDir = path.join(root, "images-src");
const outDir = path.join(root, "public", "images");
const registry = fs.readFileSync(path.join(root, "src/lib/images.ts"), "utf8");
const slots = Object.fromEntries(
  [...registry.matchAll(/"?([\w-]+)"?:\s*\{\s*w:\s*(\d+),\s*h:\s*(\d+)/g)].map((m) => [m[1], { w: +m[2], h: +m[3] }]),
);

fs.mkdirSync(outDir, { recursive: true });
const files = fs.existsSync(srcDir) ? fs.readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f)) : [];
if (!files.length) console.log("No images in images-src/. Slots:", Object.keys(slots).join(", "));

for (const file of files) {
  const name = path.parse(file).name;
  const slot = slots[name];
  if (!slot) {
    console.warn(`skip ${file}: no slot named "${name}" (see src/lib/images.ts)`);
    continue;
  }
  for (const ext of ["webp", "avif", "jpg", "jpeg", "png"]) fs.rmSync(path.join(outDir, `${name}.${ext}`), { force: true });
  const pipeline = sharp(path.join(srcDir, file)).rotate().resize(slot.w, slot.h, { fit: "cover", position: sharp.strategy.attention });
  const out = name === "og" ? path.join(outDir, `${name}.jpg`) : path.join(outDir, `${name}.webp`);
  await (name === "og" ? pipeline.jpeg({ quality: 85, mozjpeg: true }) : pipeline.webp({ quality: 78, effort: 6 })).toFile(out);
  console.log(`✓ ${file} -> ${path.relative(root, out)} (${slot.w}×${slot.h}, ${Math.round(fs.statSync(out).size / 1024)} KB)`);
}
