import { readdirSync, readFileSync } from "node:fs";
import { validateClaims } from "../src/data/validate.ts";
import { validateAtlas } from "../src/data/validateAtlas.ts";
import { validateRecipes } from "../src/data/validateRecipes.ts";
import { RECIPES } from "../src/data/recipes.ts";
import { PROFILES } from "../src/data/profiles.ts";
import { validateProfiles } from "../src/data/validateProfiles.ts";
import { slotDef } from "../src/assets/registry.ts";
import { FULL } from "../src/data/elementProfile.ts";
import { ELEMENTS } from "../src/data/elements.ts";
import { validateElementProfiles } from "../src/data/validateElements.ts";
import type { AtlasEntry, Claim } from "../src/data/types.ts";

const dir = new URL("../content/claims/", import.meta.url);
const claims: Claim[] = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .map((f) => {
    try {
      return JSON.parse(readFileSync(new URL(f, dir), "utf8")) as Claim;
    } catch (e) {
      console.error(`${f}: ungültiges JSON – ${(e as Error).message}`);
      process.exit(1);
    }
  });

const atlasDir = new URL("../content/atlas/", import.meta.url);
const atlasEntries: AtlasEntry[] = readdirSync(atlasDir)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .map((f) => JSON.parse(readFileSync(new URL(f, atlasDir), "utf8")) as AtlasEntry);

const c1 = validateClaims(claims);
const c2 = validateAtlas(atlasEntries, claims);
const c3 = validateRecipes(RECIPES);
const c4 = validateProfiles(Object.values(PROFILES), new Set(claims.filter((c) => c.status === "published").map((c) => c.id)), new Set(atlasEntries.filter((e) => e.status === "published").map((e) => e.id)), (n) => !!slotDef(n));
const c5 = validateElementProfiles(FULL, new Set(ELEMENTS.map((e) => e.sym)), new Set(claims.filter((c) => c.status === "published").map((c) => c.id)), (n) => !!slotDef(n));
const errors = [...c1.errors, ...c2.errors, ...c3.errors, ...c4, ...c5];
const warnings = [...c1.warnings, ...c2.warnings, ...c3.warnings];
const verbose = process.argv.includes("--report");
if (verbose && warnings.length) console.log(`Hinweise:\n${warnings.map((w) => "  - " + w).join("\n")}\n`);
if (errors.length) {
  console.error(`Fehler:\n${errors.map((e) => "  - " + e).join("\n")}`);
  process.exit(1);
}
const published = claims.filter((c) => c.status === "published").length;
console.log(`OK – ${claims.length} Aussagen (${published} veröffentlicht, ${claims.length - published} Entwurf), ${atlasEntries.length} Atlas-Einträge, ${RECIPES.length} Rezepte, ${Object.keys(PROFILES).length} Pflanzenprofile, ${Object.keys(FULL).length} Elementprofil, ${warnings.length} Hinweise${verbose ? "" : " (mit --report anzeigen)"}`);
