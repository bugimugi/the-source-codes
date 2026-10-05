import type { Claim, EvidenceLevel, SourceKind } from "./types";

const STRONG_SOURCES: SourceKind[] = ["peer-reviewed", "systematic-review"];
const STRONG_LEVELS: EvidenceLevel[] = ["established", "supported"];

/**
 * Integrity rules for the knowledge base. Returns a list of problems.
 * - "established"/"supported" need at least one verified peer-reviewed source;
 *   interviews, patents and lab records alone cannot carry them.
 * - every claim needs a rationale and at least one source
 * - related ids must exist
 */
export function validateClaims(claims: Claim[]): string[] {
  const errors: string[] = [];
  const ids = new Set(claims.map((c) => c.id));

  for (const c of claims) {
    if (!c.rationale.trim()) errors.push(`${c.id}: rationale fehlt`);
    if (c.sources.length === 0) errors.push(`${c.id}: keine Quelle`);
    if (
      STRONG_LEVELS.includes(c.level) &&
      !c.sources.some((s) => STRONG_SOURCES.includes(s.kind) && s.verified)
    ) {
      errors.push(
        `${c.id}: Stufe "${c.level}" braucht eine verifizierte Peer-Review-Quelle`,
      );
    }
    for (const r of c.related ?? []) {
      if (!ids.has(r)) errors.push(`${c.id}: unbekannte Verknüpfung "${r}"`);
    }
  }
  return errors;
}
