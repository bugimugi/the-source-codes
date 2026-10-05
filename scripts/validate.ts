import { claims } from "../src/data/claims.ts";
import { validateClaims } from "../src/data/validate.ts";

const errors = validateClaims(claims);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK – ${claims.length} Aussagen geprüft`);
