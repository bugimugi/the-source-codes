import { readdirSync, readFileSync } from "node:fs";
import { validateClaims } from "../src/data/validate.ts";
import type { Claim } from "../src/data/types.ts";

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

const { errors, warnings } = validateClaims(claims);
const verbose = process.argv.includes("--report");
if (verbose && warnings.length) console.log(`Hinweise:\n${warnings.map((w) => "  - " + w).join("\n")}\n`);
if (errors.length) {
  console.error(`Fehler:\n${errors.map((e) => "  - " + e).join("\n")}`);
  process.exit(1);
}
const published = claims.filter((c) => c.status === "published").length;
console.log(`OK – ${claims.length} Aussagen (${published} veröffentlicht, ${claims.length - published} Entwurf), ${warnings.length} Hinweise${verbose ? "" : " (mit --report anzeigen)"}`);
