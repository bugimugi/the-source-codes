import { isSettled } from "../src/data/types.ts";
import { loadAtlas, loadClaims } from "./load.ts";
import { RECIPES } from "../src/data/recipes.ts";

/**
 * Release gate. The pilot site may contain unreviewed content; a public release may not.
 * Fails while any published claim is unreviewed, still "claimed", or cites an unchecked source.
 */
const claims = loadClaims().filter((c) => c.status === "published");
const atlas = loadAtlas().filter((e) => e.status === "published");
const problems: string[] = [];

for (const c of claims) {
  if (!isSettled(c)) problems.push(`${c.id}: Fachprüfung offen (${c.review?.state ?? "pending"})`);
  if (c.level === "claimed") problems.push(`${c.id}: Belegstufe noch „claimed“`);
  for (const s of c.sources) if (!s.verified) problems.push(`${c.id}/${s.id}: Quelle nicht gegen das Original geprüft`);
}
for (const r of RECIPES) if (r.review?.state !== "confirmed" && r.review?.state !== "corrected") problems.push(`rezept/${r.id}: Fachprüfung offen (${r.review?.state ?? "pending"})`);
for (const e of atlas) for (const s of e.sources) if (!s.verified) problems.push(`atlas/${e.id}/${s.id}: Quelle nicht geprüft`);

if (problems.length) {
  const shown = problems.slice(0, 40).map((p) => "  - " + p).join("\n");
  console.error(`NICHT FREIGEGEBEN – ${problems.length} offene Punkte (Pilot-Inhalte dürfen nicht veröffentlicht werden):\n${shown}${problems.length > 40 ? `\n  … und ${problems.length - 40} weitere` : ""}`);
  process.exit(1);
}
console.log(`FREIGEGEBEN – ${claims.length} Aussagen und ${atlas.length} Atlas-Einträge sind fachlich geprüft.`);
