import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { loadAtlas, loadClaims } from "./load.ts";
import { PROFILES } from "../src/data/profiles.ts";
import { RECIPES } from "../src/data/recipes.ts";
import { ORIGIN } from "../src/data/plants.ts";
import { BODY_ORGANS } from "../src/data/body.ts";
import { profileFor } from "../src/data/profileDerive.ts";
import { PLANT_LIKE, SECTIONS } from "../src/data/profileTemplate.ts";
import { CATEGORY_LABEL } from "../src/data/types.ts";

/**
 * Writes docs/FEHLENDE-INHALTE.md: for every plant-like atlas entry that gets a DERIVED profile, which sections show a placeholder,
 * which mushroom fields are empty and whether the picture `atlas-<id>` is missing. Nothing is invented: the list is computed from
 * `deriveProfile` (src/data/profileDerive.ts) and the files in public/assets. Run: npm run profile:missing
 */
const atlas = loadAtlas().filter((e) => e.status === "published");
const claims = loadClaims().filter((c) => c.status === "published");
const ctx = { entries: atlas, claims, recipes: RECIPES, origin: ORIGIN, organs: BODY_ORGANS };
const label = Object.fromEntries(SECTIONS.map((s) => [s.id, s.missingLabel]));

const assetsDir = new URL("../public/assets/", import.meta.url);
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : [];
const hasImage = (id: string) => assetFiles.some((f) => new RegExp(`^atlas-${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(-\\d+)?\\.(webp|avif|jpe?g|png)$`).test(f));

const order = (c: string) => PLANT_LIKE.indexOf(c);
const entries = atlas.filter((e) => PLANT_LIKE.includes(e.category)).sort((a, b) => order(a.category) - order(b.category) || a.name.localeCompare(b.name, "de"));

interface Row { id: string; name: string; category: string; missing: string[]; fields: string[]; image: boolean }
const rows: Row[] = [];
const hand: string[] = [];
for (const e of entries) {
  const p = profileFor(e, ctx, PROFILES);
  if (!p) continue;
  if (!p.derived) { hand.push(e.name); continue; }
  const fields = (p.fungus ?? []).filter((f) => f.value === null).sort((a, b) => Number(!!b.safety) - Number(!!a.safety)).map((f) => (f.safety ? `${f.label} (Sicherheit)` : f.label));
  rows.push({ id: e.id, name: e.name, category: CATEGORY_LABEL[e.category], missing: p.missing ?? [], fields, image: hasImage(e.id) });
}

// sections that are a placeholder for every derived entry (only a hand-written profile can fill them)
const always = SECTIONS.filter((s) => rows.length && rows.every((r) => r.missing.includes(s.id)));
const alwaysIds = new Set(always.map((s) => s.id));

const lines: string[] = [];
lines.push("# Fehlende Inhalte der Pflanzenseiten", "");
lines.push("Diese Liste wird mit `npm run profile:missing` aus den Daten erzeugt (nicht von Hand ändern). Sie zeigt, wo eine Eintragsseite einen **dezenten Platzhalter** statt Inhalt zeigt. Nichts davon ist erfunden oder geschätzt: Wo ein Atlas-Eintrag keinen passenden Fakt hat, bleibt der Platz leer.", "");
lines.push(`**Stand:** ${rows.length} Einträge mit abgeleiteter Seite; ${hand.length} Einträge mit Handprofil (${hand.join(", ")}) sind vollständig und stehen hier nicht.`, "");
lines.push("## So füllst du eine Lücke", "");
lines.push("- **Atlas-Fakt eintragen:** in `content/atlas/<id>.json` unter `facts` einen Fakt mit genau der Beschriftung aus der Spalte „Fakt“ ergänzen (Quelle dazu nennen). Die Seite übernimmt ihn automatisch.");
lines.push("- **Aussage:** in `content/claims/` anlegen und die Id in `claims` des Eintrags eintragen. **Kombination:** in `combinations`. **Herkunftsregion:** in `ORIGIN` (`src/data/plants.ts`). **Rezept:** nennt den Eintrag über die Zutaten-Id.");
lines.push("- **Bild:** `atlas-<id>` erzeugen und mit `npm run assets:optimize` einbauen.", "");

lines.push("## Bei allen abgeleiteten Seiten leer", "");
lines.push("Diese Abschnitte zeigen bei jedem Eintrag mit abgeleiteter Seite einen Platzhalter. Vier davon füllt nur ein Handprofil (wie Ashwagandha), weil sie Bilder, Datierungen oder eine Quelle mit Wert brauchen; „Geschmack, Duft, Textur“ lässt sich mit Atlas-Fakten füllen, es hat nur noch kein Eintrag sie.", "");
for (const s of always) lines.push(`- **${s.missingLabel}** – ${s.source}`);
lines.push("");

lines.push("## Wie oft ein Abschnitt fehlt", "");
lines.push("| Abschnitt | Fakt / Quelle, die ihn füllt | Seiten ohne Inhalt |", "|---|---|---|");
for (const s of SECTIONS) {
  if (alwaysIds.has(s.id)) continue;
  const relevant = rows.filter((r) => (s.appliesTo === "mushroom" ? r.category === CATEGORY_LABEL.pilz : s.appliesTo === "plant" ? r.category !== CATEGORY_LABEL.pilz : true));
  const n = relevant.filter((r) => r.missing.includes(s.id)).length;
  lines.push(`| ${s.missingLabel} | ${s.source.replace(/\|/g, "/")} | ${n} von ${relevant.length} |`);
}
const noImg = rows.filter((r) => !r.image).length;
lines.push(`| Bild \`atlas-<id>\` | Datei in \`public/assets\` | ${noImg} von ${rows.length} |`, "");

lines.push("## Pro Eintrag", "");
lines.push("Die Abschnitte aus „Bei allen abgeleiteten Seiten leer“ fehlen überall und stehen hier nicht noch einmal.", "");
let cat = "";
for (const r of rows) {
  if (r.category !== cat) { cat = r.category; lines.push(`### ${cat}`, ""); }
  const parts = [
    ...(r.fields.length && !r.missing.includes("pp-fungus") ? [`Pilz-Felder: ${r.fields.join(", ")}`] : []),
    ...r.missing.filter((m) => !alwaysIds.has(m)).map((m) => label[m]),
  ];
  lines.push(`- **${r.name}** (\`${r.id}\`)`);
  lines.push(`  - Fehlt: ${parts.length ? parts.join(" · ") : "nichts außer den Abschnitten oben"}`);
  if (!r.image) lines.push(`  - Bild fehlt: \`atlas-${r.id}\``);
}
lines.push("");

lines.push("## Bildplätze, die nicht für jeden Eintrag vorgesehen sind", "");
lines.push("Nur `atlas-<id>` gilt für jeden Eintrag. Die Plätze `plant-<id>-…` (Titelbild, Bildtafel, Fotos, Wachstumsstufen, Herkunft) gibt es nur für Ashwagandha und Granatapfel; abgeleitete Seiten zeigen dafür den Platzhalter „Bild folgt“, keine gezeichnete Ersatzpflanze. Sollen sie für jeden Eintrag gelten, braucht `slotDef` in `src/assets/registry.ts` ein Muster dafür (offene Entscheidung).", "");

writeFileSync(new URL("../docs/FEHLENDE-INHALTE.md", import.meta.url), lines.join("\n"), "utf8");
console.log(`docs/FEHLENDE-INHALTE.md: ${rows.length} Einträge, ${rows.filter((r) => !r.image).length} ohne Bild atlas-<id>, ${hand.length} Handprofile`);
