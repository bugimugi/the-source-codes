import { mkdirSync, writeFileSync } from "node:fs";
import { AREA_LABEL, KIND_LABEL, LEVEL_LABEL, isSettled, type Claim } from "../src/data/types.ts";
import { loadAtlas, loadClaims } from "./load.ts";

/**
 * Writes a review sheet for experts: every statement with its status and sources, with space for a verdict.
 * Output: exports/expert-review.md (generated, not committed).
 */
const claims = loadClaims().filter((c) => c.status === "published");
const atlas = loadAtlas().filter((e) => e.status === "published");
const out: string[] = [];
out.push("# Prüfbogen für Fachleute – THE SOURCE CODES (Pilot)", "",
  "Bitte jede Aussage prüfen: **richtig / teilweise richtig / falsch / nicht beurteilbar**, bei Bedarf mit Korrektur und Quelle.", "",
  "Prüfer/in: ____________________  Fachgebiet: ____________________  Datum: ____________", "");

const byArea = new Map<string, Claim[]>();
for (const c of claims) byArea.set(c.area, [...(byArea.get(c.area) ?? []), c]);

for (const [area, list] of byArea) {
  out.push(`## ${AREA_LABEL[area as keyof typeof AREA_LABEL] ?? area}`, "");
  for (const c of list) {
    out.push(`### ${c.short ?? c.id}  \`${c.id}\``, "", `> ${c.statement}`, "",
      `- Belegstufe (derzeit): **${LEVEL_LABEL[c.level]}**`,
      `- Fachprüfung: ${isSettled(c) ? `${c.review!.state} (${c.review!.reviewer}, ${c.review!.date})` : "offen"}`,
      `- Begründung: ${c.rationale}`);
    if (c.body) out.push(`- Hintergrund: ${c.body.replace(/\n+/g, " ")}`);
    out.push("- Quellen:");
    for (const s of c.sources) out.push(`  - ${KIND_LABEL[s.kind]}: ${s.title} – ${s.author}${s.year ? ` (${s.year})` : ""}; ${s.citation} ${s.verified ? "" : "⚠ nicht geprüft"}`);
    out.push("", "Urteil:  ☐ richtig   ☐ teilweise richtig   ☐ falsch   ☐ nicht beurteilbar", "", "Korrektur / Quelle: ______________________________________________", "");
  }
}
if (atlas.length) {
  out.push("## Atlas (Pflanzen & Kristalle) – Fakten", "");
  for (const e of atlas) {
    out.push(`### ${e.name} (${e.latin})`, "", ...e.facts.map((f) => `- ${f.label}: ${f.value}`),
      ...(e.associations.length ? ["- Überlieferte Zuordnungen: " + e.associations.map((a) => `${a.target} (${a.system})`).join("; ")] : []),
      "", "Urteil:  ☐ richtig   ☐ teilweise richtig   ☐ falsch   ☐ nicht beurteilbar", "", "Korrektur: ______________________________________________", "");
  }
}
mkdirSync(new URL("../exports/", import.meta.url), { recursive: true });
writeFileSync(new URL("../exports/expert-review.md", import.meta.url), out.join("\n"));
console.log(`exports/expert-review.md geschrieben – ${claims.length} Aussagen, ${atlas.length} Atlas-Einträge.`);
