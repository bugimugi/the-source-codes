import { isSettled, type Claim, type EvidenceLevel, type SourceKind } from "./types.ts";

const STRONG_SOURCES: SourceKind[] = ["peer-reviewed", "systematic-review"];
const STRONG_LEVELS: EvidenceLevel[] = ["established", "supported"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Integrity rules for the knowledge base. Returns blocking errors and
 * non-blocking warnings.
 *
 * Pilot workflow: content is built first and reviewed by experts afterwards. Until a claim is reviewed
 * (review.state "confirmed"/"corrected"), source rules are warnings; after review they are errors.
 * `npm run release:check` is the separate gate that blocks unreviewed content from release.
 *
 * Errors:
 * - duplicate claim ids, missing rationale, no source
 * - published "established"/"supported" claims need a verified peer-reviewed source
 *   (drafts only get a warning); interviews, patents and lab records alone cannot carry them.
 *   Exception: type "text-finding" may reach "supported" (never "established") through a verified
 *   text-count source with a disclosed counting rule and at least two editions.
 * - interviews need written consent (consent: true) and an ISO date
 * - published claims need a related target that exists
 * Warnings:
 * - unverified citations, interview-only claims above "hypothesis"
 */
export function validateClaims(claims: Claim[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (const c of claims) {
    if (ids.has(c.id)) errors.push(`${c.id}: doppelte ID`);
    ids.add(c.id);
  }

  for (const c of claims) {
    if (!c.statement.trim()) errors.push(`${c.id}: statement fehlt`);
    if (!c.rationale.trim()) errors.push(`${c.id}: rationale fehlt`);
    if (c.sources.length === 0) errors.push(`${c.id}: keine Quelle`);
    const finding = c.type === "text-finding";
    const goodCount = (s: Claim["sources"][number]) =>
      s.kind === "text-count" && s.verified && !!s.method?.trim() && (s.editions?.length ?? 0) >= 2;
    if (finding) {
      if (c.level === "established") errors.push(`${c.id}: Textbefunde können nicht „established“ sein`);
      if (!c.sources.some((s) => s.kind === "text-count")) errors.push(`${c.id}: text-finding braucht eine Quelle vom Typ text-count`);
    }
    for (const s of c.sources) {
      if (s.kind === "text-count") {
        if (!s.method?.trim()) errors.push(`${c.id}/${s.id}: text-count braucht method (offengelegte Zählregel)`);
        if ((s.editions?.length ?? 0) < 2) errors.push(`${c.id}/${s.id}: text-count braucht mindestens zwei unabhängige Ausgaben (editions)`);
        if (!finding) errors.push(`${c.id}/${s.id}: text-count ist nur bei type "text-finding" zulässig`);
      }
    }
    if (
      STRONG_LEVELS.includes(c.level) &&
      !c.sources.some((s) => (STRONG_SOURCES.includes(s.kind) && s.verified) || (finding && goodCount(s)))
    ) {
      (c.status === "published" && isSettled(c) ? errors : warnings).push(
        `${c.id}: Stufe "${c.level}" braucht vor der Veröffentlichung eine verifizierte Peer-Review-Quelle`,
      );
    }
    for (const s of c.sources) {
      if (s.kind === "interview") {
        if (s.consent !== true) errors.push(`${c.id}/${s.id}: Interview ohne schriftliche Einwilligung (consent: true)`);
        if (!s.date || !ISO_DATE.test(s.date)) errors.push(`${c.id}/${s.id}: Interview braucht date im Format YYYY-MM-DD`);
      }
      if (!s.verified) warnings.push(`${c.id}/${s.id}: Zitat nicht verifiziert`);
    }
    if (c.sources.length > 0 && c.sources.every((s) => s.kind === "interview") && c.level !== "hypothesis" && c.level !== "unsupported" && c.level !== "refuted") {
      warnings.push(`${c.id}: nur Interview-Quellen, aber Stufe "${c.level}"`);
    }
    if (c.level === "claimed" && isSettled(c)) errors.push(`${c.id}: Nach der Fachprüfung muss eine echte Belegstufe statt „claimed“ vergeben werden`);
    if (isSettled(c) && (!c.review?.reviewer?.trim() || !c.review?.date || !ISO_DATE.test(c.review.date)))
      errors.push(`${c.id}: Fachprüfung ohne Name (reviewer) oder Datum (YYYY-MM-DD)`);
    for (const r of c.related ?? []) {
      if (!ids.has(r)) errors.push(`${c.id}: unbekannte Verknüpfung "${r}"`);
    }
  }
  return { errors, warnings };
}
