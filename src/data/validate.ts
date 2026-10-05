import type { Claim, EvidenceLevel, SourceKind } from "./types";

const STRONG_SOURCES: SourceKind[] = ["peer-reviewed", "systematic-review"];
const STRONG_LEVELS: EvidenceLevel[] = ["established", "supported"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Integrity rules for the knowledge base. Returns blocking errors and
 * non-blocking warnings.
 *
 * Errors:
 * - duplicate claim ids, missing rationale, no source
 * - "established"/"supported" need a verified peer-reviewed source;
 *   interviews, patents and lab records alone cannot carry them
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
    if (
      STRONG_LEVELS.includes(c.level) &&
      !c.sources.some((s) => STRONG_SOURCES.includes(s.kind) && s.verified)
    ) {
      errors.push(`${c.id}: Stufe "${c.level}" braucht eine verifizierte Peer-Review-Quelle`);
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
    for (const r of c.related ?? []) {
      if (!ids.has(r)) errors.push(`${c.id}: unbekannte Verknüpfung "${r}"`);
    }
  }
  return { errors, warnings };
}
