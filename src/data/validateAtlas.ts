import type { AtlasEntry, Claim } from "./types";

/** Integrity rules for atlas entries. Facts are descriptive; every effect statement must be a graded claim. */
export function validateAtlas(entries: AtlasEntry[], claims: Claim[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  const claimIds = new Set(claims.map((c) => c.id));
  for (const e of entries) {
    if (ids.has(e.id)) errors.push(`atlas/${e.id}: doppelte ID`);
    ids.add(e.id);
  }
  for (const e of entries) {
    const at = `atlas/${e.id}`;
    if (e.facts.length === 0) errors.push(`${at}: keine Fakten`);
    if (e.sources.length === 0) errors.push(`${at}: keine Quelle für die Fakten`);
    for (const s of e.sources) if (!s.verified) warnings.push(`${at}/${s.id}: Quelle nicht verifiziert`);
    for (const a of e.associations) {
      if (!a.origin) errors.push(`${at}: Zuordnung "${a.target}" ohne Herkunftsangabe (origin)`);
    }
    for (const c of e.claims) if (!claimIds.has(c)) errors.push(`${at}: unbekannte Aussage "${c}"`);
    for (const k of e.combinations) if (!ids.has(k.with)) errors.push(`${at}: unbekannte Kombination "${k.with}"`);
    if (e.status === "published" && e.associations.length > 0 && e.claims.length === 0)
      warnings.push(`${at}: Zuordnungen, aber keine bewertete Aussage dazu`);
  }
  return { errors, warnings };
}
