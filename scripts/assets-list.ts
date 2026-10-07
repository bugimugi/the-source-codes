import { writeFileSync } from "node:fs";
import { SLOTS, ATLAS_SLOT } from "../src/assets/registry.ts";
import { loadAtlas } from "./load.ts";

/** Generates docs/ASSET-LIST.md from src/assets/registry.ts (single source of truth). */
const STYLE = "cinematic, ultra detailed, deep space navy background (#02070B), antique gold (#CBAA67) and electric cyan (#58D6E8) light, soft volumetric glow, scientific documentary look, elegant, calm, no text, no watermark, no logo";
const out: string[] = [];
out.push("# Bildliste (Asset-Liste) für THE SOURCE CODES", "",
  "**Automatisch erzeugt** aus `src/assets/registry.ts` (`npm run assets:list`). Dort stehen Name, Format und Prompt-Kern jedes Bildes.",
  "Die Landingpage-Vorschauen (`public/references`, lokal) sind nur Layout-Vorlagen; die einzelnen Bilder werden separat erzeugt.", "",
  "## Gemeinsame Regeln",
  "- **Kein Text, keine Logos, keine Wasserzeichen, keine Oberflächen-Elemente (Buttons, Panels, „Verified“-Stempel) im Bild.** Alles Geschriebene baut der Code.",
  `- **Stil-Zusatz an jeden Prompt anhängen:** \`${STYLE}\``,
  "- **Einheitlicher Look:** Wenn dein Werkzeug Style-Referenzen erlaubt, gib immer dieselbe Vorschau mit (Midjourney `--sref`, Firefly/Higgsfield Style-Reference).",
  "- **Typ „Schwarz“:** Leuchtendes Motiv auf **reinem Schwarz** erzeugen. Der Code legt es mit „Screen“-Überblendung über die Szene (keine Transparenz nötig).",
  "- **Typ „Szene“:** Vollständiges, deckendes Bild.",
  "- **Format:** Seitenverhältnis wie in der Tabelle (Pixelgröße = Zielgröße, größer ist in Ordnung). PNG/JPG in bester Qualität.",
  "- **Ablage:** Originale in `design/assets-raw/` (bleibt lokal), Dateiname = Name aus der Tabelle (z. B. `hero-world.png`). Dann `npm run assets:optimize` ausführen: es erzeugt verkleinerte WebP-Dateien in `public/assets/` (mehrere Breiten), trägt die Herkunft in `CREDITS.md` ein und warnt bei falschem Format oder nicht schwarzem Hintergrund. Sobald eine Datei dort liegt, wird sie automatisch verwendet.",
  "- **Herkunft:** Pro Bild Werkzeug, Prompt und Datum in `public/assets/CREDITS.md`. Erzeugte Bilder realer Orte als „Illustration“ kennzeichnen; für reale Orte sind eigene oder frei lizenzierte Fotos besser.",
  "- Keine erkennbaren realen lebenden Personen.", "");
const rows = Object.entries(SLOTS as Record<string, typeof ATLAS_SLOT & { mobile?: string }>);
const prios = [...new Set(rows.map(([, d]) => d.prio))].sort();
const titles: Record<number, string> = { 1: "Priorität 1 – Hero (zuerst)", 2: "Priorität 2 – Wissensmatrix-Kacheln", 3: "Priorität 3 – Startseiten-Abschnitte", 4: "Priorität 4 – Körper-Seite", 5: "Priorität 5 – Orte und Frequenzen", 6: "Priorität 6 – Alte Kulturen", 7: "Priorität 7 – Freie Energie der Erde" };
for (const p of prios) {
  out.push(`## ${titles[p] ?? `Priorität ${p}`}`, "", "| Datei | Größe | Typ | Prompt-Kern |", "|---|---|---|---|");
  for (const [name, d] of rows.filter(([, x]) => x.prio === p))
    out.push(`| \`${name}\` | ${d.w}×${d.h} | ${d.bg === "black" ? "Schwarz" : "Szene"} | ${d.prompt} |`);
  out.push("");
}
const atlas = loadAtlas().filter((e) => e.status === "published");
out.push("## Atlas-Einträge (ein Bild pro Eintrag)", "", `Name \`atlas-<id>\`, ${ATLAS_SLOT.w}×${ATLAS_SLOT.h}, Typ Schwarz. Prompt-Kern: ${ATLAS_SLOT.prompt}. Das Motiv steht im Prompt-Kern jeweils zuerst.`, "", "| Datei | Motiv |", "|---|---|");
for (const e of atlas) out.push(`| \`atlas-${e.id}\` | ${e.name} (${e.latin}) |`);
out.push("", `Insgesamt ${rows.length + atlas.length} Bilder. Starte mit Priorität 1 und prüfe zuerst **ein** Bild auf den Stil, bevor du den Rest erzeugst. Claude erzeugt keine Bilder.`);
writeFileSync(new URL("../docs/ASSET-LIST.md", import.meta.url), out.join("\n") + "\n");
console.log(`docs/ASSET-LIST.md geschrieben – ${rows.length + atlas.length} Bilder.`);
