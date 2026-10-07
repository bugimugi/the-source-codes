import type { ElementFull } from "./elementProfile.ts";

/**
 * Checks the complete element profiles against the rest of the knowledge base: every claim id and picture name they use must
 * exist, ids inside a profile must be unique and the isotope shares must be given. Returns blocking errors.
 */
export function validateElementProfiles(
  profiles: Record<string, ElementFull>,
  symbols: Set<string>,
  claimIds: Set<string>,
  slotExists: (name: string) => boolean,
): string[] {
  const errors: string[] = [];
  for (const [sym, f] of Object.entries(profiles)) {
    const at = (m: string) => errors.push(`Element ${sym}: ${m}`);
    if (!symbols.has(sym) || f.sym !== sym) at("Symbol passt nicht zur Elementtabelle");
    const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte Aussage "${id}"`); };
    const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
    claim(f.bodyClaim, "Körper");
    f.apps.forEach((a) => claim(a.claim, `Anwendung ${a.id}`));
    f.research.forEach((r) => { claim(r.claim, `Forschung ${r.id}`); if (!/^https:\/\//.test(r.url)) at(`Forschung ${r.id}: Link muss mit https:// beginnen`); });
    f.apps.forEach((a) => slot(`element-${sym.toLowerCase()}-anw-${a.id}`, "Anwendung"));
    f.history.forEach((h) => slot(`element-${sym.toLowerCase()}-hist-${h.id}`, "Geschichte"));
    f.compounds.forEach((c) => slot(`element-${sym.toLowerCase()}-verb-${c.id}`, "Verbindung"));
    for (const s of ["hero", "universum", "erde-1", "erde-2"]) slot(`element-${sym.toLowerCase()}-${s}`, s);
    for (const [name, list] of [["Körper", f.body], ["Resonanz", f.resonance], ["Anwendungen", f.apps], ["Geschichte", f.history], ["Verbindungen", f.compounds], ["Isotope", f.isotopes], ["Forschung", f.research]] as const) {
      const ids = list.map((x) => x.id);
      if (new Set(ids).size !== ids.length) at(`${name}: doppelte ID`);
    }
    if (f.isotopes.some((i) => !i.share)) at("Isotop ohne Häufigkeitsangabe");
  }
  return errors;
}
