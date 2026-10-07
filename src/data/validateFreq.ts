import { CATS, HERO_CHIPS, HZ_LORE, HZ_MAX, HZ_MIN, LEVEL_POS, ORBS, POWER, WORLD } from "./freqpage.ts";

/**
 * Checks the frequency landing page against the rest of the knowledge base: every claim id and picture name must exist, the
 * popular frequencies must lie in the range the explorer can play, and the page's own targets (chips, categories) must be known.
 * Returns blocking errors.
 */
export function validateFreqPage(claimIds: Set<string>, slotExists: (name: string) => boolean, levels: string[]): string[] {
  const errors: string[] = [];
  const at = (m: string) => errors.push(`Frequenz-Seite: ${m}`);
  const claim = (id: string | undefined, where: string) => { if (id && !claimIds.has(id)) at(`${where}: unbekannte oder nicht veröffentlichte Aussage "${id}"`); };
  const slot = (name: string, where: string) => { if (!slotExists(name)) at(`${where}: unbekannter Bildplatz "${name}" (registry.ts)`); };
  ORBS.forEach((o) => { slot(`freq-kugel-${o.id}`, `Kugel ${o.id}`); claim(o.claim, `Kugel ${o.id}`); if (o.cat && !CATS.some((c) => c.id === o.cat)) at(`Kugel ${o.id}: unbekannte Kategorie "${o.cat}"`); if (o.title.length < 2) at(`Kugel ${o.id}: zu wenig Text`); });
  POWER.forEach((p) => { slot(p.slot, `Karte ${p.id}`); p.claims.forEach((c) => claim(c, `Karte ${p.id}`)); });
  WORLD.forEach((w) => { slot(w.slot, `Welt ${w.id}`); w.claims.forEach((c) => claim(c, `Welt ${w.id}`)); });
  for (const f of HZ_LORE) if (f.hz < HZ_MIN || f.hz > HZ_MAX) at(`Frequenz ${f.hz} Hz liegt außerhalb ${HZ_MIN}–${HZ_MAX} Hz`);
  const targets = new Set([...ORBS.map((o) => `orb:${o.id}`), ...POWER.map((p) => `power:${p.id}`), ...WORLD.map((w) => `world:${w.id}`), "fq-explorer", "fx"]);
  HERO_CHIPS.forEach((c) => { if (!targets.has(c.to)) at(`Chip "${c.id}": unbekanntes Ziel "${c.to}"`); });
  for (const l of levels) if (!(l in LEVEL_POS)) at(`Belegstufe "${l}" fehlt auf der Anzeige (LEVEL_POS)`);
  claim("freq-solfeggio", "Explorer"); claim("freq-432-440-pilot", "Explorer");
  for (const s of ["freq-hero", "freq-schluss"]) slot(s, s);
  return errors;
}
