import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import sharp, { type Sharp } from "sharp";
import { SLOTS, slotDef } from "../src/assets/registry.ts";
import { loadAtlas } from "./load.ts";

/**
 * Turns the full-size originals in design/assets-raw/ into the optimised WebP files the site uses.
 *
 *   npm run assets:optimize                 all new or changed originals
 *   npm run assets:optimize -- --force      redo everything
 *   npm run assets:optimize -- --only hero-world,hero-figure
 *   npm run assets:optimize -- --avif       additionally write AVIF files (slower, a bit smaller)
 *
 * File names must be the slot names from docs/ASSET-LIST.md (e.g. hero-world.png). Spaces, underscores and capital
 * letters are tolerated. Originals stay in design/assets-raw/ (ignored by Git); only the optimised files are committed.
 */
const RAW = "design/assets-raw";
const OUT = "public/assets";
const CREDITS = join(OUT, "CREDITS.md");
const WIDTHS = [480, 960, 1920, 3840];
const IMG = /\.(png|jpe?g|webp|avif|tiff?)$/i;

const args = process.argv.slice(2);
const force = args.includes("--force");
const avif = args.includes("--avif");
const onlyArg = args.indexOf("--only");
const only = onlyArg >= 0 ? new Set((args[onlyArg + 1] ?? "").split(",").map((s) => s.trim()).filter(Boolean)) : null;

const known = new Set<string>([...Object.keys(SLOTS), ...loadAtlas().filter((e) => e.status === "published").map((e) => `atlas-${e.id}`)]);
const norm = (s: string) => s.toLowerCase().replace(/[\s_.]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : IMG.test(e.name) ? [join(dir, e.name)] : []));
}

function closest(name: string): string | null {
  let best: string | null = null, bestD = 4;
  for (const k of known) {
    const d = lev(name, k);
    if (d < bestD) { bestD = d; best = k; }
  }
  return best;
}
function lev(a: string, b: string): number {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

/** Mean brightness (0-255) of the outer ring of the picture: a "black" motif should have an almost black edge. */
async function edgeBrightness(img: Sharp): Promise<number> {
  const n = 32;
  const { data } = await img.clone().resize(n, n, { fit: "fill" }).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true });
  let sum = 0, cnt = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (x === 0 || y === 0 || x === n - 1 || y === n - 1) { sum += data[y * n + x]; cnt++; }
  return sum / cnt;
}

