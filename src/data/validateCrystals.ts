import { APPS, CRYSTALS, FREQS, GROUPS, HISTORY, STUDIES, SYSTEMS, THEMES } from "./crystals.ts";

/**
 * Checks the crystal landing page against the rest of the knowledge base: every crystal needs its atlas entry, every claim id and
 * picture name must exist, and every crystal system a crystal names must be one of the seven. Returns blocking errors.
 */
export function validateCrystalPage(atlasIds: Set<string>, claimIds: Set<string>, slotExists: (name: string) => boolean): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Kristall-Seite: ${m}`);
  const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte Aussage "${id}"`); };
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  const systems = new Set<string>(SYSTEMS.map((s) => s.id));
  for (const c of CRYSTALS) {
    if (!atlasIds.has(c.id)) at(`Kristall "${c.id}" hat keinen Atlas-Eintrag`);
    if (c.system && !systems.has(c.system)) at(`Kristall "${c.id}": unbekanntes Kristallsystem "${c.system}"`);
    if (!c.places.length) at(`Kristall "${c.id}" ohne Fundorte`);
    for (const p of c.places) if (Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180) at(`Kristall "${c.id}": Koordinate von ${p.name} außerhalb der Erde`);
    if (!c.uses.some((u) => u.kind === "dok")) at(`Kristall "${c.id}": keine dokumentierte Verwendung genannt`);
  }
  if (new Set(CRYSTALS.map((c) => c.id)).size !== CRYSTALS.length) at("doppelter Kristall");
  APPS.forEach((a) => { claim(a.claim, `Anwendung ${a.id}`); slot(`kristall-anw-${a.id}`, "Anwendung"); });
  FREQS.forEach((f) => claim(f.claim, `Frequenz ${f.id}`));
  STUDIES.forEach((s) => { claim(s.claim, `Studie ${s.id}`); if (!s.claim && !s.url) at(`Studie ${s.id}: weder Aussage noch Link`); if (s.url && !/^https:\/\//.test(s.url)) at(`Studie ${s.id}: Link muss mit https:// beginnen`); });
  HISTORY.forEach((h) => slot(`kristall-hist-${h.id}`, "Geschichte"));
  THEMES.forEach((t) => slot(`kristall-thema-${t.id}`, "Thema"));
  GROUPS.forEach((g) => slot(g.slot, "Kategorie"));
  for (const s of ["kristall-hero", "kristall-system", "kristall-map", "kristall-amethyst-1", "kristall-amethyst-4"]) slot(s, s);
  return errors;
}