if (!existsSync(RAW)) { console.error(`Ordner ${RAW} fehlt. Lege dort deine Original-Bilder ab.`); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const files = walk(RAW);
if (!files.length) { console.log(`In ${RAW} liegen noch keine Bilder.`); process.exit(0); }

const unknown: string[] = [];
const done: { name: string; files: number; kb: number }[] = [];
const warnings: string[] = [];
const credited = existsSync(CREDITS) ? readFileSync(CREDITS, "utf8") : "";
const today = new Date().toISOString().slice(0, 10);
const seen = new Set<string>();

for (const file of files.sort()) {
  const name = norm(basename(file, extname(file)));
  if (!known.has(name)) { unknown.push(`${relative(".", file)}${closest(name) ? `  → meintest du „${closest(name)}“?` : ""}`); continue; }
  if (only && !only.has(name)) continue;
  if (seen.has(name)) { warnings.push(`${name}: mehrere Originale – nur das erste wird benutzt (${relative(".", file)} übersprungen).`); continue; }
  seen.add(name);

  const def = slotDef(name)!;
  const out = (w: number, ext: string) => join(OUT, `${name}-${w}.${ext}`);
  const srcTime = statSync(file).mtimeMs;
  const existing = readdirSync(OUT).filter((f) => new RegExp(`^${name}(-\\d+)?\\.(webp|avif)$`).test(f));
  if (!force && existing.length && existing.every((f) => statSync(join(OUT, f)).mtimeMs >= srcTime)) { console.log(`· ${name}: schon aktuell (übersprungen)`); continue; }

  let img = sharp(file, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  if (!meta.width || !meta.height) { warnings.push(`${name}: Datei konnte nicht gelesen werden.`); continue; }

  const want = def.w / def.h, have = meta.width / meta.height;
  let w0 = meta.width, h0 = meta.height;
  if (Math.abs(have / want - 1) > 0.02) {
    // the slot has a fixed ratio; centre-crop to it and say so (the figure may sit off-centre)
    if (have > want) w0 = Math.round(meta.height * want); else h0 = Math.round(meta.width / want);
    img = sharp(await img.extract({ left: Math.floor((meta.width - w0) / 2), top: Math.floor((meta.height - h0) / 2), width: w0, height: h0 }).toBuffer());
    warnings.push(`${name}: Seitenverhältnis ${meta.width}×${meta.height} passt nicht zu ${def.w}×${def.h} – mittig zugeschnitten auf ${w0}×${h0}. Besser neu erzeugen, falls etwas fehlt.`);
  }
  if (w0 < def.w * 0.5) warnings.push(`${name}: nur ${w0}px breit (Ziel ${def.w}px) – wirkt evtl. unscharf.`);

  if (def.bg === "black") {
    const b = await edgeBrightness(img);
    if (b > 40) warnings.push(`${name}: Hintergrund ist nicht schwarz (Randhelligkeit ${Math.round(b)}/255). Bei Typ „Schwarz“ wirkt das nach dem Einblenden grau/milchig.`);
  }

  // remove older variants of this slot, then write the new ones (never upscale)
  for (const f of existing) rmSync(join(OUT, f));
  const widths = [...new Set([...WIDTHS.filter((w) => w < Math.min(w0, def.w)), Math.min(w0, def.w)])];
  let bytes = 0, count = 0;
  for (const w of widths) {
    const resized = img.clone().resize({ width: w, withoutEnlargement: true });
    const q = def.bg === "black" ? 88 : 82; // dark gradients band easily: black motifs get a higher quality
    const webp = await resized.clone().webp({ quality: q, effort: 5, smartSubsample: true }).toBuffer();
    writeFileSync(out(w, "webp"), webp); bytes += webp.length; count++;
    if (avif) { const a = await resized.clone().avif({ quality: q - 28, effort: 4 }).toBuffer(); writeFileSync(out(w, "avif"), a); bytes += a.length; count++; }
  }
  done.push({ name, files: count, kb: Math.round(bytes / 1024) });
  console.log(`✓ ${name}: ${widths.join(", ")} px → ${Math.round(bytes / 1024)} KB`);

  if (!credited.includes(`| ${name} |`)) {
    appendFileSync(CREDITS, `| ${name} | ChatGPT (Bildgenerierung, vom Nutzer erzeugt) | Prompt: siehe docs/ASSET-LIST.md, Eintrag „${name}“ | ${today} | Vom Nutzer erzeugt; Nutzungsrechte laut Bedingungen des Anbieters – vor Veröffentlichung prüfen. Erzeugtes Bild, kein Foto. |\n`);
  }
}

const have = new Set(readdirSync(OUT).filter((f) => /\.(webp|avif)$/.test(f)).map((f) => f.replace(/(-\d+)?\.(webp|avif)$/, "")));
const p1 = Object.entries(SLOTS).filter(([, d]) => d.prio === 1).map(([n]) => n).filter((n) => !have.has(n));

console.log("");
if (unknown.length) { console.log("Nicht erkannt (Name passt zu keinem Bild aus der Liste):"); unknown.forEach((u) => console.log("  - " + u)); console.log(""); }
if (warnings.length) { console.log("Hinweise:"); warnings.forEach((w) => console.log("  ! " + w)); console.log(""); }
console.log(`${done.length} Bild(er) verarbeitet. Insgesamt ${have.size} von ${known.size} Bildplätzen gefüllt.`);
if (p1.length) console.log(`Noch offen in Priorität 1 (Hero): ${p1.join(", ")}`);
